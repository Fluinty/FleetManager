-- ============================================
-- MIGRATION: Multi-Branch Manager Access
-- Date: 2026-02-03
-- Description: Implementacja junction table dla relacji manager ↔ branches
-- ============================================

BEGIN;

-- 1. Create junction table
CREATE TABLE IF NOT EXISTS manager_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES profiles(id),
  UNIQUE(profile_id, branch_id)
);

COMMENT ON TABLE manager_branches IS 'Junction table dla relacji many-to-many między managerami a oddziałami';
COMMENT ON COLUMN manager_branches.assigned_by IS 'Admin który przypisał managera do oddziału';

-- 2. Create indexes dla wydajności
CREATE INDEX IF NOT EXISTS idx_manager_branches_profile ON manager_branches(profile_id);
CREATE INDEX IF NOT EXISTS idx_manager_branches_branch ON manager_branches(branch_id);

-- 3. Enable RLS
ALTER TABLE manager_branches ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
DROP POLICY IF EXISTS "Admins full access to manager_branches" ON manager_branches;
CREATE POLICY "Admins full access to manager_branches"
  ON manager_branches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Managers view own branches" ON manager_branches;
CREATE POLICY "Managers view own branches"
  ON manager_branches FOR SELECT
  USING (profile_id = auth.uid());

-- 5. Migruj istniejące dane z profiles.branch_id
INSERT INTO manager_branches (profile_id, branch_id, assigned_at)
SELECT id, branch_id, created_at
FROM profiles
WHERE role = 'manager' AND branch_id IS NOT NULL
ON CONFLICT (profile_id, branch_id) DO NOTHING;

-- 6. Update RLS policy dla vehicles
DROP POLICY IF EXISTS "Managers see own branch vehicles" ON vehicles;
DROP POLICY IF EXISTS "Managers see assigned branch vehicles" ON vehicles;

CREATE POLICY "Managers see assigned branch vehicles"
  ON vehicles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR
    branch_id IN (
      SELECT branch_id 
      FROM manager_branches 
      WHERE profile_id = auth.uid()
    )
  );

-- 7. Update RLS policy dla orders
DROP POLICY IF EXISTS "Managers see own branch orders" ON orders;
DROP POLICY IF EXISTS "Managers see assigned branch orders" ON orders;

CREATE POLICY "Managers see assigned branch orders"
  ON orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR
    branch_id IN (
      SELECT branch_id 
      FROM manager_branches 
      WHERE profile_id = auth.uid()
    )
  );

-- 8. Update RLS policy dla order_items
DROP POLICY IF EXISTS "Managers see own branch order items" ON order_items;
DROP POLICY IF EXISTS "Managers see assigned branch order items" ON order_items;

CREATE POLICY "Managers see assigned branch order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR
    order_id IN (
      SELECT id FROM orders
      WHERE branch_id IN (
        SELECT branch_id 
        FROM manager_branches 
        WHERE profile_id = auth.uid()
      )
    )
  );

-- 9. OPCJONALNIE: Usuń starą kolumnę branch_id z profiles
-- UWAGA: Odkomentuj tylko jeśli jesteś pewien że cały kod jest zmigrowany
-- ALTER TABLE profiles DROP COLUMN IF EXISTS branch_id;

COMMIT;

-- ============================================
-- VERIFICATION QUERIES (uruchom po migracji)
-- ============================================

-- 1. Sprawdź czy tabela została utworzona
SELECT COUNT(*) as total_assignments FROM manager_branches;

-- 2. Sprawdź przykładowe przypisania
SELECT 
  p.email,
  p.role,
  b.name as branch_name,
  mb.assigned_at
FROM manager_branches mb
JOIN profiles p ON p.id = mb.profile_id
JOIN branches b ON b.id = mb.branch_id
ORDER BY p.email, b.name;

-- 3. Sprawdź managers bez przypisań
SELECT email, role 
FROM profiles 
WHERE role = 'manager' 
  AND id NOT IN (SELECT profile_id FROM manager_branches);

-- ============================================
-- ROLLBACK SCRIPT (jeśli coś pójdzie nie tak)
-- ============================================

-- BEGIN;
-- 
-- -- Przywróć stare policies
-- DROP POLICY IF EXISTS "Managers see assigned branch vehicles" ON vehicles;
-- DROP POLICY IF EXISTS "Managers see assigned branch orders" ON orders;
-- DROP POLICY IF EXISTS "Managers see assigned branch order items" ON order_items;
-- 
-- -- Usuń junction table
-- DROP TABLE IF EXISTS manager_branches CASCADE;
-- 
-- -- Odtwórz stare policies (jeśli były)
-- CREATE POLICY "Managers see own branch vehicles"
--   ON vehicles FOR SELECT
--   USING (
--     EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
--     OR
--     branch_id = (SELECT branch_id FROM profiles WHERE id = auth.uid())
--   );
-- 
-- COMMIT;
