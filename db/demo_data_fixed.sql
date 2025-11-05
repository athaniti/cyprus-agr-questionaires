-- Demo Data for Cyprus Agriculture Questionnaires System (Fixed Schema)
-- Run this script against PostgreSQL database

-- First, create some users if they don't exist
INSERT INTO users (id, first_name, last_name, email, role, is_active, created_at)
VALUES 
    ('bbbbbbbb-2222-2222-2222-222222222222', 'Maria', 'Papadopoulou', 'maria.papadopoulou@agriculture.gov.cy', 'analyst', true, NOW()),
    ('cccccccc-3333-3333-3333-333333333333', 'Giannis', 'Konstantinou', 'giannis.konstantinou@agriculture.gov.cy', 'analyst', true, NOW()),
    ('dddddddd-4444-4444-4444-444444444444', 'Elena', 'Georgiou', 'elena.georgiou@agriculture.gov.cy', 'farmer', true, NOW()),
    ('eeeeeeee-5555-5555-5555-555555555555', 'Petros', 'Christodoulou', 'petros.christodoulou@agriculture.gov.cy', 'farmer', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert demo questionnaires with proper schema field
INSERT INTO questionnaires (id, name, description, category, status, schema, target_responses, current_responses, created_by, created_at, published_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Grain Cultivation Survey 2025', 'Detailed survey on grain cultivation practices in Cyprus', 'Grains', 'active', '{"display":"form","components":[]}', 150, 0, 'aaaaaaaa-1111-1111-1111-111111111111', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),
    ('22222222-2222-2222-2222-222222222222', 'Livestock Units Survey', 'Assessment of modern livestock practices in Cyprus', 'Livestock', 'active', '{"display":"form","components":[]}', 120, 0, 'bbbbbbbb-2222-2222-2222-222222222222', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days'),
    ('33333333-3333-3333-3333-333333333333', 'Irrigation Systems Survey', 'Study of water use and irrigation systems', 'Irrigation', 'active', '{"display":"form","components":[]}', 200, 0, 'cccccccc-3333-3333-3333-333333333333', NOW() - INTERVAL '60 days', NOW() - INTERVAL '50 days'),
    ('44444444-4444-4444-4444-444444444444', 'Organic Farming Survey', 'Assessment of organic cultivation practices', 'Organic Farming', 'draft', '{"display":"form","components":[]}', 80, 0, 'aaaaaaaa-1111-1111-1111-111111111111', NOW() - INTERVAL '10 days', NULL),
    ('55555555-5555-5555-5555-555555555555', 'Greenhouse Cultivation Survey', 'Study of greenhouse production and technology', 'Greenhouses', 'active', '{"display":"form","components":[]}', 90, 0, 'bbbbbbbb-2222-2222-2222-222222222222', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days'),
    ('66666666-6666-6666-6666-666666666666', 'Olive Production Survey', 'Olive oil production and olive cultivation', 'Olive Cultivation', 'completed', '{"display":"form","components":[]}', 180, 0, 'cccccccc-3333-3333-3333-333333333333', NOW() - INTERVAL '90 days', NOW() - INTERVAL '80 days'),
    ('77777777-7777-7777-7777-777777777777', 'Viticulture Survey', 'Grape cultivation and winemaking practices', 'Viticulture', 'active', '{"display":"form","components":[]}', 65, 0, 'aaaaaaaa-1111-1111-1111-111111111111', NOW() - INTERVAL '35 days', NOW() - INTERVAL '30 days'),
    ('88888888-8888-8888-8888-888888888888', 'Mechanization Survey', 'Use of agricultural machinery and technology', 'Mechanization', 'draft', '{"display":"form","components":[]}', 100, 0, 'bbbbbbbb-2222-2222-2222-222222222222', NOW() - INTERVAL '5 days', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert additional farms for better demo data with proper is_active field
INSERT INTO farms (id, farm_code, owner_name, contact_phone, contact_email, province, community, address, farm_type, total_area, size_category, economic_size, legal_status, main_crops, annual_production_value, latitude, longitude, is_active, registration_date, created_at)
VALUES 
    ('farm-001', 'CY000301', 'Kostas Antoniou', '+357 99123456', 'kostas.antoniou@gmail.com', 'Nicosia', 'Aglandjia', 'Cyprus Street 15', 'Plant Production', 45.50, 'Small (5-20 acres)', 'Small (8.000-25.000)', 'Individual', '["Wheat", "Barley", "Corn"]', 18500.00, 35.1856, 33.3823, true, NOW() - INTERVAL '120 days', NOW() - INTERVAL '120 days'),
    ('farm-002', 'CY000302', 'Anna Nikolaou', '+357 99234567', 'anna.nikolaou@hotmail.com', 'Limassol', 'Germasogeia', 'Makarios Avenue 230', 'Mixed Farm', 120.75, 'Medium (20-100 acres)', 'Medium (25.000-100.000)', 'Individual', '["Citrus", "Olives", "Grapes"]', 67500.00, 34.7075, 33.0226, true, NOW() - INTERVAL '200 days', NOW() - INTERVAL '200 days'),
    ('farm-003', 'CY000303', 'Michalis Christoforou', '+357 99345678', 'michalis.christoforou@cytanet.com.cy', 'Paphos', 'Kato Paphos', 'Saint Paul Street 45', 'Animal Production', 89.25, 'Medium (20-100 acres)', 'Medium (25.000-100.000)', 'Individual', '["Cattle", "Sheep"]', 45800.00, 34.7572, 32.4040, true, NOW() - INTERVAL '180 days', NOW() - INTERVAL '180 days'),
    ('farm-004', 'CY000304', 'Eleni Konstantinou', '+357 99456789', 'eleni.konstantinou@gmail.com', 'Larnaca', 'Livadia', 'Democracy Avenue 67', 'Greenhouse Production', 12.80, 'Very Small (0-5 acres)', 'Small (8.000-25.000)', 'Individual', '["Tomatoes", "Cucumbers", "Peppers"]', 22300.00, 34.9110, 33.6362, true, NOW() - INTERVAL '150 days', NOW() - INTERVAL '150 days'),
    ('farm-005', 'CY000305', 'Giorgos Panagiotou', '+357 99567890', 'giorgos.panagiotou@cablenet.com.cy', 'Famagusta', 'Paralimni', 'Freedom Street 123', 'Plant Production', 340.50, 'Large (100+ acres)', 'Large (100.000+)', 'Limited Company', '["Potatoes", "Carrots", "Onions"]', 245000.00, 35.0371, 33.9829, true, NOW() - INTERVAL '300 days', NOW() - INTERVAL '300 days'),
    ('farm-006', 'CY000306', 'Sofia Dimitriou', '+357 99678901', 'sofia.dimitriou@primehome.com', 'Nicosia', 'Strovolos', 'Liberty Square 8', 'Organic Farming', 67.40, 'Medium (20-100 acres)', 'Medium (25.000-100.000)', 'Individual', '["Organic Vegetables", "Aromatic Plants"]', 38900.00, 35.1264, 33.3411, true, NOW() - INTERVAL '240 days', NOW() - INTERVAL '240 days'),
    ('farm-007', 'CY000307', 'Nikos Michailidis', '+357 99789012', 'nikos.michailidis@spidernet.com.cy', 'Limassol', 'Mouttagiaka', 'Amathountos Avenue 156', 'Viticulture', 156.90, 'Large (100+ acres)', 'Large (100.000+)', 'Individual', '["Grapes", "Wine Grapes"]', 89700.00, 34.6851, 33.0888, true, NOW() - INTERVAL '365 days', NOW() - INTERVAL '365 days'),
    ('farm-008', 'CY000308', 'Maria Athanasiou', '+357 99890123', 'maria.athanasiou@logos.cy.net', 'Paphos', 'Pegeia', 'Akamas Street 67', 'Olive Cultivation', 234.20, 'Large (100+ acres)', 'Large (100.000+)', 'Family Business', '["Olives", "Carobs"]', 156400.00, 34.8912, 32.3778, true, NOW() - INTERVAL '220 days', NOW() - INTERVAL '220 days')
ON CONFLICT (id) DO NOTHING;

-- Insert form responses with varied statuses and completion rates
INSERT INTO form_responses (id, farm_id, questionnaire_id, response_data, status, completion_percentage, submitted_at, created_at, updated_at, created_by)
VALUES 
    -- Responses for Grains questionnaire
    (gen_random_uuid(), 'farm-001', '11111111-1111-1111-1111-111111111111', '{"farmSize": "45.5", "wheatArea": "25", "barleyArea": "15", "cornArea": "5.5", "irrigationMethod": "sprinkler", "organicFertilizer": true}', 'submitted', 100, NOW() - INTERVAL '15 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days', 'aaaaaaaa-1111-1111-1111-111111111111'),
    (gen_random_uuid(), 'farm-002', '11111111-1111-1111-1111-111111111111', '{"farmSize": "120.75", "wheatArea": "40", "barleyArea": "30"}', 'in_progress', 65, NULL, NOW() - INTERVAL '18 days', NOW() - INTERVAL '2 days', 'aaaaaaaa-1111-1111-1111-111111111111'),
    (gen_random_uuid(), 'farm-005', '11111111-1111-1111-1111-111111111111', '{"farmSize": "340.5", "wheatArea": "150", "barleyArea": "100", "cornArea": "90.5", "irrigationMethod": "drip", "organicFertilizer": false, "pesticideUse": "integrated"}', 'submitted', 100, NOW() - INTERVAL '12 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '12 days', 'aaaaaaaa-1111-1111-1111-111111111111'),
    (gen_random_uuid(), 'farm-006', '11111111-1111-1111-1111-111111111111', '{"farmSize": "67.4", "wheatArea": "30", "organicMethods": true}', 'draft', 45, NULL, NOW() - INTERVAL '8 days', NOW() - INTERVAL '1 day', 'aaaaaaaa-1111-1111-1111-111111111111'),
    
    -- Responses for Livestock questionnaire  
    (gen_random_uuid(), 'farm-003', '22222222-2222-2222-2222-222222222222', '{"livestockTypes": ["cattle", "sheep"], "cattleCount": 45, "sheepCount": 120, "feedingSystem": "pasture", "veterinaryCare": "regular"}', 'submitted', 100, NOW() - INTERVAL '10 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '10 days', 'bbbbbbbb-2222-2222-2222-222222222222'),
    (gen_random_uuid(), 'farm-007', '22222222-2222-2222-2222-222222222222', '{"livestockTypes": ["cattle"], "cattleCount": 25}', 'draft', 35, NULL, NOW() - INTERVAL '40 days', NOW() - INTERVAL '5 days', 'bbbbbbbb-2222-2222-2222-222222222222'),
    (gen_random_uuid(), 'farm-002', '22222222-2222-2222-2222-222222222222', '{"livestockTypes": ["goats"], "goatCount": 85, "feedingSystem": "mixed"}', 'in_progress', 70, NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '3 days', 'bbbbbbbb-2222-2222-2222-222222222222'),
    
    -- Responses for Irrigation questionnaire
    (gen_random_uuid(), 'farm-002', '33333333-3333-3333-3333-333333333333', '{"irrigatedArea": "85.5", "irrigationMethod": "drip", "waterSource": "borehole", "waterConsumption": 2400, "automationLevel": "semi-automated"}', 'submitted', 100, NOW() - INTERVAL '8 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '8 days', 'cccccccc-3333-3333-3333-333333333333'),
    (gen_random_uuid(), 'farm-004', '33333333-3333-3333-3333-333333333333', '{"irrigatedArea": "12.8", "irrigationMethod": "greenhouse_drip", "waterSource": "municipal", "waterConsumption": 180, "automationLevel": "fully-automated", "fertigation": true}', 'submitted', 100, NOW() - INTERVAL '6 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '6 days', 'cccccccc-3333-3333-3333-333333333333'),
    (gen_random_uuid(), 'farm-005', '33333333-3333-3333-3333-333333333333', '{"irrigatedArea": "280.0", "irrigationMethod": "sprinkler", "waterSource": "dam"}', 'in_progress', 75, NULL, NOW() - INTERVAL '55 days', NOW() - INTERVAL '3 days', 'cccccccc-3333-3333-3333-333333333333'),
    (gen_random_uuid(), 'farm-001', '33333333-3333-3333-3333-333333333333', '{"irrigatedArea": "45.5", "irrigationMethod": "sprinkler", "waterSource": "well"}', 'submitted', 100, NOW() - INTERVAL '4 days', NOW() - INTERVAL '48 days', NOW() - INTERVAL '4 days', 'cccccccc-3333-3333-3333-333333333333'),
    (gen_random_uuid(), 'farm-008', '33333333-3333-3333-3333-333333333333', '{"irrigatedArea": "180.0", "irrigationMethod": "drip", "waterSource": "reservoir"}', 'draft', 40, NULL, NOW() - INTERVAL '52 days', NOW() - INTERVAL '2 days', 'cccccccc-3333-3333-3333-333333333333'),
    
    -- Responses for Greenhouses questionnaire
    (gen_random_uuid(), 'farm-004', '55555555-5555-5555-5555-555555555555', '{"greenhouseArea": "12.8", "greenhouseType": "plastic", "climateControl": "automated", "crops": ["tomatoes", "cucumbers", "peppers"], "heatingSystem": "geothermal"}', 'submitted', 100, NOW() - INTERVAL '5 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days', 'bbbbbbbb-2222-2222-2222-222222222222'),
    (gen_random_uuid(), 'farm-006', '55555555-5555-5555-5555-555555555555', '{"greenhouseArea": "8.5", "greenhouseType": "glass"}', 'draft', 40, NULL, NOW() - INTERVAL '12 days', NOW() - INTERVAL '1 day', 'bbbbbbbb-2222-2222-2222-222222222222'),
    
    -- Responses for completed Olive Production questionnaire
    (gen_random_uuid(), 'farm-008', '66666666-6666-6666-6666-666666666666', '{"oliveGroveArea": "234.2", "oliveVarieties": ["koroneiki", "kalamon"], "treeAge": "25-50", "harvestMethod": "mechanical", "oilProduction": 4500, "organicCertified": false}', 'submitted', 100, NOW() - INTERVAL '75 days', NOW() - INTERVAL '85 days', NOW() - INTERVAL '75 days', 'cccccccc-3333-3333-3333-333333333333'),
    (gen_random_uuid(), 'farm-002', '66666666-6666-6666-6666-666666666666', '{"oliveGroveArea": "35.5", "oliveVarieties": ["koroneiki"], "treeAge": "10-25", "harvestMethod": "manual", "oilProduction": 850, "organicCertified": true}', 'submitted', 100, NOW() - INTERVAL '78 days', NOW() - INTERVAL '82 days', NOW() - INTERVAL '78 days', 'cccccccc-3333-3333-3333-333333333333'),
    
    -- Responses for Viticulture questionnaire
    (gen_random_uuid(), 'farm-007', '77777777-7777-7777-7777-777777777777', '{"vineyardArea": "156.9", "grapeVarieties": ["mavro", "xynisteri", "maratheftiko"], "wineProduction": true, "productionVolume": 8500, "organicMethods": false}', 'submitted', 100, NOW() - INTERVAL '25 days', NOW() - INTERVAL '32 days', NOW() - INTERVAL '25 days', 'aaaaaaaa-1111-1111-1111-111111111111'),
    (gen_random_uuid(), 'farm-002', '77777777-7777-7777-7777-777777777777', '{"vineyardArea": "12.0", "grapeVarieties": ["sultana"]}', 'in_progress', 55, NULL, NOW() - INTERVAL '28 days', NOW() - INTERVAL '4 days', 'aaaaaaaa-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Update questionnaire current_responses to match actual responses
UPDATE questionnaires SET current_responses = (
    SELECT COUNT(*) FROM form_responses 
    WHERE form_responses.questionnaire_id = questionnaires.id
);

-- Insert some sample quotas for regional targeting
INSERT INTO questionnaire_quotas (id, questionnaire_id, region, municipality, target_count, current_count, category, created_at)
VALUES 
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Nicosia', 'Aglandjia', 25, 8, 'Grains', NOW()),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Limassol', 'Germasogeia', 30, 12, 'Grains', NOW()),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Paphos', NULL, 40, 15, 'Grains', NOW()),
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Paphos', 'Kato Paphos', 35, 18, 'Livestock', NOW()),
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Larnaca', NULL, 25, 8, 'Livestock', NOW()),
    (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Nicosia', NULL, 60, 45, 'Irrigation', NOW()),
    (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Limassol', NULL, 50, 38, 'Irrigation', NOW()),
    (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Famagusta', 'Paralimni', 45, 35, 'Irrigation', NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Print summary
SELECT 'Demo data inserted successfully!' as message;
SELECT 'Questionnaires created: ' || COUNT(*) as summary FROM questionnaires WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';
SELECT 'Farms created: ' || COUNT(*) as summary FROM farms WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';  
SELECT 'Form responses created: ' || COUNT(*) as summary FROM form_responses WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';