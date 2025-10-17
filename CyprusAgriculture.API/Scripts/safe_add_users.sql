-- Safe User Addition Script
-- This script attempts to add users with flexible column detection

-- First, let's see what columns exist in the users table
DO $$
DECLARE
    table_exists boolean;
    col_updated_at boolean;
    col_created_at boolean;
BEGIN
    -- Check if users table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Users table does not exist!';
        RETURN;
    END IF;
    
    -- Check if updated_at column exists
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'updated_at'
    ) INTO col_updated_at;
    
    -- Check if created_at column exists  
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'created_at'
    ) INTO col_created_at;
    
    RAISE NOTICE 'Users table exists: %, has created_at: %, has updated_at: %', 
                 table_exists, col_created_at, col_updated_at;
END $$;

-- Try to insert users with basic columns only
DO $$
BEGIN
    -- Insert admin user (basic version)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@agriculture.gov.cy') THEN
        BEGIN
            INSERT INTO users (id, email, first_name, last_name, role, region, organization)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440001'::uuid,
                'admin@agriculture.gov.cy',
                'Adminιστρατόρας',
                'Συστήματος',
                'admin',
                'Λευκωσία',
                'Υπουργείο Γεωργίας'
            );
            RAISE NOTICE 'Admin user added successfully';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to add admin user: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;

    -- Insert analyst user
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@agriculture.gov.cy') THEN
        BEGIN
            INSERT INTO users (id, email, first_name, last_name, role, region, organization)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440002'::uuid,
                'user@agriculture.gov.cy',
                'Μαρία',
                'Παπαδοπούλου',
                'analyst',
                'Λεμεσός',
                'Υπηρεσία Γεωργίας Λεμεσού'
            );
            RAISE NOTICE 'Analyst user added successfully';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to add analyst user: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Analyst user already exists';
    END IF;

    -- Insert farmer user
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'farmer@email.com') THEN
        BEGIN
            INSERT INTO users (id, email, first_name, last_name, role, region, organization)
            VALUES (
                '550e8400-e29b-41d4-a716-446655440003'::uuid,
                'farmer@email.com',
                'Γιάννης',
                'Κυπριανού',
                'farmer',
                'Πάφος',
                'Αγρόκτημα Κυπριανού'
            );
            RAISE NOTICE 'Farmer user added successfully';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to add farmer user: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Farmer user already exists';
    END IF;
END $$;

-- Verify users were created
SELECT 
    email,
    first_name,
    last_name,
    role,
    region
FROM users 
WHERE email IN ('admin@agriculture.gov.cy', 'user@agriculture.gov.cy', 'farmer@email.com')
ORDER BY role, email;