import { createClient } from '@/utils/supabase/server'
import { BudgetSettingsForm } from '@/components/settings/BudgetSettingsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersList } from '@/components/settings/UsersList'

export default async function SettingsPage() {
    const supabase = await createClient()

    // 1. Check User Role
    const { data: { user } } = await supabase.auth.getUser()
    let isAdmin = false

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        isAdmin = profile?.role === 'admin'
    }

    // 2. Fetch Data
    const settingsPromise = supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'monthly_budget_limit')
        .single()

    const usersPromise = isAdmin
        ? supabase.rpc('get_users_with_roles')
        : Promise.resolve({ data: [] })

    const branchesPromise = isAdmin
        ? supabase.from('branches').select('id, name').order('name')
        : Promise.resolve({ data: [] })

    const [settingsRes, usersRes, branchesRes] = await Promise.all([
        settingsPromise,
        usersPromise,
        branchesPromise
    ])

    // Parse Settings
    const setting = settingsRes.data
    const currentLimit = setting?.value && typeof setting.value === 'object' && 'amount' in setting.value
        ? (setting.value as { amount: number }).amount
        : 0

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Ustawienia</h2>
            </div>

            <Tabs defaultValue="budget" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="budget">Budżet</TabsTrigger>
                    {isAdmin && <TabsTrigger value="users">Użytkownicy</TabsTrigger>}
                </TabsList>

                <TabsContent value="budget" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <BudgetSettingsForm initialLimit={currentLimit} />
                    </div>
                </TabsContent>

                {isAdmin && (
                    <TabsContent value="users" className="space-y-4">
                        <UsersList
                            users={usersRes.data || []}
                            branches={branchesRes.data || []}
                        />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
