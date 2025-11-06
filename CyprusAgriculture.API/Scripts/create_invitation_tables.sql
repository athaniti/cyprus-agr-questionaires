-- Script για δημιουργία tables διαχείρισης προσκλήσεων
-- Cyprus Agriculture Questionnaires System

-- ==============================================
-- INVITATION TEMPLATES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS invitation_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    questionnaire_id UUID NOT NULL,
    
    -- Email template content
    subject VARCHAR(300) NOT NULL,
    html_content TEXT NOT NULL,
    plain_text_content TEXT,
    
    -- Logo settings
    logo_url VARCHAR(500),
    logo_position VARCHAR(20) DEFAULT 'center' CHECK (logo_position IN ('left', 'center', 'right')),
    
    -- Font settings
    body_font_family VARCHAR(100) DEFAULT 'Arial, sans-serif',
    body_font_size INTEGER DEFAULT 14,
    header_font_family VARCHAR(100) DEFAULT 'Arial, sans-serif',
    header_font_size INTEGER DEFAULT 18,
    
    -- Template variables (JSON array)
    available_variables TEXT, -- JSON array of variable names
    
    -- Audit fields
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign key constraints
    CONSTRAINT fk_invitation_templates_questionnaire_id 
        FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
    CONSTRAINT fk_invitation_templates_created_by 
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- ==============================================
-- INVITATION BATCHES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS invitation_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    template_id UUID NOT NULL,
    questionnaire_id UUID NOT NULL,
    
    -- Scheduling
    scheduled_send_time TIMESTAMP WITH TIME ZONE,
    immediate_send BOOLEAN DEFAULT false,
    
    -- Status
    status INTEGER DEFAULT 0, -- 0=Draft, 1=Scheduled, 2=Sending, 3=Sent, 4=Failed, 5=Cancelled
    
    -- Statistics
    total_invitations INTEGER DEFAULT 0,
    delivered_invitations INTEGER DEFAULT 0,
    failed_invitations INTEGER DEFAULT 0,
    opened_invitations INTEGER DEFAULT 0,
    clicked_invitations INTEGER DEFAULT 0,
    started_responses INTEGER DEFAULT 0,
    completed_responses INTEGER DEFAULT 0,
    
    -- Recipients (JSON array of email addresses)
    recipients TEXT DEFAULT '[]',
    
    -- Audit fields
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign key constraints
    CONSTRAINT fk_invitation_batches_template_id 
        FOREIGN KEY (template_id) REFERENCES invitation_templates(id) ON DELETE RESTRICT,
    CONSTRAINT fk_invitation_batches_questionnaire_id 
        FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
    CONSTRAINT fk_invitation_batches_created_by 
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- ==============================================
-- INVITATIONS TABLE (επικαιροποίηση του υπάρχοντος)
-- ==============================================

-- Προσθέτουμε νέες στήλες στο υπάρχον invitations table
DO $$
BEGIN
    -- Προσθήκη στήλης batch_id αν δεν υπάρχει
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'batch_id') THEN
        ALTER TABLE invitations ADD COLUMN batch_id UUID;
        ALTER TABLE invitations ADD CONSTRAINT fk_invitations_batch_id 
            FOREIGN KEY (batch_id) REFERENCES invitation_batches(id) ON DELETE SET NULL;
    END IF;
    
    -- Προσθήκη στήλης recipient_name αν δεν υπάρχει
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'recipient_name') THEN
        ALTER TABLE invitations ADD COLUMN recipient_name VARCHAR(200);
    END IF;
    
    -- Προσθήκη στήλης token αν δεν υπάρχει
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'token') THEN
        ALTER TABLE invitations ADD COLUMN token VARCHAR(100) UNIQUE;
    END IF;
    
    -- Προσθήκη στηλών για enhanced status tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'status_enum') THEN
        ALTER TABLE invitations ADD COLUMN status_enum INTEGER DEFAULT 0; -- 0=Draft, 1=Scheduled, 2=Sent, 3=Delivered, 4=Failed, 5=Opened, 6=Clicked, 7=Started, 8=Completed
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'delivery_status_enum') THEN
        ALTER TABLE invitations ADD COLUMN delivery_status_enum INTEGER DEFAULT 0; -- 0=Pending, 1=Delivered, 2=Failed, 3=Bounced
    END IF;
    
    -- Προσθήκη στηλών για tracking timestamps
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'sent_at') THEN
        ALTER TABLE invitations ADD COLUMN sent_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'delivered_at') THEN
        ALTER TABLE invitations ADD COLUMN delivered_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'opened_at') THEN
        ALTER TABLE invitations ADD COLUMN opened_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'clicked_at') THEN
        ALTER TABLE invitations ADD COLUMN clicked_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'started_at') THEN
        ALTER TABLE invitations ADD COLUMN started_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'completed_at') THEN
        ALTER TABLE invitations ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Προσθήκη στήλης για delivery errors
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'delivery_error') THEN
        ALTER TABLE invitations ADD COLUMN delivery_error VARCHAR(1000);
    END IF;
    
    -- Προσθήκη στήλης για personalization data
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitations' AND column_name = 'personalization_data') THEN
        ALTER TABLE invitations ADD COLUMN personalization_data TEXT; -- JSON object
    END IF;
    
    -- Μετονομασία στήλης recipient_email αν χρειάζεται
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'invitations' AND column_name = 'email') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'invitations' AND column_name = 'recipient_email') THEN
        ALTER TABLE invitations RENAME COLUMN email TO recipient_email;
    END IF;
    
END $$;

-- ==============================================
-- INDEXES
-- ==============================================

-- Indexes για invitation_templates
CREATE INDEX IF NOT EXISTS idx_invitation_templates_questionnaire_id 
    ON invitation_templates(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_invitation_templates_created_by 
    ON invitation_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_invitation_templates_created_at 
    ON invitation_templates(created_at);

-- Indexes για invitation_batches
CREATE INDEX IF NOT EXISTS idx_invitation_batches_template_id 
    ON invitation_batches(template_id);
CREATE INDEX IF NOT EXISTS idx_invitation_batches_questionnaire_id 
    ON invitation_batches(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_invitation_batches_status 
    ON invitation_batches(status);
CREATE INDEX IF NOT EXISTS idx_invitation_batches_created_by 
    ON invitation_batches(created_by);
CREATE INDEX IF NOT EXISTS idx_invitation_batches_created_at 
    ON invitation_batches(created_at);

-- Indexes για invitations (νέες στήλες)
CREATE INDEX IF NOT EXISTS idx_invitations_batch_id 
    ON invitations(batch_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token 
    ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status_enum 
    ON invitations(status_enum);
CREATE INDEX IF NOT EXISTS idx_invitations_delivery_status_enum 
    ON invitations(delivery_status_enum);

-- ==============================================
-- SAMPLE DATA (optional)
-- ==============================================

-- Δημιουργία sample template (μόνο αν δεν υπάρχει ήδη)
DO $$
DECLARE
    sample_questionnaire_id UUID;
    sample_user_id UUID;
BEGIN
    -- Παίρνουμε το πρώτο ερωτηματολόγιο που υπάρχει
    SELECT id INTO sample_questionnaire_id FROM questionnaires LIMIT 1;
    
    -- Παίρνουμε τον πρώτο χρήστη που υπάρχει
    SELECT id INTO sample_user_id FROM users LIMIT 1;
    
    -- Αν υπάρχουν ερωτηματολόγια και χρήστες, δημιουργούμε ένα sample template
    IF sample_questionnaire_id IS NOT NULL AND sample_user_id IS NOT NULL THEN
        INSERT INTO invitation_templates (
            name, 
            questionnaire_id, 
            subject, 
            html_content, 
            plain_text_content,
            available_variables,
            created_by
        ) 
        SELECT 
            'Βασικό Πρότυπο Πρόσκλησης',
            sample_questionnaire_id,
            'Πρόσκληση συμμετοχής στην έρευνα: {{questionnaire_title}}',
            '<html><body>
                <h2>Αγαπητέ/ή {{name}},</h2>
                <p>Σας προσκαλούμε να συμμετάσχετε στην έρευνα <strong>{{questionnaire_title}}</strong>.</p>
                <p>Για να ξεκινήσετε, κάντε κλικ στον παρακάτω σύνδεσμο:</p>
                <p><a href="{{survey_link}}" style="background-color: #004B87; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ξεκινήστε την Έρευνα</a></p>
                <p>Σας ευχαριστούμε εκ των προτέρων για τη συμμετοχή σας.</p>
                <p>Με εκτίμηση,<br>Υπουργείο Γεωργίας Κύπρου</p>
            </body></html>',
            'Αγαπητέ/ή {{name}},
            
Σας προσκαλούμε να συμμετάσχετε στην έρευνα {{questionnaire_title}}.

Σύνδεσμος έρευνας: {{survey_link}}

Σας ευχαριστούμε εκ των προτέρων για τη συμμετοχή σας.

Με εκτίμηση,
Υπουργείο Γεωργίας Κύπρου',
            '["{{name}}", "{{email}}", "{{questionnaire_title}}", "{{survey_link}}"]',
            sample_user_id
        WHERE NOT EXISTS (
            SELECT 1 FROM invitation_templates 
            WHERE name = 'Βασικό Πρότυπο Πρόσκλησης'
        );
    END IF;
END $$;

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Έλεγχος δημιουργίας tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('invitation_templates', 'invitation_batches', 'invitations')
ORDER BY tablename;

-- Έλεγχος στηλών του invitations table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'invitations'
ORDER BY ordinal_position;

-- Έλεγχος sample data
SELECT 
    'Templates' as table_name,
    COUNT(*) as count
FROM invitation_templates
UNION ALL
SELECT 
    'Batches' as table_name,
    COUNT(*) as count
FROM invitation_batches;

COMMIT;