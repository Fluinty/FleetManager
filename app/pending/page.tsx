import { createClient } from '@/utils/supabase/server'
import { PendingTable } from '@/components/pending/PendingTable'

export default async function PendingPage() {
    const supabase = await createClient()

    // Fetch pending orders
    const { data: pending } = await supabase
        .from('unresolved_pending_orders')
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
            </div>

            <div className="flex flex-col space-y-4">
                <PendingTable items={pending || []} vehicles={vehicles || []} />
            </div>
        </div>
    )
}
