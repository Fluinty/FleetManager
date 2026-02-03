import { createServiceClient } from './service'
import type { Database } from '@/types/supabase'

type ManagerBranch = Database['public']['Tables']['manager_branches']['Row']

/**
 * Get all branch assignments for a manager
 * @param profileId - Manager's profile ID
 * @returns Array of manager_branches records with branch details
 */
export async function getManagerBranches(profileId: string) {
    const supabase = createServiceClient()

    const { data, error } = await supabase
        .from('manager_branches')
        .select(`
      id,
      profile_id,
      branch_id,
      assigned_at,
      assigned_by,
      branches (
        id,
        code,
        name,
        address,
        city
      )
    `)
        .eq('profile_id', profileId)

    if (error) {
        console.error('Error fetching manager branches:', error)
        return []
    }

    return data || []
}

/**
 * Get only branch IDs for a manager (faster query)
 * @param profileId - Manager's profile ID
 * @returns Array of branch UUIDs
 */
export async function getManagerBranchIds(profileId: string): Promise<string[]> {
    const supabase = createServiceClient()

    const { data, error } = await supabase
        .from('manager_branches')
        .select('branch_id')
        .eq('profile_id', profileId)

    if (error) {
        console.error('Error fetching manager branch IDs:', error)
        return []
    }

    return data?.map(row => row.branch_id) || []
}

/**
 * Assign a manager to a branch
 * @param profileId - Manager's profile ID
 * @param branchId - Branch UUID
 * @param assignedBy - Admin's profile ID
 */
export async function assignManagerToBranch(
    profileId: string,
    branchId: string,
    assignedBy: string
) {
    const supabase = createServiceClient()

    const { data, error } = await supabase
        .from('manager_branches')
        .insert({
            profile_id: profileId,
            branch_id: branchId,
            assigned_by: assignedBy
        })
        .select()
        .single()

    if (error) {
        console.error('Error assigning manager to branch:', error)
        throw error
    }

    return data
}

/**
 * Remove a manager's assignment from a branch
 * @param profileId - Manager's profile ID
 * @param branchId - Branch UUID
 */
export async function removeManagerFromBranch(
    profileId: string,
    branchId: string
) {
    const supabase = createServiceClient()

    const { error } = await supabase
        .from('manager_branches')
        .delete()
        .eq('profile_id', profileId)
        .eq('branch_id', branchId)

    if (error) {
        console.error('Error removing manager from branch:', error)
        throw error
    }
}

/**
 * Update all branch assignments for a manager (replaces existing)
 * @param profileId - Manager's profile ID
 * @param branchIds - Array of branch UUIDs to assign
 * @param assignedBy - Admin's profile ID
 */
export async function updateManagerBranches(
    profileId: string,
    branchIds: string[],
    assignedBy: string
) {
    const supabase = createServiceClient()

    // Start transaction by deleting all existing assignments
    const { error: deleteError } = await supabase
        .from('manager_branches')
        .delete()
        .eq('profile_id', profileId)

    if (deleteError) {
        console.error('Error deleting existing assignments:', deleteError)
        throw deleteError
    }

    // Insert new assignments
    if (branchIds.length > 0) {
        const assignments = branchIds.map(branchId => ({
            profile_id: profileId,
            branch_id: branchId,
            assigned_by: assignedBy
        }))

        const { error: insertError } = await supabase
            .from('manager_branches')
            .insert(assignments)

        if (insertError) {
            console.error('Error inserting new assignments:', insertError)
            throw insertError
        }
    }
}
