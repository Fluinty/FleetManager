"use server"

import { createServiceClient } from "@/utils/supabase/service"
import { revalidatePath } from "next/cache"

export async function deleteManualInvoice(orderId: string, vehicleId: string) {
    try {
        const supabase = createServiceClient()

        // 1. Verify the order exists and is manual
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("id, is_manual")
            .eq("id", orderId)
            .single()

        if (orderError || !order) {
            return { error: "Nie znaleziono faktury." }
        }

        if (!order.is_manual) {
            return { error: "Nie można usunąć faktury z InterCars. Tylko manualne faktury mogą być usunięte." }
        }

        // 2. Delete order items first (foreign key)
        const { error: itemsError } = await supabase
            .from("order_items")
            .delete()
            .eq("order_id", orderId)

        if (itemsError) {
            console.error("Error deleting order items:", itemsError)
            return { error: `Błąd podczas usuwania pozycji: ${itemsError.message}` }
        }

        // 3. Delete the order
        const { error: deleteError } = await supabase
            .from("orders")
            .delete()
            .eq("id", orderId)

        if (deleteError) {
            console.error("Error deleting order:", deleteError)
            return { error: `Błąd podczas usuwania faktury: ${deleteError.message}` }
        }

        // 4. Revalidate
        revalidatePath(`/vehicles/${vehicleId}`)
        revalidatePath("/orders")
        revalidatePath("/")

        return { success: true }
    } catch (e: any) {
        console.error("Unhandled error in deleteManualInvoice:", e)
        return { error: `Błąd krytyczny serwera: ${e?.message || e}` }
    }
}
