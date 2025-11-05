-- Migration: Drop and Recreate Quota Tables with lowercase names
-- Date: 2025-11-05

-- Drop existing tables
DROP TABLE IF EXISTS "QuotaResponses" CASCADE;
DROP TABLE IF EXISTS "Quotas" CASCADE;
DROP TABLE IF EXISTS "QuotaVariables" CASCADE;

-- Create quotavariables table (lowercase)
CREATE TABLE quotavariables (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) NOT NULL,
    displayname character varying(200) NOT NULL,
    description text,
    variabletype character varying(50) NOT NULL,
    datatype character varying(50) NOT NULL,
    possiblevalues jsonb NOT NULL DEFAULT '[]'::jsonb,
    isactive boolean NOT NULL DEFAULT true,
    sortorder integer NOT NULL DEFAULT 0,
    createdat timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp with time zone,
    CONSTRAINT pk_quotavariables PRIMARY KEY (id)
);

-- Create quotas table (lowercase)
CREATE TABLE quotas (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(200) NOT NULL,
    description text,
    questionnaireid uuid NOT NULL,
    criteria jsonb NOT NULL DEFAULT '{}'::jsonb,
    targetcount integer NOT NULL,
    isactive boolean NOT NULL DEFAULT true,
    autostop boolean NOT NULL DEFAULT true,
    priority integer NOT NULL DEFAULT 0,
    createdat timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp with time zone,
    createdby character varying(100) NOT NULL,
    updatedby character varying(100),
    CONSTRAINT pk_quotas PRIMARY KEY (id)
);

-- Create quotaresponses table (lowercase)
CREATE TABLE quotaresponses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    quotaid uuid NOT NULL,
    participantid character varying(100) NOT NULL,
    status character varying(50) NOT NULL,
    allocationdate timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    startdate timestamp with time zone,
    completiondate timestamp with time zone,
    responseid uuid,
    metadata jsonb,
    allocatedby character varying(100) NOT NULL,
    allocationmethod character varying(50) NOT NULL DEFAULT 'manual',
    CONSTRAINT pk_quotaresponses PRIMARY KEY (id),
    CONSTRAINT fk_quotaresponses_quotas_quotaid FOREIGN KEY (quotaid) 
        REFERENCES quotas (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE UNIQUE INDEX ix_quotavariables_name ON quotavariables (name);
CREATE INDEX ix_quotavariables_isactive ON quotavariables (isactive);
CREATE INDEX ix_quotavariables_variabletype ON quotavariables (variabletype);

CREATE INDEX ix_quotas_questionnaireid ON quotas (questionnaireid);
CREATE INDEX ix_quotas_isactive ON quotas (isactive);

CREATE INDEX ix_quotaresponses_quotaid ON quotaresponses (quotaid);
CREATE INDEX ix_quotaresponses_status ON quotaresponses (status);

-- Insert sample quota variables
INSERT INTO quotavariables (id, name, displayname, description, variabletype, datatype, possiblevalues, isactive, sortorder) VALUES 
(gen_random_uuid(), 'farm_size', 'Μέγεθος Εκμετάλλευσης', 'Κατηγοριοποίηση με βάση το μέγεθος της γεωργικής εκμετάλλευσης', 'categorical', 'string', 
 '[
    {"value": "small", "label": "Μικρή (<5 στρέμματα)", "description": "Εκμεταλλεύσεις μικρότερες από 5 στρέμματα", "isActive": true},
    {"value": "medium", "label": "Μεσαία (5-20 στρέμματα)", "description": "Εκμεταλλεύσεις 5-20 στρεμμάτων", "isActive": true},
    {"value": "large", "label": "Μεγάλη (>20 στρέμματα)", "description": "Εκμεταλλεύσεις μεγαλύτερες από 20 στρέμματα", "isActive": true}
 ]'::jsonb, true, 1),

(gen_random_uuid(), 'region', 'Περιοχή', 'Γεωγραφική περιοχή της εκμετάλλευσης', 'categorical', 'string', 
 '[
    {"value": "nicosia", "label": "Λευκωσία", "description": "Επαρχία Λευκωσίας", "isActive": true},
    {"value": "limassol", "label": "Λεμεσός", "description": "Επαρχία Λεμεσού", "isActive": true},
    {"value": "larnaca", "label": "Λάρνακα", "description": "Επαρχία Λάρνακας", "isActive": true},
    {"value": "paphos", "label": "Πάφος", "description": "Επαρχία Πάφου", "isActive": true},
    {"value": "famagusta", "label": "Αμμόχωστος", "description": "Επαρχία Αμμοχώστου", "isActive": true},
    {"value": "kyrenia", "label": "Κερύνεια", "description": "Επαρχία Κερύνειας", "isActive": true}
 ]'::jsonb, true, 2),

(gen_random_uuid(), 'crop_type', 'Τύπος Καλλιέργειας', 'Κύριος τύπος καλλιέργειας', 'categorical', 'string', 
 '[
    {"value": "olive", "label": "Ελαιόδεντρα", "description": "Καλλιέργεια ελαιοδέντρων", "isActive": true},
    {"value": "citrus", "label": "Εσπεριδοειδή", "description": "Καλλιέργεια εσπεριδοειδών", "isActive": true},
    {"value": "grapes", "label": "Αμπέλια", "description": "Καλλιέργεια αμπελιών", "isActive": true},
    {"value": "vegetables", "label": "Λαχανικά", "description": "Καλλιέργεια λαχανικών", "isActive": true},
    {"value": "cereals", "label": "Δημητριακά", "description": "Καλλιέργεια δημητριακών", "isActive": true},
    {"value": "other", "label": "Άλλο", "description": "Άλλοι τύποι καλλιέργειας", "isActive": true}
 ]'::jsonb, true, 3),

(gen_random_uuid(), 'irrigation_method', 'Μέθοδος Άρδευσης', 'Κύρια μέθοδος άρδευσης της εκμετάλλευσης', 'categorical', 'string', 
 '[
    {"value": "drip", "label": "Στάγδην", "description": "Σύστημα άρδευσης σταγόνας", "isActive": true},
    {"value": "sprinkler", "label": "Καταιονισμός", "description": "Σύστημα καταιονισμού", "isActive": true},
    {"value": "flood", "label": "Κατάκλυση", "description": "Άρδευση με κατάκλυση", "isActive": true},
    {"value": "none", "label": "Χωρίς άρδευση", "description": "Βροχοποτισμένες καλλιέργειες", "isActive": true}
 ]'::jsonb, true, 4),

(gen_random_uuid(), 'farm_age', 'Ηλικία Εκμετάλλευσης', 'Ηλικία του κατόχου της εκμετάλλευσης', 'categorical', 'string', 
 '[
    {"value": "young", "label": "Νέος Αγρότης (<35 ετών)", "description": "Αγρότες κάτω των 35 ετών", "isActive": true},
    {"value": "middle", "label": "Μεσήλικας (35-55 ετών)", "description": "Αγρότες 35-55 ετών", "isActive": true},
    {"value": "senior", "label": "Έμπειρος (>55 ετών)", "description": "Αγρότες άνω των 55 ετών", "isActive": true}
 ]'::jsonb, true, 5),

(gen_random_uuid(), 'organic_farming', 'Βιολογική Γεωργία', 'Εφαρμογή βιολογικών μεθόδων καλλιέργειας', 'categorical', 'boolean', 
 '[
    {"value": "true", "label": "Ναι", "description": "Εφαρμόζει βιολογικές μεθόδους", "isActive": true},
    {"value": "false", "label": "Όχι", "description": "Δεν εφαρμόζει βιολογικές μεθόδους", "isActive": true}
 ]'::jsonb, true, 6);

-- Insert a sample quota
INSERT INTO quotas (id, name, description, questionnaireid, criteria, targetcount, isactive, autostop, priority, createdby) VALUES 
(gen_random_uuid(), 'Μικρές Ελαιοπαραγωγικές Εκμεταλλεύσεις Λευκωσίας', 
 'Στόχος 50 ερωτηματολογίων από μικρές ελαιοπαραγωγικές εκμεταλλεύσεις στην επαρχία Λευκωσίας', 
 gen_random_uuid(), -- Temporary UUID until we have real questionnaires
 '{
    "criteria": [
        {
            "variableName": "farm_size",
            "displayName": "Μέγεθος Εκμετάλλευσης",
            "operator": "equals",
            "values": ["small"],
            "variableType": "categorical"
        },
        {
            "variableName": "region",
            "displayName": "Περιοχή",
            "operator": "equals",
            "values": ["nicosia"],
            "variableType": "categorical"
        },
        {
            "variableName": "crop_type",
            "displayName": "Τύπος Καλλιέργειας",
            "operator": "equals",
            "values": ["olive"],
            "variableType": "categorical"
        }
    ],
    "logic": "AND"
 }'::jsonb, 
 50, true, true, 1, 'system-admin');

COMMIT;