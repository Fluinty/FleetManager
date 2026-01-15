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
        .select('*, branches(name), vehicles(plate_number), order_items(*)')

    if (search) {
        query = query.or(`intercars_id.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (branch) {
        query = query.eq('branch_id', branch)
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

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Zamówienia</h2>
            </div>

            <div className="flex flex-col space-y-4">
                <OrdersFilters branches={branches || []} />
                <Suspense fallback={<div>Ładowanie...</div>}>
                    <OrdersTable orders={orders || []} />
                </Suspense>
            </div>
        </div>
    )
}
