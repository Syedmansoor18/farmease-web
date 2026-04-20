-- File: 02_Row-Level Security for Profiles, Farmers, Equipment, Bookings, and Crop Maps
-- Desc: Implements Row Level Security (RLS) to enforce user-based access control, ensuring 
-- data privacy and secure interactions across all core tables.
-- Author: Hajira

-- 1. PROFILES SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a profile (signup phase)
CREATE POLICY "profiles_insert_public"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Users can only see and edit their own personal data
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- 2. FARMERS SECURITY
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can see the farmer directory
CREATE POLICY "farmers_select_authenticated"
  ON farmers FOR SELECT
  USING (auth.role() = 'authenticated');

-- A user can only register as a farmer for their own UID
CREATE POLICY "farmers_insert_own"
  ON farmers FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "farmers_update_own"
  ON farmers FOR UPDATE
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());


-- 3. EQUIPMENT LIST SECURITY
ALTER TABLE equipment_list ENABLE ROW LEVEL SECURITY;

-- Marketplace visibility for all logged-in users
CREATE POLICY "equipment_select_all"
  ON equipment_list FOR SELECT
  USING (auth.role() = 'authenticated');

-- Restrict Insert/Update/Delete to the actual owner
-- We use a subquery here to link the farmer_id to the user's auth.uid
CREATE POLICY "equipment_manage_own"
  ON equipment_list FOR ALL
  USING (
    owner_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
  );


-- 4. BOOKINGS SECURITY (The most sensitive layer)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- A booking is only visible to the person who booked it OR the owner of the equipment
CREATE POLICY "bookings_select_involved"
  ON bookings FOR SELECT
  USING (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR
    equipment_id IN (
      SELECT id FROM equipment_list
      WHERE owner_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    )
  );

-- Only a farmer can initiate a booking for themselves
CREATE POLICY "bookings_insert_own"
  ON bookings FOR INSERT
  WITH CHECK (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
  );


-- 5. CROP MAP SECURITY
ALTER TABLE crop_equipment_map ENABLE ROW LEVEL SECURITY;

-- Recommendations are public/read-only for everyone
CREATE POLICY "crop_map_select_public"
  ON crop_equipment_map FOR SELECT
  USING (true);
