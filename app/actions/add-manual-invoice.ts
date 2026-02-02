"use server"

import { createClient } from "@/utils/supabase/server"
import { createServiceClient } from "@/utils/supabase/service"
import { revalidatePath } from "next/cache"
import { checkBudgetAlerts } from "./check-budget"

interface InvoiceItem {
    name: string
    sku?: string
    quantity: number
    unitPriceNet: number
    vatRate: number
}

interface InvoiceData {
    orderDate: string
    supplier: string
    description: string
    items: InvoiceItem[]
}

export async function addManualInvoice(vehicleId: string, data: InvoiceData) {
    const supabaseAuth = await createClient()
    const supabase = createServiceClient() // Use service role to bypass RLS

    // 1. Validate minimum requirements
    if (!data.items || data.items.length === 0) {
        return { error: "Faktura musi zawierać co najmniej jedną pozycję." }
    }

    // 2. Get vehicle and its branch
    const { data: vehicle, error: vError } = await supabase
        .from("vehicles")
        .select("branch_id")
        .eq("id", vehicleId)
        .single()

    if (vError || !vehicle) {
        return { error: "Nie znaleziono pojazdu." }
    }

    // 3. Calculate totals for each item and invoice
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

    // 4. Create order (invoice header)
    // Generate unique ID for manual invoice (intercars_id has UNIQUE constraint)
    const manualInvoiceId = `MANUAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            order_date: data.orderDate,
            description: data.description,
            branch_id: vehicle.branch_id,
            total_net: Math.round(invoiceTotalNet * 100) / 100,
            total_gross: Math.round(invoiceTotalGross * 100) / 100,
            intercars_id: manualInvoiceId,
            status: "completed",
            currency: "PLN",
            amount: Math.round(invoiceTotalGross * 100) / 100,
        })
        .select()
        .single()

    if (orderError || !order) {
        console.error("Error creating order:", orderError)
        return { error: "Błąd podczas tworzenia faktury." }
    }

    // 5. Create order items
    const orderItems = calculatedItems.map(item => ({
        ...item,
        order_id: order.id,
        vehicle_id: vehicleId,
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: "user",
    }))

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

    if (itemsError) {
        console.error("Error creating order items:", itemsError)
        // Try to clean up the order
        await supabase.from("orders").delete().eq("id", order.id)
        return { error: "Błąd podczas dodawania pozycji faktury." }
    }

    // 6. Trigger budget alert check
    await checkBudgetAlerts()

    // 7. Revalidate relevant paths
    revalidatePath(`/vehicles/${vehicleId}`)
    revalidatePath("/orders")
    revalidatePath("/")

    return { success: true, orderId: order.id }
}
