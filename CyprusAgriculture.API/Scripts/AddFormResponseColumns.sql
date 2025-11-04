-- Add missing columns to farms table for FormIO integration
-- This script adds the submission_status_id column that was missing

-- Check if submission_status_id column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'farms' AND column_name = 'submission_status_id'
    ) THEN
        ALTER TABLE farms ADD COLUMN submission_status_id UUID NULL;
        
        -- Add foreign key constraint to submission_statuses table
        ALTER TABLE farms ADD CONSTRAINT fk_farms_submission_status 
        FOREIGN KEY (submission_status_id) REFERENCES submission_statuses(id);
        
        RAISE NOTICE 'Added submission_status_id column to farms table';
    ELSE
        RAISE NOTICE 'submission_status_id column already exists in farms table';
    END IF;
END $$;

-- Verify the tables exist
SELECT 
    'form_schemas' as table_name,
    COUNT(*) as record_count
FROM form_schemas
UNION ALL
SELECT 
    'form_responses' as table_name,
    COUNT(*) as record_count  
FROM form_responses
UNION ALL
SELECT 
    'submission_statuses' as table_name,
    COUNT(*) as record_count
FROM submission_statuses;

-- Show the farms table structure to verify the new column
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'farms' 
ORDER BY ordinal_position;