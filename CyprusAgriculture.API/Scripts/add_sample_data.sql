-- Migration Script: Add Sample Users and Data
-- Run this script after the main database has been created

-- Insert sample users (only if they don't exist)
INSERT INTO users (id, email, first_name, last_name, role, region, organization, created_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'admin@agriculture.gov.cy',
    'Adminιστρατόρας',
    'Συστήματος',
    'admin',
    'Λευκωσία',
    'Υπουργείο Γεωργίας',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@agriculture.gov.cy'
);

INSERT INTO users (id, email, first_name, last_name, role, region, organization, created_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'user@agriculture.gov.cy',
    'Μαρία',
    'Παπαδοπούλου',
    'analyst',
    'Λεμεσός',
    'Υπηρεσία Γεωργίας Λεμεσού',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'user@agriculture.gov.cy'
);

INSERT INTO users (id, email, first_name, last_name, role, region, organization, created_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'farmer@email.com',
    'Γιάννης',
    'Κυπριανού',
    'farmer',
    'Πάφος',
    'Αγρόκτημα Κυπριανού',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'farmer@email.com'
);

-- Add additional questionnaires (only if they don't exist and users exist)
INSERT INTO questionnaires (id, name, description, category, status, schema, target_responses, current_responses, created_by, created_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'Ποιότητα Νερού Άρδευσης',
    'Αξιολόγηση της ποιότητας του νερού που χρησιμοποιείται για την άρδευση των καλλιεργειών',
    'environment',
    'active',
    '{"components":[{"label":"Πηγή Νερού","type":"select","key":"water_source","data":{"values":[{"label":"Γεώτρηση","value":"borehole"},{"label":"Δημοτικό Δίκτυο","value":"municipal"},{"label":"Ποτάμι/Ρέμα","value":"river"}]}},{"label":"Συχνότητα Ελέγχου","type":"number","key":"test_frequency"},{"label":"Προβλήματα Ποιότητας","type":"textarea","key":"quality_issues"}],"display":"form"}',
    150,
    0,
    '550e8400-e29b-41d4-a716-446655440001',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM questionnaires WHERE name = 'Ποιότητα Νερού Άρδευσης'
)
AND EXISTS (
    SELECT 1 FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

INSERT INTO questionnaires (id, name, description, category, status, schema, target_responses, current_responses, created_by, created_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440005'::uuid,
    'Οικονομική Ανάλυση Καλλιεργειών',
    'Συλλογή δεδομένων για την οικονομική απόδοση των αγροτικών καλλιεργειών',
    'economics',
    'active',
    '{"components":[{"label":"Ετήσια Έσοδα (€)","type":"currency","key":"annual_income"},{"label":"Κόστος Παραγωγής (€)","type":"currency","key":"production_cost"},{"label":"Επενδύσεις σε Εξοπλισμό (€)","type":"currency","key":"equipment_investment"},{"label":"Επιδοτήσεις (€)","type":"currency","key":"subsidies"}],"display":"form"}',
    100,
    0,
    '550e8400-e29b-41d4-a716-446655440001',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM questionnaires WHERE name = 'Οικονομική Ανάλυση Καλλιεργειών'
)
AND EXISTS (
    SELECT 1 FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- Add sample responses (only if questionnaires exist)
INSERT INTO questionnaire_responses (id, questionnaire_id, user_id, status, response_data, farm_name, region, municipality, started_at, submitted_at, completed_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440006'::uuid,
    q.id,
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'completed',
    '{"crop_type":"olives","area_hectares":5.2,"irrigation_system":"drip","organic_certification":"yes","annual_yield":1200}',
    'Αγρόκτημα Κυπριανού',
    'Πάφος',
    'Πάφος',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '6 days'
FROM questionnaires q
WHERE q.name = 'Αγροτικές Καλλιέργειες Κύπρου 2024'
AND NOT EXISTS (
    SELECT 1 FROM questionnaire_responses 
    WHERE id = '550e8400-e29b-41d4-a716-446655440006'::uuid
);

INSERT INTO questionnaire_responses (id, questionnaire_id, user_id, status, response_data, farm_name, region, municipality, started_at, submitted_at, completed_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440007'::uuid,
    q.id,
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'completed',
    '{"water_source":"borehole","test_frequency":4,"quality_issues":"Μερικές φορές υπάρχει αυξημένη αλατότητα το καλοκαίρι"}',
    'Αγρόκτημα Κυπριανού',
    'Πάφος',
    'Πάφος',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
FROM questionnaires q
WHERE q.name = 'Ποιότητα Νερού Άρδευσης'
AND NOT EXISTS (
    SELECT 1 FROM questionnaire_responses 
    WHERE id = '550e8400-e29b-41d4-a716-446655440007'::uuid
);

INSERT INTO questionnaire_responses (id, questionnaire_id, user_id, status, response_data, farm_name, region, municipality, started_at, submitted_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440008'::uuid,
    q.id,
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'submitted',
    '{"annual_income":45000,"production_cost":28000,"equipment_investment":12000,"subsidies":3500}',
    'Κεντρική Μονάδα Αξιολόγησης',
    'Λεμεσός',
    'Λεμεσός',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days',
    NULL
FROM questionnaires q
WHERE q.name = 'Οικονομική Ανάλυση Καλλιεργειών'
AND NOT EXISTS (
    SELECT 1 FROM questionnaire_responses 
    WHERE id = '550e8400-e29b-41d4-a716-446655440008'::uuid
);

-- Add questionnaire invitations (only if questionnaires exist)
INSERT INTO questionnaire_invitations (id, questionnaire_id, email, status, invited_by, invited_at, responded_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440009'::uuid,
    q.id,
    'farmer@email.com',
    'responded',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '6 days'
FROM questionnaires q
WHERE q.name = 'Αγροτικές Καλλιέργειες Κύπρου 2024'
AND NOT EXISTS (
    SELECT 1 FROM questionnaire_invitations 
    WHERE id = '550e8400-e29b-41d4-a716-446655440009'::uuid
);

INSERT INTO questionnaire_invitations (id, questionnaire_id, email, status, invited_by, invited_at, responded_at)
SELECT 
    '550e8400-e29b-41d4-a716-44665544000a'::uuid,
    q.id,
    'user@agriculture.gov.cy',
    'responded',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '2 days'
FROM questionnaires q
WHERE q.name = 'Οικονομική Ανάλυση Καλλιεργειών'
AND NOT EXISTS (
    SELECT 1 FROM questionnaire_invitations 
    WHERE id = '550e8400-e29b-41d4-a716-44665544000a'::uuid
);

INSERT INTO questionnaire_invitations (id, questionnaire_id, email, status, invited_by, invited_at)
SELECT 
    '550e8400-e29b-41d4-a716-44665544000b'::uuid,
    q.id,
    'newfarmer@example.com',
    'pending',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    NOW() - INTERVAL '1 day'
FROM questionnaires q
WHERE q.name = 'Ποιότητα Νερού Άρδευσης'
AND NOT EXISTS (
    SELECT 1 FROM questionnaire_invitations 
    WHERE id = '550e8400-e29b-41d4-a716-44665544000b'::uuid
);

-- Update response counts for questionnaires
UPDATE questionnaires 
SET current_responses = (
    SELECT COUNT(*) 
    FROM questionnaire_responses 
    WHERE questionnaire_id = questionnaires.id 
    AND status IN ('submitted', 'completed')
)
WHERE id IN (
    SELECT DISTINCT questionnaire_id 
    FROM questionnaire_responses
);

-- Verify the data was inserted
SELECT 
    'users' as table_name,
    COUNT(*) as record_count
FROM users
UNION ALL
SELECT 
    'questionnaires' as table_name,
    COUNT(*) as record_count
FROM questionnaires
UNION ALL
SELECT 
    'questionnaire_responses' as table_name,
    COUNT(*) as record_count
FROM questionnaire_responses
UNION ALL
SELECT 
    'questionnaire_invitations' as table_name,
    COUNT(*) as record_count
FROM questionnaire_invitations;

-- PostgreSQL uses DO blocks instead of PRINT
DO $$
BEGIN
    RAISE NOTICE 'Sample data migration completed successfully!';
END $$;