import { createClient } from '@/utils/supabase/server'
import { OrdersFilters } from '@/components/orders/OrdersFilters'
import { OrdersTable } from '@/components/orders/OrdersTable'
import { Suspense } from 'react'

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const supabase = await createClient()

    // Check user role
    const { data: { user } } = await supabase.auth.getUser()
    let isAdmin = false
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        isAdmin = profile?.role === 'admin'
    }

    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : ''
    const branch = typeof params.branch === 'string' ? params.branch : ''
    const status = typeof params.status === 'string' ? params.status : 'ALL'
    const dateFrom = typeof params.dateFrom === 'string' ? params.dateFrom : ''
    const dateTo = typeof params.dateTo === 'string' ? params.dateTo : ''
    const sort = typeof params.sort === 'string' ? params.sort : 'order_date'
    const dir = typeof params.dir === 'string' ? params.dir : 'desc'

    let query = supabase
        .from('orders')
        .select('*, branches(name), order_items(*, vehicles(id, plate_number))')

    if (search) {
        query = query.or(`intercars_id.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (branch) {
        // First try to get branch code from selected branch ID to match orders by branch_code
        const { data: selectedBranch } = await supabase
            .from('branches')
            .select('code')
            .eq('id', branch)
            .single()

        if (selectedBranch?.code) {
            // Filter by branch_code (orders may have this instead of branch_id)
            query = query.or(`branch_id.eq.${branch},branch_code.eq.${selectedBranch.code}`)
        } else {
            // Fallback to just branch_id
            query = query.eq('branch_id', branch)
        }
    }

    if (status !== 'ALL') {
        query = query.eq('status', status)
    }

    if (dateFrom) {
        query = query.gte('order_date', dateFrom)
    }

    if (dateTo) {
        query = query.lte('order_date', dateTo)
    }

    const sortDir = dir === 'desc' ? false : true
    query = query.order(sort, { ascending: sortDir })

    const { data: orders } = await query

    const { data: branches } = await supabase.from('branches').select('id, name').order('name')

    // Fetch vehicles for assignment - filtered by branch for managers
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

    const { data: vehicles } = await vehiclesQuery

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Zamówienia</h2>
            </div>

            <div className="flex flex-col space-y-4">
                <OrdersFilters branches={branches || []} showBranchFilter={isAdmin} />
                <Suspense fallback={<div>Ładowanie...</div>}>
                    <OrdersTable orders={orders || []} vehicles={vehicles || []} />
                </Suspense>
            </div>
        </div>
    )
}
