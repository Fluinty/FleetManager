import { createClient } from '@/utils/supabase/server'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { ExpensesChart } from '@/components/dashboard/ExpensesChart'
import { TopVehiclesTable } from '@/components/dashboard/TopVehiclesTable'
import { RecentPendingList } from '@/components/dashboard/RecentPendingList'
import { subMonths, startOfMonth, format, isAfter } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Fetch Summary Counts
  const { count: vehicleCount } = await supabase
    .from('vehicles')
    .select('*', { count: 'estimated', head: true })
    .eq('is_active', true)

  const { count: pendingOrdersCount } = await supabase
    .from('unresolved_pending_orders')
    .select('*', { count: 'estimated', head: true })

  const { count: activeAlertsCount } = await supabase
    .from('budget_alerts')
    .select('*', { count: 'estimated', head: true })
    .eq('acknowledged', false)

  // 2. Fetch Orders for calculations (Last 6 months)
  const sixMonthsAgo = format(subMonths(new Date(), 6), 'yyyy-MM-dd')
  const startOfCurrentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd')

  const { data: orders } = await supabase
    .from('orders')
    .select('total_gross, order_date, vehicle_id, branch_code, branches(name), vehicles(plate_number, brand, model)')
    .gte('order_date', sixMonthsAgo)

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

  // Calculate Top Vehicles (This Month)
  const topVehiclesMap = new Map<string, any>()

  orders
    ?.filter(o => o.order_date >= startOfCurrentMonth && o.vehicle_id)
    .forEach(order => {
      // Supabase join types might be arrays depending on relationship definition
      const vData = Array.isArray(order.vehicles) ? order.vehicles[0] : order.vehicles
      const bData = Array.isArray(order.branches) ? order.branches[0] : order.branches

      const plate = vData?.plate_number || 'Unknown'
      const vehicleId = order.vehicle_id

      if (!topVehiclesMap.has(plate)) {
        topVehiclesMap.set(plate, {
          id: vehicleId,
          plate_number: plate,
          brand: vData?.brand || '',
          model: vData?.model || '',
          branch_name: bData?.name || order.branch_code || 'Brak',
          total_spent: 0,
          order_count: 0
        })
      }
      const v = topVehiclesMap.get(plate)
      v.total_spent += order.total_gross || 0
      v.order_count += 1
    })

  const topVehicles = Array.from(topVehiclesMap.values())
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, 10)


  // 3. Fetch Recent Pending List
  const { data: recentPending } = await supabase
    .from('unresolved_pending_orders')
    .select('id, order_date, error_type, total_gross')
    .order('order_date', { ascending: false })
    .limit(5)

  const formattedPending = recentPending?.map(p => ({
    id: p.id,
    order_date: p.order_date,
    total_gross: p.total_gross || 0,
    error_type: p.error_type || 'Unknown'
  })) || []


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
          <RecentPendingList items={formattedPending} />
        </div>
      </div>

      <TopVehiclesTable vehicles={topVehicles} />
    </div>
  )
}
