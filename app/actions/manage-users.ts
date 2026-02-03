'use server'

import { createServiceClient } from '@/utils/supabase/service'
import { updateManagerBranches } from '@/utils/supabase/manager-branches'
import { revalidatePath } from 'next/cache'

export async function updateUserBranchesAction(
    userId: string,
    branchIds: string[],
    adminId: string
) {
    try {
        await updateManagerBranches(userId, branchIds, adminId)

        revalidatePath('/users')
        return { success: true }
    } catch (error) {
        console.error('Error updating user branches:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

export async function updateUserRoleAction(
    userId: string,
    role: 'admin' | 'manager'
) {
    const supabase = createServiceClient()

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', userId)

        if (error) throw error

        revalidatePath('/users')
        return { success: true }
    } catch (error) {
        console.error('Error updating user role:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}
