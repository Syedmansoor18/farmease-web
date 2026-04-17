-- ============================================
-- File: 03_data.sql
-- Description: Contains crop-equipment mapping data 
-- and sample test records used for system testing.
-- Author: Pragya
-- ============================================

-- Season:   kharif (Jun–Oct), rabi (Oct–Mar), zaid (Mar–Jun)


INSERT INTO crop_equipment_map (crop_name, state, equipment_type, priority, season, notes) VALUES

-- WHEAT (Rabi — major crop in North/Central India)

('wheat', NULL,            'tractor',      1, 'rabi',   'Field preparation — needed by all wheat farmers'),
('wheat', NULL,            'rotavator',    1, 'rabi',   'Breaks clods, mixes crop residue into soil'),
('wheat', NULL,            'seeder',       1, 'rabi',   'Zero-till or conventional seed drill for line sowing'),
('wheat', NULL,            'harvester',    1, 'rabi',   'Combine harvester at maturity'),
('wheat', NULL,            'thresher',     2, 'rabi',   'If combine harvester not available'),
('wheat', NULL,            'sprayer',      2, 'rabi',   'Pesticide and herbicide application'),
('wheat', 'Punjab',        'cultivator',   2, 'rabi',   'Stubble management after paddy'),
('wheat', 'Haryana',       'cultivator',   2, 'rabi',   'Stubble management after paddy'),
('wheat', 'Uttar Pradesh', 'plough',       2, 'rabi',   'Deep ploughing in clay-heavy soils'),
('wheat', 'Madhya Pradesh','rotavator',    1, 'rabi',   'Preferred over disc harrow in MP soils'),


-- PADDY / RICE (Kharif — major in East, South, and Punjab)

('paddy', NULL,            'tractor',      1, 'kharif', 'Puddling and land preparation'),
('paddy', NULL,            'transplanter', 1, 'kharif', 'Mechanical transplanting saves 30% labour cost'),
('paddy', NULL,            'tiller',       1, 'kharif', 'Power tiller for wet field preparation'),
('paddy', NULL,            'thresher',     1, 'kharif', 'Paddy thresher after harvesting'),
('paddy', NULL,            'sprayer',      2, 'kharif', 'Herbicide in early stage, insecticide later'),
('paddy', NULL,            'pump',         1, 'kharif', 'Water pump for flood irrigation management'),
('paddy', 'West Bengal',   'tiller',       1, 'kharif', 'Power tiller preferred over tractor in small fields'),
('paddy', 'Odisha',        'transplanter', 2, 'kharif', 'Drum seeder also suitable'),
('paddy', 'Punjab',        'harvester',    1, 'kharif', 'Combine harvester — critical for timeliness'),
('paddy', 'Tamil Nadu',    'transplanter', 1, 'kharif', 'System of Rice Intensification (SRI) compatible'),
('paddy', 'Andhra Pradesh','harvester',    1, 'kharif', 'Combine harvester reduces post-harvest losses'),


-- COTTON (Kharif — Maharashtra, Gujarat, Telangana, AP)

('cotton', NULL,           'tractor',      1, 'kharif', 'Deep tillage required before sowing'),
('cotton', NULL,           'plough',       1, 'kharif', 'Sub-soil plough for deep black soil'),
('cotton', NULL,           'seeder',       1, 'kharif', 'Row seeder for proper spacing'),
('cotton', NULL,           'sprayer',      1, 'kharif', 'Frequent spraying — bollworm, aphid control'),
('cotton', NULL,           'cultivator',   2, 'kharif', 'Inter-row weeding and aeration'),
('cotton', 'Maharashtra',  'rotavator',    1, 'kharif', 'Black soil prep — rotavator works well'),
('cotton', 'Gujarat',      'sprayer',      1, 'kharif', 'Bt cotton still needs pest monitoring sprayer'),
('cotton', 'Telangana',    'tractor',      1, 'kharif', 'Heavy tillage in red loam soils'),


-- SUGARCANE (Annual — UP, Maharashtra, Karnataka, TN)

('sugarcane', NULL,        'tractor',      1, 'all',    'Deep furrow opening for ratoon planting'),
('sugarcane', NULL,        'plough',       1, 'all',    'Sub-soil ploughing 45cm deep'),
('sugarcane', NULL,        'rotavator',    2, 'all',    'Seedbed preparation'),
('sugarcane', NULL,        'pump',         1, 'all',    'Critical irrigation throughout the year'),
('sugarcane', NULL,        'sprayer',      2, 'all',    'Weedicide and top-dressing application'),
('sugarcane', 'Uttar Pradesh', 'tractor', 1, 'rabi',   'Autumn + spring planting land prep'),
('sugarcane', 'Maharashtra','cultivator',  2, 'all',    'Earthing-up operation'),

-- MAIZE / CORN (Kharif and Rabi both)

('maize', NULL,            'tractor',      1, 'kharif', 'Land preparation'),
('maize', NULL,            'seeder',       1, 'kharif', 'Precision planter for correct spacing'),
('maize', NULL,            'sprayer',      2, 'kharif', 'Fall armyworm is major threat'),
('maize', NULL,            'harvester',    2, 'kharif', 'Maize harvester or combine with maize header'),
('maize', NULL,            'thresher',     2, 'kharif', 'Maize sheller/thresher'),
('maize', 'Karnataka',     'tiller',       2, 'kharif', 'Small-holder maize — power tiller preferred'),
('maize', 'Bihar',         'seeder',       1, 'rabi',   'Rabi maize — zero-till seeder saves cost'),


-- GROUNDNUT / PEANUT (Kharif — Gujarat, AP, Rajasthan)

('groundnut', NULL,        'tractor',      1, 'kharif', 'Ridge and furrow land preparation'),
('groundnut', NULL,        'seeder',       1, 'kharif', 'Groundnut seed drill for proper depth'),
('groundnut', NULL,        'cultivator',   2, 'kharif', 'Inter-cultivation weeding'),
('groundnut', NULL,        'sprayer',      2, 'kharif', 'Foliar spray for fungal disease'),
('groundnut', 'Gujarat',   'harvester',    2, 'kharif', 'Groundnut digger + windrower'),
('groundnut', 'Andhra Pradesh', 'tiller', 2, 'kharif', 'Power tiller for small plots'),


-- SOYBEAN (Kharif — MP, Maharashtra, Rajasthan)

('soybean', NULL,          'tractor',      1, 'kharif', 'Broad bed furrow maker required'),
('soybean', NULL,          'seeder',       1, 'kharif', 'Seed-cum-fertilizer drill'),
('soybean', NULL,          'sprayer',      2, 'kharif', 'Yellow mosaic virus control spray'),
('soybean', NULL,          'harvester',    2, 'kharif', 'Combine harvester reduces shattering losses'),
('soybean', 'Madhya Pradesh','rotavator',  1, 'kharif', 'Preferred for black soil preparation'),


-- MUSTARD /  (Rabi — Rajasthan, UP, Haryana)

('mustard', NULL,          'tractor',      1, 'rabi',   'One deep tillage + two shallow'),
('mustard', NULL,          'seeder',       1, 'rabi',   'Small seed drill with narrow row spacing'),
('mustard', NULL,          'sprayer',      2, 'rabi',   'Aphid and Alternaria leaf spot control'),
('mustard', NULL,          'thresher',     1, 'rabi',   'Mustard thresher after harvesting'),
('mustard', 'Rajasthan',   'cultivator',   2, 'rabi',   'Sandy soil — light cultivation needed'),


-- PULSES — Chickpea / Lentil / Moong (Rabi/Kharif)

('chickpea', NULL,         'tractor',      1, 'rabi',   'One tillage pass is usually sufficient'),
('chickpea', NULL,         'seeder',       1, 'rabi',   'Seed-cum-fertilizer drill'),
('chickpea', NULL,         'sprayer',      2, 'rabi',   'Pod borer control'),
('chickpea', NULL,         'thresher',     2, 'rabi',   'Pulse thresher'),
('moong',    NULL,         'tractor',      1, 'zaid',   'Short duration summer crop'),
('moong',    NULL,         'seeder',       1, 'zaid',   'Line sowing for uniform germination'),
('moong',    NULL,         'sprayer',      2, 'zaid',   'Mite and thrips control in summer'),
('lentil',   NULL,         'seeder',       1, 'rabi',   'Zero-till seeder saves moisture'),
('lentil',   NULL,         'thresher',     2, 'rabi',   'Pulse thresher at harvest'),


-- VEGETABLES — Tomato, Onion, Potato (varies)

('tomato', NULL,           'tractor',      1, 'all',    'Ridge/bed preparation'),
('tomato', NULL,           'sprayer',      1, 'all',    'Frequent spray — viral, fungal, pest control'),
('tomato', NULL,           'pump',         1, 'all',    'Drip irrigation or flood irrigation pump'),
('onion',  NULL,           'tractor',      1, 'rabi',   'Bed preparation for transplanting'),
('onion',  NULL,           'sprayer',      1, 'rabi',   'Thrips control is critical'),
('onion',  NULL,           'pump',         2, 'rabi',   'Regular light irrigation'),
('potato', NULL,           'tractor',      1, 'rabi',   'Deep tillage + ridging before planting'),
('potato', NULL,           'plough',       1, 'rabi',   'Ridge plough for hilling'),
('potato', NULL,           'sprayer',      1, 'rabi',   'Blight control — multiple sprays'),
('potato', 'Uttar Pradesh','harvester',    2, 'rabi',   'Potato digger for large farms'),
('potato', 'West Bengal',  'tiller',       2, 'rabi',   'Power tiller for small plots'),


-- BANANA (Perennial — AP, Tamil Nadu, Maharashtra, Karnataka)

('banana', NULL,           'tractor',      1, 'all',    'Initial pit digging and soil preparation'),
('banana', NULL,           'pump',         1, 'all',    'Drip/flood irrigation throughout the year'),
('banana', NULL,           'sprayer',      1, 'all',    'Sigatoka disease and weevil control');