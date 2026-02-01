'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Creates a new user and their profile.
 * Note: This uses a separate auth client workaround to avoid logging in the user on the server session.
 */
export async function createUser(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Check if current user is admin
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !currentUser) {
        return { message: 'Unauthorized', success: false }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

    if (profile?.role !== 'admin') {
        return { message: 'Only admins can add users', success: false }
    }

    // 2. Extract Data
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string
    const branch_id = formData.get('branch_id') as string // optional

    if (!email || !password || !role) {
        return { message: 'Missing required fields', success: false }
    }

    try {
        // 3. Create User in Auth
        // We use a separate client instance logic OR just use `admin.createUser` if we had service key.
        // Since we don't have service key, we use `signUp` but we must be careful not to overwrite the session.
        // However, `supabase.auth.signUp` in `ssr` client might attempt to set cookies.
        // We will construct a vanilla supabase-js client with the ANON key for the sign up part,
        // ensuring no cookies are passed/set for THIS operation's persistence.

        const { createClient: createVanillaClient } = await import('@supabase/supabase-js')
        const tempClient = createVanillaClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false // IMPORTANT: Do not persist session
                }
            }
        )

        const { data: newUser, error: signUpError } = await tempClient.auth.signUp({
            email,
            password,
        })

        if (signUpError) {
            return { message: signUpError.message, success: false }
        }

        if (!newUser.user) {
            return { message: 'Failed to create user (no user returned)', success: false }
        }

        // 4. Create Profile
        // We use the ORIGINAL (admin-authenticated) client to call the RPC
        const branchIdValue = branch_id && branch_id !== 'none' ? branch_id : null

        const { error: profileError } = await supabase.rpc('create_user_profile', {
            p_user_id: newUser.user.id,
            p_role: role,
            p_branch_id: branchIdValue
        })

        if (profileError) {
            // Cleanup: consistency is hard here without transaction, but auth user is created.
            // Admin can try again or we can try to delete.
            // For now, return error.
            return { message: `User created but profile failed: ${profileError.message}`, success: false }
        }

        revalidatePath('/settings')
        return { message: 'User added successfully', success: true }

    } catch (e: any) {
        return { message: `Error: ${e.message}`, success: false }
    }
}
