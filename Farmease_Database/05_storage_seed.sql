-- ============================================================
-- File: 05_storage_seed.sql
-- Desc: Sets up storage buckets and secures them.
-- Author: Hajira
-- Upgraded: Removed incompatible dummy data. Secured storage policies.
-- ============================================================

-- ============================================================
-- 1. STORAGE BUCKETS
-- ============================================================

-- Bucket 1: equipment-images  (public, max 5MB per file)
-- Bucket 2: profile-photos    (private, max 2MB per file)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('equipment-images', 'equipment-images', true,  5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('profile-photos',   'profile-photos',   false, 2097152, ARRAY['image/jpeg','image/png'])
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 2. STORAGE POLICIES (Supabase Native)
-- ============================================================

-- Clear old policies to prevent duplicates
DROP POLICY IF EXISTS "equipment_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "equipment_images_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "equipment_images_owner_delete" ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_owner_manage" ON storage.objects;

-- EQUIPMENT IMAGES: Anyone can view, but only logged-in users can upload
CREATE POLICY "equipment_images_public_read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'equipment-images');

CREATE POLICY "equipment_images_auth_insert" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'equipment-images' AND auth.role() = 'authenticated');

-- EQUIPMENT IMAGES: Users can only delete their OWN uploaded files
-- (Supabase automatically sets the 'owner' column to auth.uid() on upload)
CREATE POLICY "equipment_images_owner_delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'equipment-images' AND auth.uid() = owner);

-- PROFILE PHOTOS: Private. Users can only see, upload, and delete their own.
CREATE POLICY "profile_photos_owner_manage" 
ON storage.objects FOR ALL 
USING (bucket_id = 'profile-photos' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid() = owner);
