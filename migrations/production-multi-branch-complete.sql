-- ============================================
-- PRODUCTION MIGRATION: Multi-Branch Manager Access
-- Created: 2026-02-03
-- Description: Implements many-to-many relationship between managers and branches
-- ============================================

BEGIN;

-- ============================================
-- 1. CREATE MANAGER_BRANCHES JUNCTION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS manager_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    assigned_by UUID REFERENCES profiles(id),
    UNIQUE(profile_id, branch_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_manager_branches_profile ON manager_branches(profile_id);
CREATE INDEX IF NOT EXISTS idx_manager_branches_branch ON manager_branches(branch_id);

-- Enable RLS
ALTER TABLE manager_branches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for manager_branches
CREATE POLICY "Admins can manage all manager-branch assignments" ON manager_branches
FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Managers can view their own branch assignments" ON manager_branches
FOR SELECT
TO public
USING (profile_id = auth.uid());

-- ============================================
-- 2. MIGRATE EXISTING DATA
-- ============================================

-- Insert existing manager-branch relationships from profiles.branch_id
INSERT INTO manager_branches (profile_id, branch_id, assigned_at)
SELECT 
    id as profile_id,
    branch_id,
    now() as assigned_at
FROM profiles
WHERE role = 'manager' 
AND branch_id IS NOT NULL
ON CONFLICT (profile_id, branch_id) DO NOTHING;

-- ============================================
-- 3. UPDATE RLS POLICIES FOR VEHICLES
-- ============================================

-- Drop old policy
DROP POLICY IF EXISTS "Manager can view own branch vehicles" ON vehicles;

-- New policy already exists from previous migration:
-- "Managers see assigned branch vehicles"
-- Verify it exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'vehicles' 
        AND policyname = 'Managers see assigned branch vehicles'
    ) THEN
        CREATE POLICY "Managers see assigned branch vehicles" ON vehicles
        FOR SELECT
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
        );
    END IF;
END $$;

-- ============================================
-- 4. UPDATE RLS POLICIES FOR ORDERS
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Manager can view own branch orders" ON orders;
DROP POLICY IF EXISTS "Manager can update own branch orders" ON orders;

-- Create new policies using manager_branches
CREATE POLICY "Managers see assigned branch orders" ON orders
FOR SELECT
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
);

CREATE POLICY "Managers update assigned branch orders" ON orders
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
);

-- ============================================
-- 5. UPDATE RLS POLICIES FOR ORDER_ITEMS
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Manager can view own branch items" ON order_items;
DROP POLICY IF EXISTS "Manager can update own branch items" ON order_items;

-- New SELECT policy already exists from previous migration:
-- "Managers see assigned branch order items"
-- Verify it exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_items' 
        AND policyname = 'Managers see assigned branch order items'
    ) THEN
        CREATE POLICY "Managers see assigned branch order items" ON order_items
        FOR SELECT
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
            )
            OR
            order_id IN (
                SELECT orders.id
                FROM orders
                WHERE orders.branch_id IN (
                    SELECT branch_id
                    FROM manager_branches
                    WHERE profile_id = auth.uid()
                )
            )
        );
    END IF;
END $$;

-- Create UPDATE policy for order_items (note: order_items doesn't have direct branch_id)
-- UPDATE policy uses join through orders table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_items' 
        AND policyname = 'Managers update assigned branch order items'
    ) THEN
        CREATE POLICY "Managers update assigned branch order items" ON order_items
        FOR UPDATE
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
            )
            OR
            order_id IN (
                SELECT orders.id
                FROM orders
                WHERE orders.branch_id IN (
                    SELECT branch_id
                    FROM manager_branches
                    WHERE profile_id = auth.uid()
                )
            )
        );
    END IF;
END $$;

-- ============================================
-- 6. POPULATE branch_id IN ORDERS TABLE
-- ============================================

-- Many orders have branch_code but NULL branch_id
-- Populate branch_id based on branch_code
UPDATE orders
SET branch_id = branches.id
FROM branches
WHERE orders.branch_code = branches.code
AND orders.branch_id IS NULL;

-- ============================================
-- 7. UPDATE VIEWS TO INCLUDE branch_id
-- ============================================

-- Update unresolved_pending_items view
DROP VIEW IF EXISTS unresolved_pending_items;

CREATE VIEW unresolved_pending_items AS
SELECT 
    oi.id AS item_id,
    oi.name AS item_name,
    oi.sku,
    oi.total_gross AS item_total,
    oi.resolved,
    oi.resolved_at,
    oi.resolved_by,
    o.id AS order_id,
    o.intercars_id,
    o.order_date,
    o.total_gross AS order_total,
    o.raw_comment,
    o.branch_code,
    o.branch_id,  -- Added for branch filtering
    now() - o.order_date AS pending_duration
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE oi.vehicle_id IS NULL;

-- Update unresolved_pending_orders view
DROP VIEW IF EXISTS unresolved_pending_orders;

CREATE VIEW unresolved_pending_orders AS
SELECT 
    id AS order_id,
    intercars_id,
    order_date,
    description,
    total_gross,
    raw_comment,
    branch_code,
    branch_id,  -- Added for branch filtering
    status,
    now() - order_date AS pending_duration
FROM orders o
WHERE status = 'pending';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count manager_branches assignments
SELECT 
    COUNT(*) as total_assignments,
    COUNT(DISTINCT profile_id) as managers_with_branches,
    COUNT(DISTINCT branch_id) as branches_assigned
FROM manager_branches;

-- Show managers and their branch assignments
SELECT 
    p.id,
    p.role,
    COUNT(mb.branch_id) as branch_count,
    STRING_AGG(b.name, ', ') as assigned_branches
FROM profiles p
LEFT JOIN manager_branches mb ON mb.profile_id = p.id
LEFT JOIN branches b ON b.id = mb.branch_id
WHERE p.role = 'manager'
GROUP BY p.id, p.role
ORDER BY branch_count DESC;

-- Verify RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename IN ('manager_branches', 'vehicles', 'orders', 'order_items')
ORDER BY tablename, policyname;

-- Verify views have branch_id
SELECT column_name
FROM information_schema.columns
WHERE table_name IN ('unresolved_pending_items', 'unresolved_pending_orders')
AND column_name = 'branch_id';

COMMIT;

-- ============================================
-- POST-DEPLOYMENT NOTES
-- ============================================

-- After running this migration:
-- 1. Update application code (Next.js) - already done in local
-- 2. Test with manager accounts assigned to multiple branches
-- 3. Verify filtering works on:
--    - Dashboard pending count
--    - Vehicles list
--    - Pending items page
--    - Orders (admin only)
-- 4. Monitor for any RLS policy violations in logs
