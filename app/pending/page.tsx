import { createClient } from '@/utils/supabase/server'
import { PendingItemsTable } from '@/components/pending/PendingItemsTable'

export default async function PendingPage() {
    const supabase = await createClient()

    // Get current user and their profile
    const { data: { user } } = await supabase.auth.getUser()
    let userBranchCode: string | null = null
    let isAdmin = true

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, branch_id')
            .eq('id', user.id)
            .single()

        isAdmin = profile?.role === 'admin'

        // If manager, get their branch code
        if (profile?.role === 'manager' && profile?.branch_id) {
            const { data: branch } = await supabase
                .from('branches')
                .select('code')
                .eq('id', profile.branch_id)
                .single()
            userBranchCode = branch?.code || null
        }
    }

    // Fetch pending items (new item-level view) - filtered by branch for managers
    let pendingQuery = supabase
        .from('unresolved_pending_items')
        .select('*')
        .order('order_date', { ascending: false })

    if (!isAdmin && userBranchCode) {
        pendingQuery = pendingQuery.eq('branch_code', userBranchCode)
    }

    const { data: pendingItems } = await pendingQuery

    // Fetch active vehicles for the resolver dropdown - filtered by branch for managers
    let vehiclesQuery = supabase
        .from('vehicles')
        .select('id, plate_number, branch_id')
        .eq('is_active', true)
        .order('plate_number', { ascending: true })

    if (!isAdmin && user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('branch_id')
            .eq('id', user.id)
            .single()

        if (profile?.branch_id) {
            vehiclesQuery = vehiclesQuery.eq('branch_id', profile.branch_id)
        }
    }

    const { data: vehicles } = await vehiclesQuery

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Wymagana Weryfikacja</h2>
                {pendingItems && pendingItems.length > 0 && (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                        {pendingItems.length} {pendingItems.length === 1 ? 'pozycja' : pendingItems.length < 5 ? 'pozycje' : 'pozycji'}
                    </span>
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <PendingItemsTable items={pendingItems || []} vehicles={vehicles || []} />
            </div>
        </div>
    )
}
