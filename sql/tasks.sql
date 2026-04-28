CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
  status task_status DEFAULT 'TODO',
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Links to Supabase Auth
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);