"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Resolve a single order item by assigning a vehicle to it
 */
export async function resolvePendingItem(itemId: string, plate: string) {
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

    // 2. Update the order item with vehicle_id and mark as resolved
    const { error: oError } = await supabase
        .from("order_items")
        .update({
            vehicle_id: vehicle.id,
            plate_extraction_status: "manual",
            extracted_plate: plate.toUpperCase(),
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: "user", // Placeholder for auth user
        })
        .eq("id", itemId)

    if (oError) {
        return { error: "Błąd podczas aktualizacji pozycji zamówienia." }
    }

    revalidatePath("/pending")
    revalidatePath("/")
    revalidatePath("/orders")
    return { success: true }
}

/**
 * Resolve all items in an order at once with the same vehicle
 */
export async function resolvePendingOrderItems(orderId: string, plate: string) {
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

    // 2. Update all items in the order
    const { error: itemsError, count } = await supabase
        .from("order_items")
        .update({
            vehicle_id: vehicle.id,
            plate_extraction_status: "manual",
            extracted_plate: plate.toUpperCase(),
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: "user",
        })
        .eq("order_id", orderId)

    if (itemsError) {
        return { error: "Błąd podczas aktualizacji pozycji zamówienia." }
    }

    // 3. Also update the order's vehicle_id for backward compatibility
    const { error: orderError } = await supabase
        .from("orders")
        .update({
            vehicle_id: vehicle.id,
            plate_extraction_status: "manual",
            extracted_plate: plate.toUpperCase(),
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: "user",
            status: "confirmed"
        })
        .eq("id", orderId)

    if (orderError) {
        return { error: "Błąd podczas aktualizacji zamówienia." }
    }

    revalidatePath("/pending")
    revalidatePath("/")
    revalidatePath("/orders")
    return { success: true, itemsUpdated: count }
}

/**
 * Get pending items for a specific order
 */
export async function getPendingItemsForOrder(orderId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("order_items")
        .select("id, name, sku, total_gross, vehicle_id, plate_extraction_status, resolved")
        .eq("order_id", orderId)
        .order("name", { ascending: true })

    if (error) {
        return { error: "Błąd podczas pobierania pozycji zamówienia." }
    }

    return { items: data }
}
