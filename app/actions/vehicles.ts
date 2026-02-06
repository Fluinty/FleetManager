'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Updates the airport status for a vehicle
 * @param vehicleId - UUID of the vehicle
 * @param isAirport - New airport status (true/false)
 * @returns Success status and optional error message
 */
export async function updateVehicleAirportStatus(
    vehicleId: string,
    isAirport: boolean
) {
    try {
        const supabase = await createClient()

        // Update vehicle airport status
        console.log('[UPDATE] Attempting to update vehicle:', vehicleId, 'to is_airport:', isAirport)

        const { data, error } = await supabase
            .from('vehicles')
            .update({
                is_airport: isAirport,
                updated_at: new Date().toISOString()
            })
            .eq('id', vehicleId)
            .select()

        console.log('[UPDATE] Result:', { data, error })

        if (error) {
            console.error('[UPDATE ERROR] Error updating airport status:', error)
            return {
                success: false,
                error: error.message
            }
        }

        if (!data || data.length === 0) {
            console.error('[UPDATE ERROR] No rows updated - possible RLS policy issue')
            return {
                success: false,
                error: 'Brak uprawnień do edycji tego pojazdu'
            }
        }

        console.log('[UPDATE SUCCESS] Vehicle updated:', data[0])

        // Revalidate the vehicle details page to reflect changes
        revalidatePath(`/vehicles/${vehicleId}`)

        return { success: true }
    } catch (error) {
        console.error('Unexpected error:', error)
        return {
            success: false,
            error: 'Wystąpił nieoczekiwany błąd'
        }
    }
}
