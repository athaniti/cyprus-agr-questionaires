-- Check Database Schema Script
-- This script checks what tables and columns actually exist in the database

-- Check if tables exist and their columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'questionnaires', 'questionnaire_responses', 'questionnaire_invitations', 'locations', 'themes')
ORDER BY table_name, ordinal_position;

-- Check specifically for users table structure
\d users;

-- Check specifically for questionnaires table structure  
\d questionnaires;

-- Check specifically for questionnaire_responses table structure
\d questionnaire_responses;

-- Show all tables in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;