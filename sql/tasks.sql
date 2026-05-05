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

CREATE TYPE task_category AS ENUM ('DEV', 'ART', 'SOUND', 'DESIGN');
ALTER TABLE public.tasks ADD COLUMN category task_category;

CREATE POLICY "Team members can view tasks" 
ON public.tasks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = tasks.project_id
    AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = tasks.project_id
    AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can update tasks" 
ON public.tasks 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = tasks.project_id
    AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Only PMs can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = tasks.project_id
    AND project_members.user_id = auth.uid()
    AND project_members.role = 'PM' -- Or whatever exact string you use for the PM role
  )
);