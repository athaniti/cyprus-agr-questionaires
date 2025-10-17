-- Safe Sample Data Migration Script
-- This script handles foreign key dependencies properly

-- Step 1: Insert users first
DO $$
BEGIN
    RAISE NOTICE 'Step 1: Adding users...';
    
    -- Insert admin user
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@agriculture.gov.cy') THEN
        INSERT INTO users (id, email, first_name, last_name, role, region, organization, created_at)
        VALUES (
            '550e8400-e29b-41d4-a716-446655440001'::uuid,
            'admin@agriculture.gov.cy',
            'Adminιστρατόρας',
            'Συστήματος',
            'admin',
            'Λευκωσία',
            'Υπουργείο Γεωργίας',
            NOW()
        );
        RAISE NOTICE 'Admin user added';
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;

    -- Insert analyst user  
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@agriculture.gov.cy') THEN
        INSERT INTO users (id, email, first_name, last_name, role, region, organization, created_at)
        VALUES (
            '550e8400-e29b-41d4-a716-446655440002'::uuid,
            'user@agriculture.gov.cy',
            'Μαρία',
            'Παπαδοπούλου',
            'analyst',
            'Λεμεσός',
            'Υπηρεσία Γεωργίας Λεμεσού',
            NOW()
        );
        RAISE NOTICE 'Analyst user added';
    ELSE
        RAISE NOTICE 'Analyst user already exists';
    END IF;

    -- Insert farmer user
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'farmer@email.com') THEN
        INSERT INTO users (id, email, first_name, last_name, role, region, organization, created_at)
        VALUES (
            '550e8400-e29b-41d4-a716-446655440003'::uuid,
            'farmer@email.com',
            'Γιάννης',
            'Κυπριανού',
            'farmer',
            'Πάφος',
            'Αγρόκτημα Κυπριανού',
            NOW()
        );
        RAISE NOTICE 'Farmer user added';
    ELSE
        RAISE NOTICE 'Farmer user already exists';
    END IF;

END $$;

-- Step 2: Insert questionnaires (after users exist)
DO $$
BEGIN
    RAISE NOTICE 'Step 2: Adding questionnaires...';
    
    -- Check if admin user exists before creating questionnaires
    IF EXISTS (SELECT 1 FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440001'::uuid) THEN
        
        -- Add water quality questionnaire
        IF NOT EXISTS (SELECT 1 FROM questionnaires WHERE name = 'Ποιότητα Νερού Άρδευσης') THEN
            INSERT INTO questionnaires (id, name, description, category, status, schema, target_responses, current_responses, created_by, created_at)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440004'::uuid,
                'Ποιότητα Νερού Άρδευσης',
                'Αξιολόγηση της ποιότητας του νερού που χρησιμοποιείται για την άρδευση των καλλιεργειών',
                'environment',
                'active',
                '{"components":[{"label":"Πηγή Νερού","type":"select","key":"water_source","data":{"values":[{"label":"Γεώτρηση","value":"borehole"},{"label":"Δημοτικό Δίκτυο","value":"municipal"},{"label":"Ποτάμι/Ρέμα","value":"river"}]}},{"label":"Συχνότητα Ελέγχου","type":"number","key":"test_frequency"},{"label":"Προβλήματα Ποιότητας","type":"textarea","key":"quality_issues"}],"display":"form"}',
                150,
                0,
                '550e8400-e29b-41d4-a716-446655440001'::uuid,
                NOW()
            );
            RAISE NOTICE 'Water quality questionnaire added';
        ELSE
            RAISE NOTICE 'Water quality questionnaire already exists';
        END IF;

        -- Add economic analysis questionnaire
        IF NOT EXISTS (SELECT 1 FROM questionnaires WHERE name = 'Οικονομική Ανάλυση Καλλιεργειών') THEN
            INSERT INTO questionnaires (id, name, description, category, status, schema, target_responses, current_responses, created_by, created_at)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440005'::uuid,
                'Οικονομική Ανάλυση Καλλιεργειών',
                'Συλλογή δεδομένων για την οικονομική απόδοση των αγροτικών καλλιεργειών',
                'economics',
                'active',
                '{"components":[{"label":"Ετήσια Έσοδα (€)","type":"currency","key":"annual_income"},{"label":"Κόστος Παραγωγής (€)","type":"currency","key":"production_cost"},{"label":"Επενδύσεις σε Εξοπλισμό (€)","type":"currency","key":"equipment_investment"},{"label":"Επιδοτήσεις (€)","type":"currency","key":"subsidies"}],"display":"form"}',
                100,
                0,
                '550e8400-e29b-41d4-a716-446655440001'::uuid,
                NOW()
            );
            RAISE NOTICE 'Economic analysis questionnaire added';
        ELSE
            RAISE NOTICE 'Economic analysis questionnaire already exists';
        END IF;
        
    ELSE
        RAISE NOTICE 'Admin user not found, skipping questionnaire creation';
    END IF;

END $$;

-- Step 3: Add sample responses (after questionnaires exist)
DO $$
DECLARE
    q_crops_id uuid;
    q_water_id uuid; 
    q_economic_id uuid;
BEGIN
    RAISE NOTICE 'Step 3: Adding sample responses...';
    
    -- Get questionnaire IDs
    SELECT id INTO q_crops_id FROM questionnaires WHERE name = 'Αγροτικές Καλλιέργειες Κύπρου 2024' LIMIT 1;
    SELECT id INTO q_water_id FROM questionnaires WHERE name = 'Ποιότητα Νερού Άρδευσης' LIMIT 1;
    SELECT id INTO q_economic_id FROM questionnaires WHERE name = 'Οικονομική Ανάλυση Καλλιεργειών' LIMIT 1;
    
    -- Add response to crops questionnaire (if exists)
    IF q_crops_id IS NOT NULL AND EXISTS (SELECT 1 FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440003'::uuid) THEN
        IF NOT EXISTS (SELECT 1 FROM questionnaire_responses WHERE id = '550e8400-e29b-41d4-a716-446655440006'::uuid) THEN
            INSERT INTO questionnaire_responses (id, questionnaire_id, user_id, status, response_data, farm_name, region, municipality, started_at, submitted_at, completed_at)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440006'::uuid,
                q_crops_id,
                '550e8400-e29b-41d4-a716-446655440003'::uuid,
                'completed',
                '{"crop_type":"olives","area_hectares":5.2,"irrigation_system":"drip","organic_certification":"yes","annual_yield":1200}',
                'Αγρόκτημα Κυπριανού',
                'Πάφος',
                'Πάφος',
                NOW() - INTERVAL '7 days',
                NOW() - INTERVAL '6 days',
                NOW() - INTERVAL '6 days'
            );
            RAISE NOTICE 'Crops response added';
        ELSE
            RAISE NOTICE 'Crops response already exists';
        END IF;
    END IF;
    
    -- Add response to water questionnaire
    IF q_water_id IS NOT NULL AND EXISTS (SELECT 1 FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440003'::uuid) THEN
        IF NOT EXISTS (SELECT 1 FROM questionnaire_responses WHERE id = '550e8400-e29b-41d4-a716-446655440007'::uuid) THEN
            INSERT INTO questionnaire_responses (id, questionnaire_id, user_id, status, response_data, farm_name, region, municipality, started_at, submitted_at, completed_at)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440007'::uuid,
                q_water_id,
                '550e8400-e29b-41d4-a716-446655440003'::uuid,
                'completed',
                '{"water_source":"borehole","test_frequency":4,"quality_issues":"Μερικές φορές υπάρχει αυξημένη αλατότητα το καλοκαίρι"}',
                'Αγρόκτημα Κυπριανού',
                'Πάφος',
                'Πάφος',
                NOW() - INTERVAL '5 days',
                NOW() - INTERVAL '4 days',
                NOW() - INTERVAL '4 days'
            );
            RAISE NOTICE 'Water quality response added';
        ELSE
            RAISE NOTICE 'Water quality response already exists';
        END IF;
    END IF;
    
    -- Add response to economic questionnaire
    IF q_economic_id IS NOT NULL AND EXISTS (SELECT 1 FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440002'::uuid) THEN
        IF NOT EXISTS (SELECT 1 FROM questionnaire_responses WHERE id = '550e8400-e29b-41d4-a716-446655440008'::uuid) THEN
            INSERT INTO questionnaire_responses (id, questionnaire_id, user_id, status, response_data, farm_name, region, municipality, started_at, submitted_at)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440008'::uuid,
                q_economic_id,
                '550e8400-e29b-41d4-a716-446655440002'::uuid,
                'submitted',
                '{"annual_income":45000,"production_cost":28000,"equipment_investment":12000,"subsidies":3500}',
                'Κεντρική Μονάδα Αξιολόγησης',
                'Λεμεσός',
                'Λεμεσός',
                NOW() - INTERVAL '3 days',
                NOW() - INTERVAL '2 days',
                NULL
            );
            RAISE NOTICE 'Economic analysis response added';
        ELSE
            RAISE NOTICE 'Economic analysis response already exists';
        END IF;
    END IF;

END $$;

-- Step 4: Add invitations (after questionnaires exist)
DO $$
DECLARE
    q_crops_id uuid;
    q_water_id uuid;
    q_economic_id uuid;
BEGIN
    RAISE NOTICE 'Step 4: Adding invitations...';
    
    -- Get questionnaire IDs
    SELECT id INTO q_crops_id FROM questionnaires WHERE name = 'Αγροτικές Καλλιέργειες Κύπρου 2024' LIMIT 1;
    SELECT id INTO q_water_id FROM questionnaires WHERE name = 'Ποιότητα Νερού Άρδευσης' LIMIT 1;
    SELECT id INTO q_economic_id FROM questionnaires WHERE name = 'Οικονομική Ανάλυση Καλλιεργειών' LIMIT 1;
    
    -- Add invitation for crops questionnaire
    IF q_crops_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM questionnaire_invitations WHERE id = '550e8400-e29b-41d4-a716-446655440009'::uuid) THEN
            INSERT INTO questionnaire_invitations (id, questionnaire_id, email, status, invited_by, invited_at, responded_at)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440009'::uuid,
                q_crops_id,
                'farmer@email.com',
                'responded',
                '550e8400-e29b-41d4-a716-446655440001'::uuid,
                NOW() - INTERVAL '8 days',
                NOW() - INTERVAL '6 days'
            );
            RAISE NOTICE 'Crops questionnaire invitation added';
        END IF;
    END IF;
    
    -- Add invitation for economic questionnaire
    IF q_economic_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM questionnaire_invitations WHERE id = '550e8400-e29b-41d4-a716-44665544000a'::uuid) THEN
            INSERT INTO questionnaire_invitations (id, questionnaire_id, email, status, invited_by, invited_at, responded_at)
            VALUES (
                '550e8400-e29b-41d4-a716-44665544000a'::uuid,
                q_economic_id,
                'user@agriculture.gov.cy',
                'responded',
                '550e8400-e29b-41d4-a716-446655440001'::uuid,
                NOW() - INTERVAL '4 days',
                NOW() - INTERVAL '2 days'
            );
            RAISE NOTICE 'Economic questionnaire invitation added';
        END IF;
    END IF;
    
    -- Add pending invitation for water questionnaire
    IF q_water_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM questionnaire_invitations WHERE id = '550e8400-e29b-41d4-a716-44665544000b'::uuid) THEN
            INSERT INTO questionnaire_invitations (id, questionnaire_id, email, status, invited_by, invited_at)
            VALUES (
                '550e8400-e29b-41d4-a716-44665544000b'::uuid,
                q_water_id,
                'newfarmer@example.com',
                'pending',
                '550e8400-e29b-41d4-a716-446655440001'::uuid,
                NOW() - INTERVAL '1 day'
            );
            RAISE NOTICE 'Water questionnaire invitation added';
        END IF;
    END IF;

END $$;

-- Step 5: Update response counts
DO $$
BEGIN
    RAISE NOTICE 'Step 5: Updating response counts...';
    
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
        WHERE questionnaire_id IS NOT NULL
    );
    
    RAISE NOTICE 'Response counts updated';
END $$;

-- Final verification
SELECT 
    'users' as table_name,
    COUNT(*) as record_count,
    STRING_AGG(DISTINCT role, ', ') as details
FROM users
UNION ALL
SELECT 
    'questionnaires' as table_name,
    COUNT(*) as record_count,
    STRING_AGG(DISTINCT status, ', ') as details
FROM questionnaires
UNION ALL
SELECT 
    'questionnaire_responses' as table_name,
    COUNT(*) as record_count,
    STRING_AGG(DISTINCT status, ', ') as details
FROM questionnaire_responses
UNION ALL
SELECT 
    'questionnaire_invitations' as table_name,
    COUNT(*) as record_count,
    STRING_AGG(DISTINCT status, ', ') as details
FROM questionnaire_invitations;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE 'Safe sample data migration completed successfully!';
    RAISE NOTICE 'Test users: admin@agriculture.gov.cy, user@agriculture.gov.cy, farmer@email.com';
END $$;