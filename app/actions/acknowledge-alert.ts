"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function acknowledgeAlert(alertId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("budget_alerts")
        .update({
            acknowledged: true,
            acknowledged_at: new Date().toISOString()
        })
        .eq("id", alertId)

    if (error) {
        return { error: "Błąd podczas zatwierdzania alertu." }
    }

    revalidatePath("/alerts")
    revalidatePath("/")
    return { success: true }
}
