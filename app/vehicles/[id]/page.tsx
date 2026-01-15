import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { VehicleInfo } from '@/components/vehicles/VehicleInfo'
import { ExpensesChart } from '@/components/dashboard/ExpensesChart'
import { VehicleOrdersHistory } from '@/components/vehicles/VehicleOrdersHistory'
import { subMonths, format } from 'date-fns'

interface PageProps {
    params: { id: string }
}

export default async function VehicleDetailsPage({ params }: PageProps) {
    const supabase = await createClient()
    const { id } = await params

    // 1. Fetch Vehicle Details
    const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*, branches(name)')
        .eq('id', id)
        .single()

    if (error || !vehicle) {
        notFound()
    }

    // 2. Fetch Orders History (All time for list, last 12 months for chart)
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('vehicle_id', id)
        .order('order_date', { ascending: false })

    // 3. Calculate Expenses Chart Data (Last 12 months)
    const expensesMap = new Map<string, number>()
    for (let i = 11; i >= 0; i--) {
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

    const branchName = Array.isArray(vehicle.branches)
        ? vehicle.branches[0]?.name
        : vehicle.branches?.name

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{vehicle.plate_number}</h2>
                <span className="text-muted-foreground text-sm">{vehicle.brand} {vehicle.model}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3">
                    <VehicleInfo vehicle={vehicle} branchName={branchName} />
                </div>
                <div className="col-span-4">
                    <ExpensesChart data={expensesData} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Historia Zamówień</h3>
                <VehicleOrdersHistory orders={orders || []} />
            </div>
        </div>
    )
}
