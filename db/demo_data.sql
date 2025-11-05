-- Demo Data for Cyprus Agriculture Questionnaires System
-- Run this script against PostgreSQL database

-- First, create some users if they don't exist
INSERT INTO users (id, first_name, last_name, email, role, created_at)
VALUES 
    ('bbbbbbbb-2222-2222-2222-222222222222', 'Μαρία', 'Παπαδοπούλου', 'maria.papadopoulou@agriculture.gov.cy', 'analyst', NOW()),
    ('cccccccc-3333-3333-3333-333333333333', 'Γιάννης', 'Κωνσταντίνου', 'giannis.konstantinou@agriculture.gov.cy', 'analyst', NOW()),
    ('dddddddd-4444-4444-4444-444444444444', 'Έλενα', 'Γεωργίου', 'elena.georgiou@agriculture.gov.cy', 'farmer', NOW()),
    ('eeeeeeee-5555-5555-5555-555555555555', 'Πέτρος', 'Χριστοδούλου', 'petros.christodoulou@agriculture.gov.cy', 'farmer', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert demo questionnaires
INSERT INTO questionnaires (id, name, description, category, status, target_responses, current_responses, created_by, created_at, published_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Έρευνα Καλλιέργειας Σιτηρών 2025', 'Λεπτομερής έρευνα για τις πρακτικές καλλιέργειας σιτηρών στην Κύπρο', 'Σιτηρά', 'active', 150, 45, 'aaaaaaaa-1111-1111-1111-111111111111', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),
    ('22222222-2222-2222-2222-222222222222', 'Έρευνα Κτηνοτροφικών Μονάδων', 'Αξιολόγηση των σύγχρονων πρακτικών κτηνοτροφίας στην Κύπρο', 'Κτηνοτροφία', 'active', 120, 78, 'bbbbbbbb-2222-2222-2222-222222222222', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days'),
    ('33333333-3333-3333-3333-333333333333', 'Έρευνα Αρδευτικών Συστημάτων', 'Μελέτη της χρήσης νερού και αρδευτικών συστημάτων', 'Άρδευση', 'active', 200, 156, 'cccccccc-3333-3333-3333-333333333333', NOW() - INTERVAL '60 days', NOW() - INTERVAL '50 days'),
    ('44444444-4444-4444-4444-444444444444', 'Έρευνα Βιολογικής Γεωργίας', 'Αξιολόγηση των πρακτικών βιολογικής καλλιέργειας', 'Βιολογική Γεωργία', 'draft', 80, 0, 'aaaaaaaa-1111-1111-1111-111111111111', NOW() - INTERVAL '10 days', NULL),
    ('55555555-5555-5555-5555-555555555555', 'Έρευνα Θερμοκηπιακών Καλλιεργειών', 'Μελέτη θερμοκηπιακής παραγωγής και τεχνολογίας', 'Θερμοκήπια', 'active', 90, 23, 'bbbbbbbb-2222-2222-2222-222222222222', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days'),
    ('66666666-6666-6666-6666-666666666666', 'Έρευνα Ελαιοπαραγωγής', 'Παραγωγή ελαιολάδου και καλλιέργεια ελιάς', 'Ελαιοκαλλιέργεια', 'completed', 180, 180, 'cccccccc-3333-3333-3333-333333333333', NOW() - INTERVAL '90 days', NOW() - INTERVAL '80 days'),
    ('77777777-7777-7777-7777-777777777777', 'Έρευνα Αμπελοκαλλιέργειας', 'Πρακτικές καλλιέργειας αμπελιού και οινοποίησης', 'Αμπελοκαλλιέργεια', 'active', 65, 41, 'aaaaaaaa-1111-1111-1111-111111111111', NOW() - INTERVAL '35 days', NOW() - INTERVAL '30 days'),
    ('88888888-8888-8888-8888-888888888888', 'Έρευνα Μηχανοποίησης', 'Χρήση αγροτικών μηχανημάτων και τεχνολογίας', 'Μηχανοποίηση', 'draft', 100, 0, 'bbbbbbbb-2222-2222-2222-222222222222', NOW() - INTERVAL '5 days', NULL);

-- Insert additional farms for better demo data
INSERT INTO farms (id, farm_code, owner_name, contact_phone, contact_email, province, community, address, farm_type, total_area, size_category, economic_size, legal_status, main_crops, annual_production_value, latitude, longitude, registration_date, created_at)
VALUES 
    ('farm-001', 'CY000301', 'Κώστας Αντωνίου', '+357 99123456', 'kostas.antoniou@gmail.com', 'Λευκωσία', 'Αγλαντζιά', 'Οδός Κύπρου 15', 'Φυτική Παραγωγή', 45.50, 'Μικρή (5-20 στρέμματα)', 'Μικρό (8.000-25.000€)', 'Φυσικό Πρόσωπο', '["Σιτάρι", "Κριθάρι", "Καλαμπόκι"]', 18500.00, 35.1856, 33.3823, NOW() - INTERVAL '120 days', NOW() - INTERVAL '120 days'),
    ('farm-002', 'CY000302', 'Άννα Νικολάου', '+357 99234567', 'anna.nikolaou@hotmail.com', 'Λεμεσός', 'Γερμασόγεια', 'Λεωφόρος Μακαρίου 230', 'Μικτή Εκμετάλλευση', 120.75, 'Μεσαία (20-100 στρέμματα)', 'Μεσαίο (25.000-100.000€)', 'Φυσικό Πρόσωπο', '["Εσπεριδοειδή", "Ελιές", "Αμπέλι"]', 67500.00, 34.7075, 33.0226, NOW() - INTERVAL '200 days', NOW() - INTERVAL '200 days'),
    ('farm-003', 'CY000303', 'Μιχάλης Χριστοφόρου', '+357 99345678', 'michalis.christoforou@cytanet.com.cy', 'Πάφος', 'Κάτω Πάφος', 'Οδός Αγίου Παύλου 45', 'Ζωική Παραγωγή', 89.25, 'Μεσαία (20-100 στρέμματα)', 'Μεσαίο (25.000-100.000€)', 'Φυσικό Πρόσωπο', '["Βοοειδή", "Πρόβατα"]', 45800.00, 34.7572, 32.4040, NOW() - INTERVAL '180 days', NOW() - INTERVAL '180 days'),
    ('farm-004', 'CY000304', 'Ελένη Κωνσταντίνου', '+357 99456789', 'eleni.konstantinou@gmail.com', 'Λάρνακα', 'Λίβαδια', 'Λεωφόρος Δημοκρατίας 67', 'Θερμοκηπιακή Παραγωγή', 12.80, 'Πολύ Μικρή (0-5 στρέμματα)', 'Μικρό (8.000-25.000€)', 'Φυσικό Πρόσωπο', '["Ντομάτες", "Αγγούρια", "Πιπεριές"]', 22300.00, 34.9110, 33.6362, NOW() - INTERVAL '150 days', NOW() - INTERVAL '150 days'),
    ('farm-005', 'CY000305', 'Γιώργος Παναγιώτου', '+357 99567890', 'giorgos.panagiotou@cablenet.com.cy', 'Αμμόχωστος', 'Παραλίμνι', 'Οδός Ελευθερίας 123', 'Φυτική Παραγωγή', 340.50, 'Μεγάλη (100+ στρέμματα)', 'Μεγάλο (100.000€+)', 'Εταιρεία Περιορισμένης Ευθύνης', '["Πατάτες", "Καρότα", "Κρεμμύδια"]', 245000.00, 35.0371, 33.9829, NOW() - INTERVAL '300 days', NOW() - INTERVAL '300 days'),
    ('farm-006', 'CY000306', 'Σοφία Δημητρίου', '+357 99678901', 'sofia.dimitriou@primehome.com', 'Λευκωσία', 'Στρόβολος', 'Πλατεία Ελευθερίας 8', 'Βιολογική Γεωργία', 67.40, 'Μεσαία (20-100 στρέμματα)', 'Μεσαίο (25.000-100.000€)', 'Φυσικό Πρόσωπο', '["Βιολογικά Λαχανικά", "Αρωματικά Φυτά"]', 38900.00, 35.1264, 33.3411, NOW() - INTERVAL '240 days', NOW() - INTERVAL '240 days'),
    ('farm-007', 'CY000307', 'Νίκος Μιχαηλίδης', '+357 99789012', 'nikos.michailidis@spidernet.com.cy', 'Λεμεσός', 'Μουτταγιάκα', 'Λεωφόρος Αμαθούντος 156', 'Αμπελοκαλλιέργεια', 156.90, 'Μεγάλη (100+ στρέμματα)', 'Μεγάλο (100.000€+)', 'Φυσικό Πρόσωπο', '["Αμπέλι", "Σταφύλια Οίνου"]', 89700.00, 34.6851, 33.0888, NOW() - INTERVAL '365 days', NOW() - INTERVAL '365 days'),
    ('farm-008', 'CY000308', 'Μαρία Αθανασίου', '+357 99890123', 'maria.athanasiou@logos.cy.net', 'Πάφος', 'Πεγεία', 'Οδός Ακάμα 67', 'Ελαιοκαλλιέργεια', 234.20, 'Μεγάλη (100+ στρέμματα)', 'Μεγάλο (100.000€+)', 'Οικογενειακή Επιχείρηση', '["Ελιές", "Χαρούπια"]', 156400.00, 34.8912, 32.3778, NOW() - INTERVAL '220 days', NOW() - INTERVAL '220 days');

-- Insert form responses with varied statuses and completion rates
INSERT INTO form_responses (id, farm_id, questionnaire_id, response_data, status, completion_percentage, submitted_at, created_at, updated_at, created_by)
VALUES 
    -- Responses for Σιτηρά questionnaire
    (gen_random_uuid(), 'farm-001', '11111111-1111-1111-1111-111111111111', '{"farmSize": "45.5", "wheatArea": "25", "barleyArea": "15", "cornArea": "5.5", "irrigationMethod": "sprinkler", "organicFertilizer": true}', 'submitted', 100, NOW() - INTERVAL '15 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days', 'aaaaaaaa-1111-1111-1111-111111111111'),
    (gen_random_uuid(), 'farm-002', '11111111-1111-1111-1111-111111111111', '{"farmSize": "120.75", "wheatArea": "40", "barleyArea": "30"}', 'in_progress', 65, NULL, NOW() - INTERVAL '18 days', NOW() - INTERVAL '2 days', 'aaaaaaaa-1111-1111-1111-111111111111'),
    (gen_random_uuid(), 'farm-005', '11111111-1111-1111-1111-111111111111', '{"farmSize": "340.5", "wheatArea": "150", "barleyArea": "100", "cornArea": "90.5", "irrigationMethod": "drip", "organicFertilizer": false, "pesticideUse": "integrated"}', 'submitted', 100, NOW() - INTERVAL '12 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '12 days', 'aaaaaaaa-1111-1111-1111-111111111111'),
    
    -- Responses for Κτηνοτροφία questionnaire  
    (gen_random_uuid(), 'farm-003', '22222222-2222-2222-2222-222222222222', '{"livestockTypes": ["cattle", "sheep"], "cattleCount": 45, "sheepCount": 120, "feedingSystem": "pasture", "veterinaryCare": "regular"}', 'submitted', 100, NOW() - INTERVAL '10 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '10 days', 'bbbbbbbb-2222-2222-2222-222222222222'),
    (gen_random_uuid(), 'farm-007', '22222222-2222-2222-2222-222222222222', '{"livestockTypes": ["cattle"], "cattleCount": 25}', 'draft', 35, NULL, NOW() - INTERVAL '40 days', NOW() - INTERVAL '5 days', 'bbbbbbbb-2222-2222-2222-222222222222'),
    
    -- Responses for Άρδευση questionnaire
    (gen_random_uuid(), 'farm-002', '33333333-3333-3333-3333-333333333333', '{"irrigatedArea": "85.5", "irrigationMethod": "drip", "waterSource": "borehole", "waterConsumption": 2400, "automationLevel": "semi-automated"}', 'submitted', 100, NOW() - INTERVAL '8 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '8 days', 'cccccccc-3333-3333-3333-333333333333'),
    (gen_random_uuid(), 'farm-004', '33333333-3333-3333-3333-333333333333', '{"irrigatedArea": "12.8", "irrigationMethod": "greenhouse_drip", "waterSource": "municipal", "waterConsumption": 180, "automationLevel": "fully-automated", "fertigation": true}', 'submitted', 100, NOW() - INTERVAL '6 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '6 days', 'cccccccc-3333-3333-3333-333333333333'),
    (gen_random_uuid(), 'farm-005', '33333333-3333-3333-3333-333333333333', '{"irrigatedArea": "280.0", "irrigationMethod": "sprinkler", "waterSource": "dam"}', 'in_progress', 75, NULL, NOW() - INTERVAL '55 days', NOW() - INTERVAL '3 days', 'cccccccc-3333-3333-3333-333333333333'),
    
    -- Responses for Θερμοκήπια questionnaire
    (gen_random_uuid(), 'farm-004', '55555555-5555-5555-5555-555555555555', '{"greenhouseArea": "12.8", "greenhouseType": "plastic", "climateControl": "automated", "crops": ["tomatoes", "cucumbers", "peppers"], "heatingSystem": "geothermal"}', 'submitted', 100, NOW() - INTERVAL '5 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days', 'bbbbbbbb-2222-2222-2222-222222222222'),
    (gen_random_uuid(), 'farm-006', '55555555-5555-5555-5555-555555555555', '{"greenhouseArea": "8.5", "greenhouseType": "glass"}', 'draft', 40, NULL, NOW() - INTERVAL '12 days', NOW() - INTERVAL '1 day', 'bbbbbbbb-2222-2222-2222-222222222222'),
    
    -- Responses for completed Ελαιοπαραγωγή questionnaire
    (gen_random_uuid(), 'farm-008', '66666666-6666-6666-6666-666666666666', '{"oliveGroveArea": "234.2", "oliveVarieties": ["koroneiki", "kalamon"], "treeAge": "25-50", "harvestMethod": "mechanical", "oilProduction": 4500, "organicCertified": false}', 'submitted', 100, NOW() - INTERVAL '75 days', NOW() - INTERVAL '85 days', NOW() - INTERVAL '75 days', 'cccccccc-3333-3333-3333-333333333333'),
    (gen_random_uuid(), 'farm-002', '66666666-6666-6666-6666-666666666666', '{"oliveGroveArea": "35.5", "oliveVarieties": ["koroneiki"], "treeAge": "10-25", "harvestMethod": "manual", "oilProduction": 850, "organicCertified": true}', 'submitted', 100, NOW() - INTERVAL '78 days', NOW() - INTERVAL '82 days', NOW() - INTERVAL '78 days', 'cccccccc-3333-3333-3333-333333333333'),
    
    -- Responses for Αμπελοκαλλιέργεια questionnaire
    (gen_random_uuid(), 'farm-007', '77777777-7777-7777-7777-777777777777', '{"vineyardArea": "156.9", "grapeVarieties": ["mavro", "xynisteri", "maratheftiko"], "wineProduction": true, "productionVolume": 8500, "organicMethods": false}', 'submitted', 100, NOW() - INTERVAL '25 days', NOW() - INTERVAL '32 days', NOW() - INTERVAL '25 days', 'aaaaaaaa-1111-1111-1111-111111111111'),
    (gen_random_uuid(), 'farm-002', '77777777-7777-7777-7777-777777777777', '{"vineyardArea": "12.0", "grapeVarieties": ["sultana"]}', 'in_progress', 55, NULL, NOW() - INTERVAL '28 days', NOW() - INTERVAL '4 days', 'aaaaaaaa-1111-1111-1111-111111111111');

-- Update questionnaire current_responses to match actual responses
UPDATE questionnaires SET current_responses = (
    SELECT COUNT(*) FROM form_responses 
    WHERE form_responses.questionnaire_id = questionnaires.id
);

-- Insert some sample quotas for regional targeting
INSERT INTO questionnaire_quotas (id, questionnaire_id, region, municipality, target_count, current_count, category, created_at)
VALUES 
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Λευκωσία', 'Αγλαντζιά', 25, 8, 'Σιτηρά', NOW()),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Λεμεσός', 'Γερμασόγεια', 30, 12, 'Σιτηρά', NOW()),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Πάφος', NULL, 40, 15, 'Σιτηρά', NOW()),
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Πάφος', 'Κάτω Πάφος', 35, 18, 'Κτηνοτροφία', NOW()),
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Λάρνακα', NULL, 25, 8, 'Κτηνοτροφία', NOW()),
    (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Λευκωσία', NULL, 60, 45, 'Άρδευση', NOW()),
    (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Λεμεσός', NULL, 50, 38, 'Άρδευση', NOW()),
    (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Αμμόχωστος', 'Παραλίμνι', 45, 35, 'Άρδευση', NOW());

COMMIT;

-- Print summary
SELECT 'Demo data inserted successfully!' as message;
SELECT 'Questionnaires created: ' || COUNT(*) as summary FROM questionnaires WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';
SELECT 'Farms created: ' || COUNT(*) as summary FROM farms WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';  
SELECT 'Form responses created: ' || COUNT(*) as summary FROM form_responses WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';