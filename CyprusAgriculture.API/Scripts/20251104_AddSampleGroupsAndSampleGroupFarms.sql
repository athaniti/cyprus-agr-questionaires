-- Migration to create sample_groups and sample_group_farms tables

-- Create sample_groups table
CREATE TABLE sample_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID NOT NULL REFERENCES samples(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    criteria TEXT, -- JSON string with filtering criteria
    interviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes for sample_groups
CREATE INDEX idx_sample_groups_sample_id ON sample_groups(sample_id);
CREATE INDEX idx_sample_groups_interviewer_id ON sample_groups(interviewer_id);
CREATE INDEX idx_sample_groups_is_active ON sample_groups(is_active);

-- Create sample_group_farms table
CREATE TABLE sample_group_farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_group_id UUID NOT NULL REFERENCES sample_groups(id) ON DELETE CASCADE,
    farm_id TEXT NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'assigned',
    notes VARCHAR(1000),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium'
);

-- Create indexes for sample_group_farms
CREATE UNIQUE INDEX idx_sample_group_farms_group_farm ON sample_group_farms(sample_group_id, farm_id);
CREATE INDEX idx_sample_group_farms_farm_id ON sample_group_farms(farm_id);
CREATE INDEX idx_sample_group_farms_status ON sample_group_farms(status);
CREATE INDEX idx_sample_group_farms_priority ON sample_group_farms(priority);

-- Add comments
COMMENT ON TABLE sample_groups IS 'Groups of farms within a sample, assigned to specific interviewers';
COMMENT ON TABLE sample_group_farms IS 'Assignment of individual farms to sample groups';
COMMENT ON COLUMN sample_groups.criteria IS 'JSON string containing filtering criteria for the group';
COMMENT ON COLUMN sample_group_farms.status IS 'Status: assigned, in_progress, completed, cancelled';
COMMENT ON COLUMN sample_group_farms.priority IS 'Priority: high, medium, low';