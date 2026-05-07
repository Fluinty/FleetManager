"use server"

import { createServiceClient } from "@/utils/supabase/service"
import { revalidatePath } from "next/cache"

interface FinancingData {
    financingType: "none" | "leasing" | "rental"
    company: string | null
    startDate: string | null
    endDate: string | null
}

export async function updateVehicleFinancing(vehicleId: string, data: FinancingData) {
    try {
        const supabase = createServiceClient()

        const isFinanced = data.financingType !== "none"

        const { error } = await supabase
            .from("vehicles")
            .update({
                financing_type: data.financingType,
                is_leasing: isFinanced, // Keep backward compat
                leasing_company: isFinanced ? data.company : null,
                financing_start_date: isFinanced ? data.startDate : null,
                leasing_end_date: isFinanced ? data.endDate : null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", vehicleId)

        if (error) {
            console.error("Error updating financing:", error)
            return { error: `Błąd: ${error.message}` }
        }

        revalidatePath(`/vehicles/${vehicleId}`)
        revalidatePath("/vehicles")
        revalidatePath("/")

        return { success: true }
    } catch (e: any) {
        console.error("Unhandled error in updateVehicleFinancing:", e)
        return { error: `Błąd serwera: ${e?.message || e}` }
    }
}
