-- Create FormIO Integration Tables
-- This script creates all the necessary tables for FormIO response system

-- Create form_schemas table
CREATE TABLE IF NOT EXISTS form_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    schema JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID
);

-- Create submission_statuses table  
CREATE TABLE IF NOT EXISTS submission_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default submission statuses
INSERT INTO submission_statuses (name, description) VALUES
('draft', 'Response is in draft state'),
('in_progress', 'Response is being filled out'),
('submitted', 'Response has been submitted'),
('completed', 'Response has been reviewed and completed'),
('rejected', 'Response was rejected and needs revision')
ON CONFLICT (name) DO NOTHING;

-- Create form_responses table
CREATE TABLE IF NOT EXISTS form_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id TEXT NOT NULL,
    questionnaire_id UUID NOT NULL,
    form_schema_id UUID,
    response_data JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    interviewer_id UUID,
    interview_date TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    submitted_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_form_responses_farm FOREIGN KEY (farm_id) REFERENCES farms(id),
    CONSTRAINT fk_form_responses_questionnaire FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id),
    CONSTRAINT fk_form_responses_schema FOREIGN KEY (form_schema_id) REFERENCES form_schemas(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_form_schemas_questionnaire_id ON form_schemas(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_form_schemas_active ON form_schemas(is_active);

CREATE INDEX IF NOT EXISTS idx_form_responses_farm_id ON form_responses(farm_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_questionnaire_id ON form_responses(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_status ON form_responses(status);
CREATE INDEX IF NOT EXISTS idx_form_responses_submitted_at ON form_responses(submitted_at);

-- Verify tables were created
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