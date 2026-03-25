"use server"

import { createServiceClient } from "@/utils/supabase/service"
import { revalidatePath } from "next/cache"

interface InvoiceItem {
    name: string
    sku?: string
    quantity: number
    unitPriceNet: number
    vatRate: number
}

interface EditInvoiceData {
    orderDate: string
    supplier: string
    invoiceNumber: string
    items: InvoiceItem[]
}

export async function editManualInvoice(orderId: string, vehicleId: string, data: EditInvoiceData) {
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
            return { error: "Nie można edytować faktury z InterCars. Tylko manualne faktury mogą być edytowane." }
        }

        // 2. Validate
        if (!data.items || data.items.length === 0) {
            return { error: "Faktura musi zawierać co najmniej jedną pozycję." }
        }

        // 3. Calculate totals
        const calculatedItems = data.items.map(item => {
            const unitPriceGross = item.unitPriceNet * (1 + item.vatRate / 100)
            const totalNet = item.unitPriceNet * item.quantity
            const totalGross = unitPriceGross * item.quantity

            return {
                name: item.name,
                sku: item.sku || null,
                required_quantity: item.quantity,
                unit_price_net: item.unitPriceNet,
                unit_price_gross: Math.round(unitPriceGross * 100) / 100,
                total_net: Math.round(totalNet * 100) / 100,
                total_gross: Math.round(totalGross * 100) / 100,
            }
        })

        const invoiceTotalNet = calculatedItems.reduce((sum, item) => sum + item.total_net, 0)
        const invoiceTotalGross = calculatedItems.reduce((sum, item) => sum + item.total_gross, 0)

        // 4. Update order header
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                order_date: data.orderDate,
                description: data.supplier,
                fiscal_document_number: data.invoiceNumber,
                total_net: Math.round(invoiceTotalNet * 100) / 100,
                total_gross: Math.round(invoiceTotalGross * 100) / 100,
                amount: Math.round(invoiceTotalGross * 100) / 100,
                updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)

        if (updateError) {
            console.error("Error updating order:", updateError)
            return { error: `Błąd podczas aktualizacji faktury: ${updateError.message}` }
        }

        // 5. Delete old items and insert new ones (simpler than diffing)
        const { error: deleteItemsError } = await supabase
            .from("order_items")
            .delete()
            .eq("order_id", orderId)

        if (deleteItemsError) {
            console.error("Error deleting old items:", deleteItemsError)
            return { error: `Błąd podczas usuwania starych pozycji: ${deleteItemsError.message}` }
        }

        const orderItems = calculatedItems.map(item => ({
            ...item,
            order_id: orderId,
            vehicle_id: vehicleId,
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: "user",
        }))

        const { error: insertItemsError } = await supabase
            .from("order_items")
            .insert(orderItems)

        if (insertItemsError) {
            console.error("Error inserting new items:", insertItemsError)
            return { error: `Błąd podczas dodawania pozycji: ${insertItemsError.message}` }
        }

        // 6. Revalidate
        revalidatePath(`/vehicles/${vehicleId}`)
        revalidatePath("/orders")
        revalidatePath("/")

        return { success: true }
    } catch (e: any) {
        console.error("Unhandled error in editManualInvoice:", e)
        return { error: `Błąd krytyczny serwera: ${e?.message || e}` }
    }
}
