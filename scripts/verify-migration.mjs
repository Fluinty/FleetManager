import { createClient } from '@supabase/supabase-js'

// Use environment variables instead of hardcoded keys
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://avjpogbqszwqghbysyzu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function verifyMigration() {
    console.log('🔍 Verifying migration status...\n')

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    try {
        // Check if table exists
        const { data, error } = await supabase
            .from('manager_branches')
            .select('id')
            .limit(1)

        if (error) {
            if (error.code === '42P01' || error.message.includes('not found')) {
                console.log('❌ Table manager_branches does NOT exist yet\n')
                console.log('📋 Please run the migration first:')
                console.log('1. Open: https://supabase.com/dashboard/project/avjpogbqszwqghbysyzu/sql/new')
                console.log('2. Copy/paste: migrations/manager-branches-migration.sql')
                console.log('3. Click "Run"\n')
                process.exit(1)
            }
            throw error
        }

        console.log('✅ Table manager_branches exists!\n')

        // Get count
        const { count } = await supabase
            .from('manager_branches')
            .select('*', { count: 'exact', head: true })

        console.log(`📊 Records in manager_branches: ${count || 0}\n`)

        // Show sample data
        const { data: samples } = await supabase
            .from('manager_branches')
            .select(`
        id,
        profile_id,
        branch_id,
        branches(code, name),
        profiles(email)
      `)
            .limit(5)

        if (samples && samples.length > 0) {
            console.log('📋 Sample assignments:')
            samples.forEach(s => {
                const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles
                const branch = Array.isArray(s.branches) ? s.branches[0] : s.branches
                console.log(`  - ${profile?.email} → ${branch?.name} (${branch?.code})`)
            })
        }

        console.log('\n✅ Migration verified successfully!')
        console.log('🚀 Ready to proceed with code implementation\n')

    } catch (err) {
        console.error('❌ Verification failed:', err.message)
        process.exit(1)
    }
}

verifyMigration()
