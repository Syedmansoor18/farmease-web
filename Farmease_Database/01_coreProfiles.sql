-- FILE 01: Core Schema (PURE SUPABASE EDITION)
-- Use extensions schema for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- ==========================================
-- 1. CORE TABLES
-- ==========================================

-- 1. PROFILES (Tied directly to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  email           TEXT UNIQUE,
  phone           TEXT UNIQUE,
  aadhaar_number  TEXT UNIQUE,
  kisan_id        TEXT UNIQUE,
  state           TEXT NOT NULL,
  district        TEXT NOT NULL,
  village         TEXT,
  pincode         TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMERS (Extended Profile)
CREATE TABLE IF NOT EXISTS farmers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  land_size     DECIMAL(10, 2),
  farmer_type   TEXT CHECK (farmer_type IN ('marginal','small','semi_medium','medium','large')),
  primary_crops TEXT[],
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_profile_farmer UNIQUE (profile_id)
);

-- 3. EQUIPMENT
CREATE TABLE IF NOT EXISTS equipment_list (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL,
  description   TEXT,
  price_per_day DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_free       BOOLEAN DEFAULT FALSE,
  location      TEXT NOT NULL,
  district      TEXT NOT NULL,
  state         TEXT NOT NULL,
  pincode       TEXT,
  is_available  BOOLEAN DEFAULT TRUE,
  condition     TEXT CHECK (condition IN ('excellent','good','fair','poor')),
  images        TEXT[],
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id  UUID NOT NULL REFERENCES equipment_list(id) ON DELETE RESTRICT,
  farmer_id     UUID NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  total_price   DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected','active','completed','cancelled')),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- 5. CROP-EQUIPMENT MAP
CREATE TABLE IF NOT EXISTS crop_equipment_map (
  id             SERIAL PRIMARY KEY,
  crop_name      TEXT NOT NULL,
  state          TEXT,
  equipment_type TEXT NOT NULL,
  priority       INTEGER NOT NULL DEFAULT 1,
  season         TEXT CHECK (season IN ('kharif','rabi','zaid','all')),
  notes          TEXT
);

-- ==========================================
-- 2. AUTOMATIC TIMESTAMPS
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_farmers_updated
  BEFORE UPDATE ON farmers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_equipment_updated
  BEFORE UPDATE ON equipment_list FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bookings_updated
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ==========================================
-- 3. SUPABASE ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all operational tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, but only edit their own
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Farmers: Users can read all, but only manage their own farmer record
CREATE POLICY "Farmers are viewable by authenticated users" ON farmers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own farmer record" ON farmers FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own farmer record" ON farmers FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

-- Equipment: Users can read all, but farmers only manage their own gear
CREATE POLICY "Equipment is viewable by authenticated users" ON equipment_list FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Farmers can manage own equipment" ON equipment_list FOR ALL USING (
  owner_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
);

-- Bookings: Only visible to the borrower and the owner of the equipment
CREATE POLICY "Bookings viewable by involved parties" ON bookings FOR SELECT USING (
  farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid()) OR
  equipment_id IN (SELECT id FROM equipment_list WHERE owner_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid()))
);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (
  farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
);
