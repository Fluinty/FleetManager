'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getDevices() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
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

        if (error) {
            console.error('Error fetching devices:', error)
            return { data: [], error: error.message }
        }

        return { data: data || [] }
    } catch (e: any) {
        console.error('Unhandled error in getDevices:', e)
        return { data: [], error: `Błąd serwera: ${e?.message || e}` }
    }
}

export async function addDevice(formData: {
    udt_number: string
    device_type: 'lift' | 'forklift'
    name: string | null
    vehicle_id: string | null
    branch_id: string
    last_inspection_date: string
    decision_expiry_date: string
    next_inspection_date: string
}) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('devices')
            .insert({
                udt_number: formData.udt_number,
                device_type: formData.device_type,
                name: formData.device_type === 'forklift' ? formData.name : null,
                vehicle_id: formData.device_type === 'lift' ? formData.vehicle_id : null,
                branch_id: formData.branch_id,
                last_inspection_date: formData.last_inspection_date,
                decision_expiry_date: formData.decision_expiry_date,
                next_inspection_date: formData.next_inspection_date,
                is_active: true,
            })

        if (error) {
            console.error('Error adding device:', error)
            return { error: `Błąd: ${error.message}` }
        }

        revalidatePath('/devices')
        revalidatePath('/')

        return { success: true }
    } catch (e: any) {
        console.error('Unhandled error in addDevice:', e)
        return { error: `Błąd serwera: ${e?.message || e}` }
    }
}

export async function updateDevice(
    id: string,
    formData: {
        udt_number: string
        device_type: 'lift' | 'forklift'
        name: string | null
        vehicle_id: string | null
        branch_id: string
        last_inspection_date: string
        decision_expiry_date: string
        next_inspection_date: string
    }
) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('devices')
            .update({
                udt_number: formData.udt_number,
                device_type: formData.device_type,
                name: formData.device_type === 'forklift' ? formData.name : null,
                vehicle_id: formData.device_type === 'lift' ? formData.vehicle_id : null,
                branch_id: formData.branch_id,
                last_inspection_date: formData.last_inspection_date,
                decision_expiry_date: formData.decision_expiry_date,
                next_inspection_date: formData.next_inspection_date,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Error updating device:', error)
            return { error: `Błąd: ${error.message}` }
        }

        revalidatePath('/devices')
        revalidatePath('/')

        return { success: true }
    } catch (e: any) {
        console.error('Unhandled error in updateDevice:', e)
        return { error: `Błąd serwera: ${e?.message || e}` }
    }
}

export async function deleteDevice(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('devices')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting device:', error)
            return { error: `Błąd: ${error.message}` }
        }

        revalidatePath('/devices')
        revalidatePath('/')

        return { success: true }
    } catch (e: any) {
        console.error('Unhandled error in deleteDevice:', e)
        return { error: `Błąd serwera: ${e?.message || e}` }
    }
}

export async function getActiveVehicles() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('vehicles')
            .select('id, plate_number, brand, model, branch_id')
            .eq('is_active', true)
            .order('plate_number')

        if (error) {
            console.error('Error fetching active vehicles:', error)
            return []
        }

        return data || []
    } catch (e: any) {
        console.error('Unhandled error in getActiveVehicles:', e)
        return []
    }
}
