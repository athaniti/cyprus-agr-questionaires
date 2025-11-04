-- Create form_schemas table
CREATE TABLE IF NOT EXISTS form_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    schema_json JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID REFERENCES users(id) ON DELETE RESTRICT
);

-- Create form_responses table
CREATE TABLE IF NOT EXISTS form_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id TEXT NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    form_schema_id UUID REFERENCES form_schemas(id) ON DELETE SET NULL,
    response_data JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    completion_percentage DECIMAL NOT NULL DEFAULT 0,
    interviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    interview_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID REFERENCES users(id) ON DELETE RESTRICT
);

-- Create submission_status table
CREATE TABLE IF NOT EXISTS submission_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id TEXT NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    sample_group_id UUID REFERENCES sample_groups(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'assigned',
    assigned_interviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    completion_percentage DECIMAL NOT NULL DEFAULT 0,
    assigned_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    deadline TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    attempts INTEGER NOT NULL DEFAULT 0,
    last_contact_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for form_schemas
CREATE INDEX IF NOT EXISTS ix_form_schemas_questionnaire_id ON form_schemas(questionnaire_id);
CREATE UNIQUE INDEX IF NOT EXISTS ix_form_schemas_questionnaire_id_version ON form_schemas(questionnaire_id, version);

-- Create indexes for form_responses
CREATE INDEX IF NOT EXISTS ix_form_responses_farm_id ON form_responses(farm_id);
CREATE INDEX IF NOT EXISTS ix_form_responses_questionnaire_id ON form_responses(questionnaire_id);
CREATE INDEX IF NOT EXISTS ix_form_responses_status ON form_responses(status);
CREATE UNIQUE INDEX IF NOT EXISTS ix_form_responses_farm_id_questionnaire_id ON form_responses(farm_id, questionnaire_id);

-- Create indexes for submission_status
CREATE INDEX IF NOT EXISTS ix_submission_status_farm_id ON submission_status(farm_id);
CREATE INDEX IF NOT EXISTS ix_submission_status_questionnaire_id ON submission_status(questionnaire_id);
CREATE INDEX IF NOT EXISTS ix_submission_status_status ON submission_status(status);
CREATE INDEX IF NOT EXISTS ix_submission_status_assigned_interviewer_id ON submission_status(assigned_interviewer_id);
CREATE UNIQUE INDEX IF NOT EXISTS ix_submission_status_farm_id_questionnaire_id ON submission_status(farm_id, questionnaire_id);

-- Confirmation message
SELECT 'FormResponse tables created successfully!' as result;