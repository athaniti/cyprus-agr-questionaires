-- Database Status Check Script
-- Check the current state of the Cyprus Agriculture database

-- Check if tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM (
    VALUES 
        ('Users'),
        ('Locations'), 
        ('Themes'),
        ('Questionnaires'),
        ('QuestionnaireResponses'),
        ('QuestionnaireInvitations'),
        ('QuestionnaireQuotas')
) AS expected_tables(table_name)
LEFT JOIN information_schema.tables t 
    ON t.table_name = expected_tables.table_name 
    AND t.table_schema = 'public'
ORDER BY expected_tables.table_name;

-- Check record counts in each table
SELECT 
    'users' as table_name,
    COUNT(*) as record_count,
    STRING_AGG(role, ', ' ORDER BY role) as roles_present
FROM users
UNION ALL
SELECT 
    'locations' as table_name,
    COUNT(*) as record_count,
    CASE WHEN COUNT(*) > 0 THEN 'Cyprus regions loaded' ELSE 'No data' END
FROM locations
UNION ALL
SELECT 
    'themes' as table_name,
    COUNT(*) as record_count,
    CASE WHEN COUNT(*) > 0 THEN 'Themes loaded' ELSE 'No data' END
FROM themes
UNION ALL
SELECT 
    'questionnaires' as table_name,
    COUNT(*) as record_count,
    STRING_AGG(status, ', ') as statuses
FROM questionnaires
UNION ALL
SELECT 
    'questionnaire_responses' as table_name,
    COUNT(*) as record_count,
    STRING_AGG(status, ', ') as statuses
FROM questionnaire_responses
UNION ALL
SELECT 
    'questionnaire_invitations' as table_name,
    COUNT(*) as record_count,
    STRING_AGG(status, ', ') as statuses
FROM questionnaire_invitations
UNION ALL
SELECT 
    'questionnaire_quotas' as table_name,
    COUNT(*) as record_count,
    CASE WHEN COUNT(*) > 0 THEN 'Quotas set' ELSE 'No quotas' END
FROM questionnaire_quotas;

-- Show sample users if they exist
SELECT 
    email,
    first_name || ' ' || last_name as full_name,
    role,
    region,
    organization
FROM users
WHERE email IN ('admin@agriculture.gov.cy', 'user@agriculture.gov.cy', 'farmer@email.com')
ORDER BY role, email;

-- Show questionnaire summary if any exist
SELECT 
    name,
    category,
    status,
    target_responses,
    current_responses,
    ROUND((current_responses::numeric / NULLIF(target_responses, 0)) * 100, 1) as completion_percentage
FROM questionnaires
ORDER BY created_at DESC
LIMIT 10;