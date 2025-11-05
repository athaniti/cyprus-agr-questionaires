-- Migration: Add Quota Tables
-- Date: 2025-11-05

-- Create QuotaVariables table
CREATE TABLE "QuotaVariables" (
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "Name" character varying(100) NOT NULL,
    "DisplayName" character varying(200) NOT NULL,
    "Description" text,
    "VariableType" character varying(50) NOT NULL,
    "DataType" character varying(50) NOT NULL,
    "PossibleValues" jsonb NOT NULL DEFAULT '[]'::jsonb,
    "IsActive" boolean NOT NULL DEFAULT true,
    "SortOrder" integer NOT NULL DEFAULT 0,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_QuotaVariables" PRIMARY KEY ("Id")
);

-- Create Quotas table (without foreign key constraint for now)
CREATE TABLE "Quotas" (
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "Name" character varying(200) NOT NULL,
    "Description" text,
    "QuestionnaireId" uuid NOT NULL,
    "Criteria" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "TargetCount" integer NOT NULL,
    "IsActive" boolean NOT NULL DEFAULT true,
    "AutoStop" boolean NOT NULL DEFAULT true,
    "Priority" integer NOT NULL DEFAULT 0,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone,
    "CreatedBy" character varying(100) NOT NULL,
    "UpdatedBy" character varying(100),
    CONSTRAINT "PK_Quotas" PRIMARY KEY ("Id")
);

-- Create QuotaResponses table
CREATE TABLE "QuotaResponses" (
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "QuotaId" uuid NOT NULL,
    "ParticipantId" character varying(100) NOT NULL,
    "Status" character varying(50) NOT NULL,
    "AllocationDate" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "StartDate" timestamp with time zone,
    "CompletionDate" timestamp with time zone,
    "ResponseId" uuid,
    "Metadata" jsonb,
    "AllocatedBy" character varying(100) NOT NULL,
    "AllocationMethod" character varying(50) NOT NULL DEFAULT 'manual',
    CONSTRAINT "PK_QuotaResponses" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_QuotaResponses_Quotas_QuotaId" FOREIGN KEY ("QuotaId") 
        REFERENCES "Quotas" ("Id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE UNIQUE INDEX "IX_QuotaVariables_Name" ON "QuotaVariables" ("Name");
CREATE INDEX "IX_QuotaVariables_IsActive" ON "QuotaVariables" ("IsActive");

CREATE INDEX "IX_Quotas_QuestionnaireId" ON "Quotas" ("QuestionnaireId");
CREATE INDEX "IX_Quotas_IsActive" ON "Quotas" ("IsActive");
CREATE INDEX "IX_Quotas_Priority" ON "Quotas" ("Priority");

CREATE INDEX "IX_QuotaResponses_QuotaId" ON "QuotaResponses" ("QuotaId");
CREATE INDEX "IX_QuotaResponses_ParticipantId" ON "QuotaResponses" ("ParticipantId");
CREATE INDEX "IX_QuotaResponses_Status" ON "QuotaResponses" ("Status");
CREATE INDEX "IX_QuotaResponses_AllocationDate" ON "QuotaResponses" ("AllocationDate");

-- Insert sample quota variables
INSERT INTO "QuotaVariables" ("Id", "Name", "DisplayName", "Description", "VariableType", "DataType", "PossibleValues", "IsActive", "SortOrder") VALUES 
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
INSERT INTO "Quotas" ("Id", "Name", "Description", "QuestionnaireId", "Criteria", "TargetCount", "IsActive", "AutoStop", "Priority", "CreatedBy") VALUES 
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