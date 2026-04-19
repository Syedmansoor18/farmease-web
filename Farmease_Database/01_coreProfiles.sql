-- FILE 01: Core Schema (CORRECTED)
-- Use extensions schema for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  email           TEXT UNIQUE,
  phone           TEXT UNIQUE,
  aadhaar_number  TEXT UNIQUE,
  kisan_id        TEXT UNIQUE,
  state           TEXT NOT NULL,
  district        TEXT NOT NULL,
  village         TEXT,
  pincode         TEXT,
  password_hash   TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMERS
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

-- Automatic Timestamp Function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_farmers_updated
  BEFORE UPDATE ON farmers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_equipment_updated
  BEFORE UPDATE ON equipment_list FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bookings_updated
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- MISCELLENOUS QUERIES!!  
--ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;

--ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
--ALTER TABLE profiles ADD COLUMN IF NOT EXISTS village TEXT;
--ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pincode TEXT;

--ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
--ALTER TABLE profiles ALTER COLUMN id SET DEFAULT uuid_generate_v4();
--ALTER TABLE profiles ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE NOT NULL;
--ALTER TABLE profiles          DISABLE ROW LEVEL SECURITY;
--ALTER TABLE farmers           DISABLE ROW LEVEL SECURITY;
--ALTER TABLE equipment_list    DISABLE ROW LEVEL SECURITY;
--ALTER TABLE bookings          DISABLE ROW LEVEL SECURITY;
--ALTER TABLE crop_equipment_map DISABLE ROW LEVEL SECURITY;


-- 1. Drop the dependent views first (they lock the table)
--DROP VIEW IF EXISTS booking_details;
--DROP VIEW IF EXISTS equipment_with_owner;

-- 2. Change the ID column type in all related tables
-- We have to drop and recreate the foreign key constraints to change types
--ALTER TABLE farmers DROP CONSTRAINT farmers_profile_id_fkey;
--ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
--ALTER TABLE farmers ALTER COLUMN profile_id TYPE TEXT;

-- 3. Re-add the foreign key constraint
--ALTER TABLE farmers 
--ADD CONSTRAINT farmers_profile_id_fkey 
--FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 4. Re-run your File-04 (Views & Functions)
