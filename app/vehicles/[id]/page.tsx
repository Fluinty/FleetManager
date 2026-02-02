import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { VehicleInfo } from '@/components/vehicles/VehicleInfo'
import { ExpensesChart } from '@/components/dashboard/ExpensesChart'
import { VehicleItemsHistory } from '@/components/vehicles/VehicleItemsHistory'
import { subMonths, format } from 'date-fns'

interface PageProps {
    params: { id: string }
}

import { AddInvoiceModal } from '@/components/vehicles/AddInvoiceModal'

export default async function VehicleDetailsPage({ params }: PageProps) {
    const supabase = await createClient()
    const { id } = await params

    // Check user role
    const { data: { user } } = await supabase.auth.getUser()
    let isAdmin = true
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        isAdmin = profile?.role === 'admin'
    }

    // 1. Fetch Vehicle Details
    const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*, branches(name)')
        .eq('id', id)
        .single()

    if (error || !vehicle) {
        notFound()
    }

    // 2. Fetch Order Items assigned to this vehicle (with order info for date/intercars_id)
    const { data: items } = await supabase
        .from('order_items')
        .select(`
            id,
            name,
            sku,
            required_quantity,
            total_gross,
            orders!inner(
                id,
                order_date,
                intercars_id
            )
        `)
        .eq('vehicle_id', id)
        .order('created_at', { ascending: false })

    // 3. Calculate Expenses Chart Data (Last 12 months) from items
    const expensesMap = new Map<string, number>()
    for (let i = 11; i >= 0; i--) {
        const d = subMonths(new Date(), i)
        expensesMap.set(format(d, 'MM/yyyy'), 0)
    }

    items?.forEach(item => {
        const order = Array.isArray(item.orders) ? item.orders[0] : item.orders
        if (order?.order_date) {
            const monthKey = format(new Date(order.order_date), 'MM/yyyy')
            if (expensesMap.has(monthKey)) {
                expensesMap.set(monthKey, (expensesMap.get(monthKey) || 0) + (item.total_gross || 0))
            }
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
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{vehicle.plate_number}</h2>
                    <span className="text-muted-foreground text-sm">{vehicle.brand} {vehicle.model}</span>
                </div>
                {isAdmin && (
                    <AddInvoiceModal vehicleId={id} vehiclePlate={vehicle.plate_number} />
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3">
                    <VehicleInfo vehicle={vehicle} branchName={branchName} />
                </div>
                <div className="col-span-4">
                    <ExpensesChart data={expensesData} />
                </div>
            </div>

            {isAdmin && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight">Przypisane Części</h3>
                    <VehicleItemsHistory items={items || []} />
                </div>
            )}
        </div>
    )
}
