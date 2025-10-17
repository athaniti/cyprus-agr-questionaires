-- Simple User Addition Script
-- Add basic test users for the Cyprus Agriculture Questionnaires system

-- Insert admin user
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
) ON CONFLICT (email) DO NOTHING;

-- Insert analyst user
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
) ON CONFLICT (email) DO NOTHING;

-- Insert farmer user
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
) ON CONFLICT (email) DO NOTHING;

-- Verify users were created
SELECT email, first_name, last_name, role, region 
FROM users 
WHERE email IN ('admin@agriculture.gov.cy', 'user@agriculture.gov.cy', 'farmer@email.com')
ORDER BY role, email;