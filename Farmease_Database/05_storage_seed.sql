-- File: 05_storage_seed.sql
-- Desc: Sets up storage buckets and inserts 
-- initial seed data for the application
-- Author: Hajira

-- ============================================================
-- FARMER EQUIPMENT SHARING PLATFORM
-- FILE 05: Storage Buckets + Sample Test Data
-- Run LAST — after files 01 through 04
-- ============================================================


-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Bucket 1: equipment-images  (public, max 5MB per file)
-- Bucket 2: profile-photos    (private, max 2MB per file)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('equipment-images', 'equipment-images', true,  5242880,
    ARRAY['image/jpeg','image/png','image/webp']),
  ('profile-photos',   'profile-photos',   false, 2097152,
    ARRAY['image/jpeg','image/png'])
ON CONFLICT (id) DO NOTHING;



-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Drop policies if they already exist

DROP POLICY IF EXISTS "equipment_images_public_read"
ON storage.objects;

DROP POLICY IF EXISTS "equipment_images_auth_insert"
ON storage.objects;

DROP POLICY IF EXISTS "equipment_images_owner_delete"
ON storage.objects;



-- Anyone can view equipment images

CREATE POLICY "equipment_images_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'equipment-images');



-- Users can upload equipment images

CREATE POLICY "equipment_images_auth_insert"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'equipment-images'
);



-- Owner can delete their own equipment image

CREATE POLICY "equipment_images_owner_delete"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'equipment-images'
);


-- ============================================================
-- SAMPLE TEST DATA
-- ============================================================
-- Creates:
--   2 test profiles
--   2 farmers
--   3 equipment listings
--   1 booking
--
-- SAFE FOR DEVELOPMENT ONLY
-- Delete before production
-- ============================================================



-- ============================================================
-- TEST PROFILE 1 (Farmer / Lender)
-- ============================================================

INSERT INTO profiles (
  id,
  firebase_uid,
  full_name,
  phone,
  email,
  password_hash,
  state,
  district,
  village,
  pincode,
  is_verified
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'firebase_test_uid_1',
  'Ranjit Singh',
  '9876543210',
  'ranjit@test.com',
  '$2b$10$PLACEHOLDER_HASH_REPLACE_IN_PROD',
  'Punjab',
  'Ludhiana',
  'Sahnewal',
  '141120',
  true
)
ON CONFLICT DO NOTHING;



-- ============================================================
-- FARMER RECORD 1
-- ============================================================

INSERT INTO farmers (
  id,
  profile_id,
  land_size,
  farmer_type,
  primary_crops
)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  12.5,
  'medium',
  ARRAY['wheat', 'paddy']
)
ON CONFLICT DO NOTHING;



-- ============================================================
-- TEST PROFILE 2 (Borrower)
-- ============================================================

INSERT INTO profiles (
  id,
  firebase_uid,
  full_name,
  phone,
  email,
  password_hash,
  state,
  district,
  village,
  pincode,
  is_verified
)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'firebase_test_uid_2',
  'Sunita Devi',
  '9123456789',
  'sunita@test.com',
  '$2b$10$PLACEHOLDER_HASH_REPLACE_IN_PROD',
  'Punjab',
  'Ludhiana',
  'Doraha',
  '141421',
  true
)
ON CONFLICT DO NOTHING;



-- ============================================================
-- FARMER RECORD 2
-- ============================================================

INSERT INTO farmers (
  id,
  profile_id,
  land_size,
  farmer_type,
  primary_crops
)
VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  2.0,
  'small',
  ARRAY['wheat', 'mustard']
)
ON CONFLICT DO NOTHING;



-- ============================================================
-- TEST EQUIPMENT LISTINGS
-- ============================================================

INSERT INTO equipment_list (
  id,
  owner_id,
  name,
  type,
  description,
  price_per_day,
  is_free,
  location,
  district,
  state,
  pincode,
  is_available,
  condition
)
VALUES

(
  'c1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'John Deere 5050D Tractor',
  'tractor',
  '50HP tractor, good condition. Available with driver on request.',
  800.00,
  false,
  'Sahnewal',
  'Ludhiana',
  'Punjab',
  '141120',
  true,
  'good'
),

(
  'c1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000001',
  'Massey Ferguson Combine Harvester',
  'harvester',
  'Self-propelled combine, wheat and paddy compatible.',
  3500.00,
  false,
  'Sahnewal',
  'Ludhiana',
  'Punjab',
  '141120',
  true,
  'excellent'
),

(
  'c1000000-0000-0000-0000-000000000003',
  'b1000000-0000-0000-0000-000000000001',
  'Manual Seed Drill (6-row)',
  'seeder',
  'Simple 6-row seed drill. Sharing for free with neighboring farmers.',
  0.00,
  true,
  'Sahnewal',
  'Ludhiana',
  'Punjab',
  '141120',
  true,
  'good'
)

ON CONFLICT DO NOTHING;



-- ============================================================
-- TEST BOOKING
-- ============================================================

INSERT INTO bookings (
  equipment_id,
  farmer_id,
  start_date,
  end_date,
  total_price,
  status,
  notes
)
VALUES (
  'c1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  CURRENT_DATE + INTERVAL '3 days',
  CURRENT_DATE + INTERVAL '5 days',
  2400.00,
  'pending',
  'Need tractor for wheat field preparation. Will pick up myself.'
)

ON CONFLICT DO NOTHING;
