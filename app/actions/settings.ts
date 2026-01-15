'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateBudgetLimit(amount: number) {
    const supabase = await createClient()

    // Assuming the structure is { amount: number, currency: string }
    const newValue = {
        amount: amount,
        currency: "PLN"
    }

    const { error } = await supabase
        .from('system_settings')
        .update({
            value: newValue,
            updated_at: new Date().toISOString()
            // updated_by: // TODO: Add user ID when auth is fully implemented
        })
        .eq('key', 'monthly_budget_limit')

    if (error) {
        console.error("Error updating budget limit:", error)
        return { error: "Wystąpił błąd podczas aktualizacji limitu." }
    }

    revalidatePath('/settings')
    revalidatePath('/') // Revalidate dashboard as it might use this setting
    return { success: true }
}
