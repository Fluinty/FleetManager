"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function resolvePendingOrder(orderId: string, plate: string) {
    const supabase = await createClient()

    // 1. Find vehicle by plate
    const { data: vehicle, error: vError } = await supabase
        .from("vehicles")
        .select("id")
        .ilike("plate_number", plate)
        .single()

    if (vError || !vehicle) {
        return { error: "Nie znaleziono pojazdu o podanym numerze rejestracyjnym." }
    }

    // 2. Update Order with vehicle_id and mark as resolved
    const { error: oError } = await supabase
        .from("orders")
        .update({
            vehicle_id: vehicle.id,
            plate_extraction_status: "manual",
            extracted_plate: plate.toUpperCase(),
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: "user", // Placeholder for auth user
            status: "confirmed"  // Mark as confirmed when plate assigned
        })
        .eq("id", orderId)

    if (oError) {
        return { error: "Błąd podczas aktualizacji zamówienia." }
    }

    revalidatePath("/pending")
    revalidatePath("/")
    revalidatePath("/orders")
    return { success: true }
}
