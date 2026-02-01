import { createClient } from '@/utils/supabase/server'
import { VehiclesFilters } from '@/components/vehicles/VehiclesFilters'
import { VehiclesTable } from '@/components/vehicles/VehiclesTable'
import { Suspense } from 'react'

export default async function VehiclesPage({
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

    // Extract filters
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : ''
    const branch = typeof params.branch === 'string' ? params.branch : ''
    const status = typeof params.status === 'string' ? params.status : 'ACTIVE'
    const sort = typeof params.sort === 'string' ? params.sort : 'plate_number'
    const dir = typeof params.dir === 'string' ? params.dir : 'asc'

    // Build query
    let query = supabase
        .from('vehicles')
        .select('id, plate_number, brand, model, production_year, branch_id, next_inspection_date, next_insurance_date, is_active, branches(name)')

    if (status === 'ACTIVE') {
        query = query.eq('is_active', true)
    } else if (status === 'INACTIVE') {
        query = query.eq('is_active', false)
    }
    // 'ALL' - no filter on is_active

    if (branch) {
        query = query.eq('branch_id', branch)
    }

    if (search) {
        query = query.or(`plate_number.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`)
    }

    // Sorting
    const sortDir = dir === 'desc' ? false : true
    query = query.order(sort, { ascending: sortDir })

    const { data: vehicles } = await query

    // Fetch branches for filter
    const { data: branches } = await supabase.from('branches').select('id, name').order('name')

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Pojazdy</h2>
            </div>

            <div className="flex flex-col space-y-4">
                <VehiclesFilters branches={branches || []} showBranchFilter={isAdmin} />
                <Suspense fallback={<div>Ładowanie...</div>}>
                    <VehiclesTable vehicles={vehicles || []} />
                </Suspense>
            </div>
        </div>
    )
}
