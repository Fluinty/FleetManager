-- Add UPDATE policy for vehicles table
-- This allows managers to update vehicles in their assigned branches

-- Drop existing policies if they exist
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins can update all vehicles" ON vehicles;
    DROP POLICY IF EXISTS "Managers can update assigned branch vehicles" ON vehicles;
END$$;

-- Policy for admins to update all vehicles
CREATE POLICY "Admins can update all vehicles" ON vehicles
FOR UPDATE
TO public
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Policy for managers to update vehicles in their assigned branches
CREATE POLICY "Managers can update assigned branch vehicles" ON vehicles
FOR UPDATE
TO public
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
    OR
    branch_id IN (
        SELECT branch_id
        FROM manager_branches
        WHERE profile_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
    OR
    branch_id IN (
        SELECT branch_id
        FROM manager_branches
        WHERE profile_id = auth.uid()
    )
);
