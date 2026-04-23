-- ============================================
-- File: 04_storedfunctions.sql
-- Description:
-- This file contains all stored procedures and helper functions 
-- used in the FarmEase system. These functions handle core backend 
-- logic.
-- Author: Pragya
-- Upgraded: Added security_invoker to Views to strictly enforce RLS.
-- ============================================

-- ============================================
-- 1. STORED FUNCTIONS
-- ============================================

-- FUNCTION 1: check_booking_conflict
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_equipment_id UUID,
  p_start_date   DATE,
  p_end_date     DATE,
  p_exclude_id   UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM bookings
  WHERE equipment_id = p_equipment_id
    AND status IN ('approved', 'active')
    AND id IS DISTINCT FROM p_exclude_id
    AND (
      p_start_date <= end_date AND p_end_date >= start_date
    );
  RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;

-- FUNCTION 2: calculate_booking_price
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_equipment_id UUID,
  p_start_date   DATE,
  p_end_date     DATE
)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  daily_rate DECIMAL(10, 2);
  num_days   INTEGER;
  is_free_eq BOOLEAN;
BEGIN
  SELECT price_per_day, is_free
  INTO daily_rate, is_free_eq
  FROM equipment_list
  WHERE id = p_equipment_id;

  IF is_free_eq THEN
    RETURN 0.00;
  END IF;

  num_days := (p_end_date - p_start_date) + 1;
  RETURN daily_rate * num_days;
END;
$$ LANGUAGE plpgsql;

-- FUNCTION 3: get_advisor_equipment
CREATE OR REPLACE FUNCTION get_advisor_equipment(
  p_crop  TEXT,
  p_state TEXT
)
RETURNS TABLE (
  equipment_type TEXT,
  priority       INTEGER,
  season         TEXT,
  notes          TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (cem.equipment_type)
    cem.equipment_type,
    cem.priority,
    cem.season,
    cem.notes
  FROM crop_equipment_map cem
  WHERE cem.crop_name = LOWER(p_crop)
    AND (cem.state IS NULL OR LOWER(cem.state) = LOWER(p_state))
  ORDER BY cem.equipment_type, cem.state NULLS LAST, cem.priority ASC;
END;
$$ LANGUAGE plpgsql;

-- FUNCTION 4: get_nearby_equipment
CREATE OR REPLACE FUNCTION get_nearby_equipment(
  p_state           TEXT,
  p_district        TEXT,
  p_equipment_types TEXT[]
)
RETURNS TABLE (
  equipment_id  UUID,
  name          TEXT,
  type          TEXT,
  price_per_day DECIMAL(10, 2),
  is_free       BOOLEAN,
  location      TEXT,
  owner_name    TEXT,
  owner_phone   TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    el.id,
    el.name,
    el.type,
    el.price_per_day,
    el.is_free,
    el.location,
    p.full_name,
    p.phone
  FROM equipment_list el
  JOIN farmers f   ON f.id = el.owner_id
  JOIN profiles p  ON p.id = f.profile_id
  WHERE el.is_available = TRUE
    AND LOWER(el.state) = LOWER(p_state)
    AND (
      LOWER(el.district) = LOWER(p_district)
      OR LOWER(el.state)  = LOWER(p_state)
    )
    AND el.type = ANY(p_equipment_types)
  ORDER BY
    (LOWER(el.district) = LOWER(p_district)) DESC,
    el.price_per_day ASC;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- 2. SECURE VIEWS
-- ============================================

-- VIEW: equipment_with_owner
-- Upgraded with security_invoker = true so RLS is enforced
CREATE OR REPLACE VIEW equipment_with_owner WITH (security_invoker = true) AS
SELECT
  el.id,
  el.name,
  el.type,
  el.description,
  el.price_per_day,
  el.is_free,
  el.location,
  el.district,
  el.state,
  el.pincode,
  el.is_available,
  el.condition,
  el.images,
  el.created_at,
  f.id          AS owner_farmer_id,
  p.full_name   AS owner_name,
  p.phone       AS owner_phone,
  f.land_size   AS owner_land_size
FROM equipment_list el
JOIN farmers  f ON f.id = el.owner_id
JOIN profiles p ON p.id = f.profile_id;

-- VIEW: booking_details
-- Upgraded with security_invoker = true so private bookings stay private
CREATE OR REPLACE VIEW booking_details WITH (security_invoker = true) AS
SELECT
  b.id,
  b.status,
  b.start_date,
  b.end_date,
  b.total_price,
  b.notes,
  b.created_at,
  el.name         AS equipment_name,
  el.type         AS equipment_type,
  el.price_per_day,
  el.location     AS equipment_location,
  pb.full_name    AS borrower_name,
  pb.phone        AS borrower_phone,
  po.full_name    AS owner_name,
  po.phone        AS owner_phone
FROM bookings b
JOIN equipment_list el  ON el.id  = b.equipment_id
JOIN farmers bf         ON bf.id  = b.farmer_id
JOIN profiles pb        ON pb.id  = bf.profile_id
JOIN farmers of_        ON of_.id = el.owner_id
JOIN profiles po        ON po.id  = of_.profile_id;