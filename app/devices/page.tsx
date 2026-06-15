import { createClient } from '@/utils/supabase/server'
import { DevicesTable } from '@/components/devices/DevicesTable'
import { DevicesFilters } from '@/components/devices/DevicesFilters'
import { AddDeviceModal } from '@/components/devices/AddDeviceModal'
import { Suspense } from 'react'

export default async function DevicesPage({
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
    const params = await searchParams
    const deviceType = typeof params.type === 'string' ? params.type : ''
    const branch = typeof params.branch === 'string' ? params.branch : ''

    // Build devices query
    let query = supabase
        .from('devices')
        .select(`
            id,
            udt_number,
            device_type,
            name,
            vehicle_id,
            branch_id,
            last_inspection_date,
            decision_expiry_date,
            next_inspection_date,
            notes,
            is_active,
            created_at,
            updated_at,
            vehicles(id, plate_number, brand, model, vehicle_category),
            branches(id, name)
        `)
        .order('udt_number')

    if (deviceType === 'lift' || deviceType === 'forklift') {
        query = query.eq('device_type', deviceType)
    }

    if (branch) {
        query = query.eq('branch_id', branch)
    }

    const { data: devices } = await query

    // Fetch active vehicles for modals
    const { data: activeVehicles } = await supabase
        .from('vehicles')
        .select('id, plate_number, brand, model, branch_id')
        .eq('is_active', true)
        .order('plate_number')

    // Fetch branches
    const { data: branches } = await supabase
        .from('branches')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Urządzenia UDT</h2>
                {isAdmin && (
                    <AddDeviceModal
                        vehicles={activeVehicles || []}
                        branches={branches || []}
                    />
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <DevicesFilters branches={branches || []} />
                <Suspense fallback={<div>Ładowanie...</div>}>
                    <DevicesTable
                        devices={devices || []}
                        vehicles={activeVehicles || []}
                        branches={branches || []}
                        isAdmin={isAdmin}
                    />
                </Suspense>
            </div>
        </div>
    )
}
