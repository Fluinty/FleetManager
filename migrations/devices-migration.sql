-- Migration: Add vehicle_category to vehicles + Create devices table
-- Date: 2026-06-15

-- 1. Vehicle category column
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vehicle_category TEXT DEFAULT 'van';

-- Mark known trucks (>3.5t)
UPDATE vehicles SET vehicle_category = 'truck' WHERE plate_number IN (
  'DW614XM',  -- Man Tgl 12.180
  'DJE16W7',  -- Man Tgl 12.180
  'DJ3476E',  -- Mercedes Atego
  'DJ5502C',  -- Mercedes Atego
  'DJ5503C'   -- Volvo FL
);

-- Mark known cars
UPDATE vehicles SET vehicle_category = 'car' WHERE plate_number IN (
  'DJ6660C',   -- Mercedes GLA 200
  'DX4920C',   -- Mercedes GLC
  'DX42766',   -- Mercedes AMG
  'DJ06E'      -- Mercedes 280 SE
);

-- 2. Devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  udt_number TEXT NOT NULL UNIQUE,
  device_type TEXT NOT NULL CHECK (device_type IN ('lift', 'forklift')),
  name TEXT,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id),
  last_inspection_date DATE,
  decision_expiry_date DATE,
  next_inspection_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on devices"
  ON devices FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Manager read devices in their branches"
  ON devices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM manager_branches
      WHERE manager_branches.profile_id = auth.uid()
        AND manager_branches.branch_id = devices.branch_id
    )
  );

CREATE POLICY "Manager write devices in their branches"
  ON devices FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM manager_branches
      WHERE manager_branches.profile_id = auth.uid()
        AND manager_branches.branch_id = devices.branch_id
    )
  );

CREATE POLICY "Manager update devices in their branches"
  ON devices FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM manager_branches
      WHERE manager_branches.profile_id = auth.uid()
        AND manager_branches.branch_id = devices.branch_id
    )
  );

-- 3. Initial data import (13 lifts + 2 forklifts)
-- Lifts (windy) - assigned to vehicles
INSERT INTO devices (udt_number, device_type, vehicle_id, branch_id, last_inspection_date, decision_expiry_date, next_inspection_date) VALUES
('N8728007333', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJE17G8'), (SELECT branch_id FROM vehicles WHERE plate_number='DJE17G8'), '2026-05-22', '2029-05-31', '2029-05-22'),
('N8719006552', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJE16Y9'), (SELECT branch_id FROM vehicles WHERE plate_number='DJE16Y9'), '2026-05-22', '2029-05-31', '2029-05-22'),
('N8717004913', 'lift', (SELECT id FROM vehicles WHERE plate_number='DW614XM'), (SELECT branch_id FROM vehicles WHERE plate_number='DW614XM'), '2026-04-09', '2029-04-30', '2029-04-09'),
('N8728006628', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJ75922'), (SELECT branch_id FROM vehicles WHERE plate_number='DJ75922'), '2026-04-09', '2029-04-30', '2029-04-09'),
('N8728011840', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJ3498C'), (SELECT branch_id FROM vehicles WHERE plate_number='DJ3498C'), '2026-03-06', '2029-03-31', '2029-03-06'),
('N8728010042', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJ5502C'), (SELECT branch_id FROM vehicles WHERE plate_number='DJ5502C'), '2026-01-30', '2029-01-31', '2029-01-30'),
('N8728008288', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJE16W7'), (SELECT branch_id FROM vehicles WHERE plate_number='DJE16W7'), '2025-12-08', '2028-12-31', '2028-12-08'),
('8714011266', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJ5503C'), (SELECT branch_id FROM vehicles WHERE plate_number='DJ5503C'), '2025-10-22', '2028-10-31', '2028-10-22'),
('N8728008323', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJ4332C'), (SELECT branch_id FROM vehicles WHERE plate_number='DJ4332C'), '2025-04-03', '2028-04-30', '2028-04-30'),
('N8713003450', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJEAF23'), (SELECT branch_id FROM vehicles WHERE plate_number='DJEAF23'), '2025-03-28', '2028-03-31', '2028-03-28'),
('N8728010816', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJ3476E'), (SELECT branch_id FROM vehicles WHERE plate_number='DJ3476E'), '2024-08-08', '2027-08-31', '2027-08-08'),
('N8728008148', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJE17V8'), (SELECT branch_id FROM vehicles WHERE plate_number='DJE17V8'), '2023-10-27', '2026-10-31', '2026-10-27'),
('N8728006480', 'lift', (SELECT id FROM vehicles WHERE plate_number='DJ9404C'), (SELECT branch_id FROM vehicles WHERE plate_number='DJ9404C'), '2023-09-15', '2026-09-30', '2026-09-15');

-- Forklifts (wózki widłowe) - assigned to Wałbrzych branch
INSERT INTO devices (udt_number, device_type, name, branch_id, last_inspection_date, decision_expiry_date, next_inspection_date) VALUES
('N9728004597', 'forklift', 'Sztaplarka BT SWE1200', '9900c678-18ea-4af8-8d9b-842d29f90f21', '2026-02-26', '2028-02-29', '2028-02-29'),
('N4728030220', 'forklift', 'Wózek widłowy TOYOTA 8FBMT20-474', '9900c678-18ea-4af8-8d9b-842d29f90f21', '2026-02-26', '2027-02-28', '2027-02-28');
