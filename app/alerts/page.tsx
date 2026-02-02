import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AlertsTable } from '@/components/alerts/AlertsTable'

export default async function AlertsPage() {
    const supabase = await createClient()

    // Check user role - only admins can access
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
    if (!isAdmin) {
        redirect('/')
    }

    const { data: alerts } = await supabase
        .from('budget_alerts')
        .select('*, vehicles(plate_number, brand, model)')
        .eq('acknowledged', false)
        .order('created_at', { ascending: false })

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Alerty Budżetowe</h2>
            </div>

            <div className="flex flex-col space-y-4">
                <AlertsTable alerts={alerts || []} />
            </div>
        </div>
    )
}
