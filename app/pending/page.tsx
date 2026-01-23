import { createClient } from '@/utils/supabase/server'
import { PendingItemsTable } from '@/components/pending/PendingItemsTable'

export default async function PendingPage() {
    const supabase = await createClient()

    // Fetch pending items (new item-level view)
    const { data: pendingItems } = await supabase
        .from('unresolved_pending_items')
        .select('*')
        .order('order_date', { ascending: false })

    // Fetch all active vehicles for the resolver dropdown
    const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, plate_number')
        .eq('is_active', true)
        .order('plate_number', { ascending: true })

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
