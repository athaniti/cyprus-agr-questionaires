-- Cyprus Agriculture Questionnaires Database Schema
-- PostgreSQL Script for Database Creation and Initial Setup

-- Create database (run this separately as a superuser)
-- CREATE DATABASE CyAgroQ;
-- \c CyAgroQ;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tables if they exist (for development/testing)
DROP TABLE IF EXISTS questionnaire_quotas CASCADE;
DROP TABLE IF EXISTS questionnaire_invitations CASCADE;
DROP TABLE IF EXISTS questionnaire_responses CASCADE;
DROP TABLE IF EXISTS questionnaires CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS themes CASCADE;

-- Create Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'analyst', 'farmer')),
    region VARCHAR(50),
    organization VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create Locations table (Cyprus regions, municipalities, communities)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('region', 'municipality', 'community')),
    parent_name VARCHAR(100),
    parent_id UUID REFERENCES locations(id),
    code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Themes table
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create Questionnaires table
CREATE TABLE questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    schema JSONB NOT NULL DEFAULT '{}',
    target_responses INTEGER NOT NULL DEFAULT 0,
    current_responses INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Create Questionnaire Responses table
CREATE TABLE questionnaire_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    response_data JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    farm_name VARCHAR(200),
    region VARCHAR(100),
    municipality VARCHAR(100),
    postal_code VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Create Questionnaire Invitations table
CREATE TABLE questionnaire_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    email VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    declined_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    invitation_token VARCHAR(500),
    message VARCHAR(1000)
);

-- Create Questionnaire Quotas table
CREATE TABLE questionnaire_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL,
    municipality VARCHAR(100),
    target_count INTEGER NOT NULL,
    current_count INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_region ON users(region);

CREATE INDEX idx_questionnaires_status ON questionnaires(status);
CREATE INDEX idx_questionnaires_category ON questionnaires(category);
CREATE INDEX idx_questionnaires_created_by ON questionnaires(created_by);
CREATE INDEX idx_questionnaires_created_at ON questionnaires(created_at);

CREATE INDEX idx_responses_questionnaire_id ON questionnaire_responses(questionnaire_id);
CREATE INDEX idx_responses_user_id ON questionnaire_responses(user_id);
CREATE INDEX idx_responses_status ON questionnaire_responses(status);
CREATE INDEX idx_responses_region ON questionnaire_responses(region);

CREATE INDEX idx_invitations_questionnaire_id ON questionnaire_invitations(questionnaire_id);
CREATE INDEX idx_invitations_user_id ON questionnaire_invitations(user_id);
CREATE INDEX idx_invitations_status ON questionnaire_invitations(status);
CREATE INDEX idx_invitations_email ON questionnaire_invitations(email);

CREATE INDEX idx_quotas_questionnaire_id ON questionnaire_quotas(questionnaire_id);
CREATE INDEX idx_quotas_region ON questionnaire_quotas(region);

CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_parent_id ON locations(parent_id);

-- Insert initial data for Cyprus regions
INSERT INTO locations (id, name, type, code, latitude, longitude) VALUES
('a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890', 'Λευκωσία', 'region', '01', 35.1855659, 33.3822764),
('b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901', 'Λεμεσός', 'region', '02', 34.6753062, 33.0293005),
('c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012', 'Λάρνακα', 'region', '03', 34.9175971, 33.6339634),
('d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123', 'Πάφος', 'region', '04', 34.7766904, 32.4384267),
('e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234', 'Αμμόχωστος', 'region', '05', 35.1264407, 33.9463798);

-- Insert initial themes
INSERT INTO themes (id, name, description, category) VALUES
('f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345', 'Φυτική Παραγωγή', 'Ερωτηματολόγια σχετικά με καλλιέργειες, σπόρους, λιπάσματα', 'Crops'),
('a7b8c9d0-e1f2-4345-a7b8-c9d0e1f23456', 'Κτηνοτροφία', 'Ερωτηματολόγια για ζωικό κεφάλαιο και ζωική παραγωγή', 'Livestock'),
('b8c9d0e1-f2a3-4456-b8c9-d0e1f2a34567', 'Αλιεία', 'Ερωτηματολόγια για αλιευτικές δραστηριότητες', 'Fisheries'),
('c9d0e1f2-a3b4-4567-c9d0-e1f2a3b45678', 'Άρδευση', 'Ερωτηματολόγια για αρδευτικά συστήματα', 'Irrigation');

-- Create sample users
INSERT INTO users (id, email, first_name, last_name, role, organization) VALUES
('d0e1f2a3-b4c5-4678-d0e1-f2a3b4c56789', 'admin@agriculture.gov.cy', 'Διαχειριστής', 'Συστήματος', 'admin', 'Υπουργείο Γεωργίας'),
('f2a3b4c5-d6e7-4890-f2a3-b4c5d6e78901', 'user@agriculture.gov.cy', 'Χρήστης', 'Δοκιμών', 'analyst', 'Υπουργείο Γεωργίας'),
('a3b4c5d6-e7f8-4901-a3b4-c5d6e7f89012', 'farmer@email.com', 'Γιάννης', 'Παπαδόπουλος', 'farmer', 'Αγρότης');

-- Create sample questionnaire
INSERT INTO questionnaires (id, name, description, category, schema, target_responses, created_by) VALUES
('e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890', 
'Έρευνα Κτηνοτροφίας 2025', 
'Ετήσια έρευνα για την κατάσταση της κτηνοτροφίας στην Κύπρο', 
'Livestock',
'{
  "display": "form",
  "components": [
    {
      "type": "textfield",
      "key": "farmerName",
      "label": "Όνομα Αγρότη",
      "placeholder": "Εισάγετε όνομα",
      "validate": {"required": true}
    },
    {
      "type": "number",
      "key": "cattleCount",
      "label": "Αριθμός Βοοειδών",
      "validate": {"required": true}
    },
    {
      "type": "select",
      "key": "farmType",
      "label": "Τύπος Εκμετάλλευσης",
      "data": {
        "values": [
          {"label": "Γαλακτοπαραγωγός", "value": "dairy"},
          {"label": "Κρεοπαραγωγός", "value": "beef"},
          {"label": "Μικτός", "value": "mixed"}
        ]
      }
    }
  ]
}',
300,
'd0e1f2a3-b4c5-4678-d0e1-f2a3b4c56789');

-- Update questionnaire status to active
UPDATE questionnaires SET status = 'active', published_at = NOW() 
WHERE id = 'e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890';

-- Create some sample quotas
INSERT INTO questionnaire_quotas (questionnaire_id, region, target_count) VALUES
('e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890', 'Λευκωσία', 100),
('e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890', 'Λεμεσός', 80),
('e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890', 'Λάρνακα', 60),
('e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890', 'Πάφος', 50),
('e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890', 'Αμμόχωστος', 40);

-- Create additional sample questionnaires
INSERT INTO questionnaires (id, name, description, category, schema, target_responses, status, created_by, published_at) VALUES
('b4c5d6e7-f8a9-4012-b4c5-d6e7f8a90123', 
'Έρευνα Φυτικής Παραγωγής 2025', 
'Ετήσια έρευνα για καλλιέργειες και σπόρους', 
'Crops',
'{
  "display": "form",
  "components": [
    {
      "type": "textfield",
      "key": "farmName",
      "label": "Όνομα Αγροκτήματος",
      "validate": {"required": true}
    },
    {
      "type": "select",
      "key": "cropType",
      "label": "Κύριος Τύπος Καλλιέργειας",
      "data": {
        "values": [
          {"label": "Σιτηρά", "value": "cereals"},
          {"label": "Λαχανικά", "value": "vegetables"},
          {"label": "Φρούτα", "value": "fruits"},
          {"label": "Ελιές", "value": "olives"}
        ]
      }
    },
    {
      "type": "number",
      "key": "totalArea",
      "label": "Συνολική Έκταση (στρέμματα)",
      "validate": {"required": true}
    }
  ]
}',
250, 'active', 'd0e1f2a3-b4c5-4678-d0e1-f2a3b4c56789', NOW()),

('c5d6e7f8-a9b0-4123-c5d6-e7f8a9b01234', 
'Έρευνα Αρδευτικών Συστημάτων', 
'Καταγραφή αρδευτικών μεθόδων και υδατικών πόρων', 
'Irrigation',
'{
  "display": "form",
  "components": [
    {
      "type": "textfield",
      "key": "farmerName",
      "label": "Όνομα Αγρότη",
      "validate": {"required": true}
    },
    {
      "type": "select",
      "key": "irrigationType",
      "label": "Τύπος Άρδευσης",
      "data": {
        "values": [
          {"label": "Στάγδην", "value": "drip"},
          {"label": "Καταιονισμός", "value": "sprinkler"},
          {"label": "Πλημμύρα", "value": "flood"},
          {"label": "Μικροκαταιονισμός", "value": "micro_sprinkler"}
        ]
      }
    },
    {
      "type": "radio",
      "key": "waterSource",
      "label": "Πηγή Νερού",
      "values": [
        {"label": "Γεώτρηση", "value": "borehole"},
        {"label": "Δημόσιο Δίκτυο", "value": "public"},
        {"label": "Φράγμα/Λίμνη", "value": "reservoir"}
      ]
    }
  ]
}',
150, 'draft', 'd0e1f2a3-b4c5-4678-d0e1-f2a3b4c56789', NULL);

-- Create some sample responses
INSERT INTO questionnaire_responses (id, questionnaire_id, user_id, response_data, status, farm_name, region, municipality, started_at, submitted_at, completed_at) VALUES
('r1a2b3c4-d5e6-4f78-r1a2-b3c4d5e6f789', 
'e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890',
'a3b4c5d6-e7f8-4901-a3b4-c5d6e7f89012',
'{
  "farmerName": "Γιάννης Παπαδόπουλος",
  "cattleCount": 45,
  "farmType": "dairy"
}',
'completed', 
'Αγρόκτημα Παπαδόπουλου', 
'Λευκωσία', 
'Στρόβολος',
NOW() - INTERVAL ''5 days'',
NOW() - INTERVAL ''4 days'',
NOW() - INTERVAL ''4 days''),

('r2b3c4d5-e6f7-4890-r2b3-c4d5e6f78901', 
'e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890',
'f2a3b4c5-d6e7-4890-f2a3-b4c5d6e78901',
'{
  "farmerName": "Μαρία Γεωργίου",
  "cattleCount": 28,
  "farmType": "mixed"
}',
'submitted', 
'Κτήμα Γεωργίου', 
'Λεμεσός', 
'Λεμεσός',
NOW() - INTERVAL ''3 days'',
NOW() - INTERVAL ''2 days'',
NULL),

('r3c4d5e6-f7a8-4901-r3c4-d5e6f7a89012', 
'b4c5d6e7-f8a9-4012-b4c5-d6e7f8a90123',
'a3b4c5d6-e7f8-4901-a3b4-c5d6e7f89012',
'{
  "farmName": "Αγροτική Μονάδα Χριστοδούλου",
  "cropType": "vegetables",
  "totalArea": 120
}',
'completed', 
'Αγροτική Μονάδα Χριστοδούλου', 
'Λάρνακα', 
'Λάρνακα',
NOW() - INTERVAL ''1 day'',
NOW() - INTERVAL ''6 hours'',
NOW() - INTERVAL ''6 hours'');

-- Update questionnaire response counts
UPDATE questionnaires SET current_responses = 2 WHERE id = 'e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890';
UPDATE questionnaires SET current_responses = 1 WHERE id = 'b4c5d6e7-f8a9-4012-b4c5-d6e7f8a90123';

-- Create some invitations
INSERT INTO questionnaire_invitations (questionnaire_id, user_id, email, status, sent_at, expires_at) VALUES
('e1f2a3b4-c5d6-4789-e1f2-a3b4c5d67890', 'a3b4c5d6-e7f8-4901-a3b4-c5d6e7f89012', 'farmer@email.com', 'accepted', NOW() - INTERVAL ''5 days'', NOW() + INTERVAL ''25 days''),
('b4c5d6e7-f8a9-4012-b4c5-d6e7f8a90123', 'a3b4c5d6-e7f8-4901-a3b4-c5d6e7f89012', 'farmer@email.com', 'pending', NOW() - INTERVAL ''2 days'', NOW() + INTERVAL ''28 days'');

-- Create views for reporting
CREATE OR REPLACE VIEW questionnaire_summary AS
SELECT 
    q.id,
    q.name,
    q.category,
    q.status,
    q.target_responses,
    q.current_responses,
    ROUND((q.current_responses::decimal / NULLIF(q.target_responses, 0)) * 100, 2) as completion_percentage,
    u.first_name || ' ' || u.last_name as created_by_name,
    q.created_at,
    q.published_at
FROM questionnaires q
JOIN users u ON q.created_by = u.id;

CREATE OR REPLACE VIEW response_summary_by_region AS
SELECT 
    q.id as questionnaire_id,
    q.name as questionnaire_name,
    qr.region,
    COUNT(*) as response_count,
    COUNT(CASE WHEN qr.status = 'completed' THEN 1 END) as completed_count
FROM questionnaires q
LEFT JOIN questionnaire_responses qr ON q.id = qr.questionnaire_id
WHERE qr.region IS NOT NULL
GROUP BY q.id, q.name, qr.region;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyprus_agriculture_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cyprus_agriculture_app;

COMMIT;