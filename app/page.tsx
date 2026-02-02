import { createClient } from '@/utils/supabase/server'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { ExpensesChart } from '@/components/dashboard/ExpensesChart'
import { TopVehiclesTable } from '@/components/dashboard/TopVehiclesTable'
import { RecentPendingItems } from '@/components/dashboard/RecentPendingItems'
import { subMonths, startOfMonth, format, isAfter } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user and their profile
  const { data: { user } } = await supabase.auth.getUser()
  let userBranchCode: string | null = null
  let isAdmin = true

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, branch_id')
      .eq('id', user.id)
      .single()

    isAdmin = profile?.role === 'admin'

    // If manager, get their branch code
    if (profile?.role === 'manager' && profile?.branch_id) {
      const { data: branch } = await supabase
        .from('branches')
        .select('code')
        .eq('id', profile.branch_id)
        .single()
      userBranchCode = branch?.code || null
    }
  }

  // 1. Fetch Summary Counts
  const { count: vehicleCount } = await supabase
    .from('vehicles')
    .select('*', { count: 'estimated', head: true })
    .eq('is_active', true)

  // Pending orders count - filtered by branch for managers
  let pendingOrdersQuery = supabase
    .from('unresolved_pending_orders')
    .select('*', { count: 'estimated', head: true })

  if (!isAdmin && userBranchCode) {
    pendingOrdersQuery = pendingOrdersQuery.eq('branch_code', userBranchCode)
  }


  const { count: pendingOrdersCount } = await pendingOrdersQuery



  // Active vehicles for dropdown - filtered by branch for managers
  let vehiclesQuery = supabase
    .from('vehicles')
    .select('id, plate_number, branch_id')
    .eq('is_active', true)
    .order('plate_number', { ascending: true })

  if (!isAdmin && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('branch_id')
      .eq('id', user.id)
      .single()

    if (profile?.branch_id) {
      vehiclesQuery = vehiclesQuery.eq('branch_id', profile.branch_id)
    }
  }

  const { data: activeVehicles } = await vehiclesQuery

  const { count: activeAlertsCount } = await supabase
    .from('budget_alerts')
    .select('*', { count: 'estimated', head: true })
    .eq('acknowledged', false)

  // 2. Fetch Orders for chart and Order Items for vehicle stats (Last 6 months)
  const sixMonthsAgo = format(subMonths(new Date(), 6), 'yyyy-MM-dd')
  const startOfCurrentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd')

  const { data: orders } = await supabase
    .from('orders')
    .select('total_gross, order_date, branch_code, branches(name)')
    .gte('order_date', sixMonthsAgo)

  // Fetch order items with vehicle info for Top Vehicles calculation
  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      id,
      total_gross,
      vehicle_id,
      orders!inner(order_date, branch_code, branches(name)),
      vehicles(id, plate_number, brand, model)
    `)
    .not('vehicle_id', 'is', null)
    .gte('orders.order_date', startOfCurrentMonth)

  // Calculate Total Orders this month
  const totalOrdersAmount = orders
    ?.filter(o => o.order_date >= startOfCurrentMonth)
    .reduce((sum, o) => sum + (o.total_gross || 0), 0) || 0

  // Calculate Expenses Chart Data (Last 6 months)
  const expensesMap = new Map<string, number>()
  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(new Date(), i)
    expensesMap.set(format(d, 'MM/yyyy'), 0)
  }

  orders?.forEach(order => {
    const monthKey = format(new Date(order.order_date), 'MM/yyyy')
    if (expensesMap.has(monthKey)) {
      expensesMap.set(monthKey, (expensesMap.get(monthKey) || 0) + (order.total_gross || 0))
    }
  })

  const expensesData = Array.from(expensesMap.entries()).map(([month, amount]) => ({
    month,
    amount,
  }))

  // Calculate Top Vehicles (This Month) from order items
  const topVehiclesMap = new Map<string, any>()

  orderItems?.forEach(item => {
    const vData = Array.isArray(item.vehicles) ? item.vehicles[0] : item.vehicles
    const orderData = Array.isArray(item.orders) ? item.orders[0] : item.orders
    const bData = orderData?.branches ? (Array.isArray(orderData.branches) ? orderData.branches[0] : orderData.branches) : null

    if (!vData?.plate_number) return

    const plate = vData.plate_number

    if (!topVehiclesMap.has(plate)) {
      topVehiclesMap.set(plate, {
        id: vData.id || item.vehicle_id,
        plate_number: plate,
        brand: vData.brand || '',
        model: vData.model || '',
        branch_name: bData?.name || orderData?.branch_code || 'Brak',
        total_spent: 0,
        order_count: 0
      })
    }
    const v = topVehiclesMap.get(plate)
    v.total_spent += item.total_gross || 0
    v.order_count += 1
  })

  const topVehicles = Array.from(topVehiclesMap.values())
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, 10)


  // 3. Fetch Recent Pending Items - filtered by branch for managers
  let recentPendingQuery = supabase
    .from('unresolved_pending_items')
    .select('*')
    .order('order_date', { ascending: false })
    .limit(5)

  if (!isAdmin && userBranchCode) {
    recentPendingQuery = recentPendingQuery.eq('branch_code', userBranchCode)
  }

  const { data: recentPendingItems } = await recentPendingQuery


  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>

      <SummaryCards
        vehicleCount={vehicleCount || 0}
        totalOrdersAmount={totalOrdersAmount}
        pendingOrdersCount={pendingOrdersCount || 0}
        activeAlertsCount={activeAlertsCount || 0}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExpensesChart data={expensesData} />
        </div>
        <div className="lg:col-span-1">
          <RecentPendingItems items={recentPendingItems || []} vehicles={activeVehicles || []} />
        </div>
      </div>

      <TopVehiclesTable vehicles={topVehicles} />
    </div>
  )
}
