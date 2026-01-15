import { createClient } from '@/utils/supabase/server'
import { BudgetSettingsForm } from '@/components/settings/BudgetSettingsForm'

export default async function SettingsPage() {
    const supabase = await createClient()

    // Fetch current setting
    const { data: setting } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'monthly_budget_limit')
        .single()

    // Safe access to value.amount, referencing the JSON structure seen in DB
    // value schema: { amount: number, currency: string }
    const currentLimit = setting?.value && typeof setting.value === 'object' && 'amount' in setting.value
        ? (setting.value as { amount: number }).amount
        : 0

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Ustawienia</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <BudgetSettingsForm initialLimit={currentLimit} />
            </div>
        </div>
    )
}
