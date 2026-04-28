CREATE TABLE milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    current_phase project_phase DEFAULT 'PLANNING',
    progress INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
