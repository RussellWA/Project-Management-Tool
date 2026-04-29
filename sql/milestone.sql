CREATE TABLE milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    current_phase project_phase DEFAULT 'PLANNING',
    progress INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE POLICY "Users can view project milestones"
ON milestones FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM project_members pm
    WHERE pm.project_id = milestones.project_id
    AND pm.user_id = auth.uid()
  )
);

CREATE POLICY "Only PMs can create milestones"
ON milestones FOR INSERT
WITH CHECK (
  public.is_pm(project_id)
);

CREATE POLICY "Only PMs can update milestones"
ON milestones FOR UPDATE
USING (
  public.is_pm(project_id)
);

CREATE POLICY "Only PMs can delete milestones"
ON milestones FOR DELETE
USING (
  public.is_pm(project_id)
);