CREATE TABLE project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role access_level NOT NULL DEFAULT 'MEMBER',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id) 
);

CREATE POLICY "Enable read for authenticated users"
ON project_members FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
ON project_members FOR INSERT
WITH CHECK (auth.role() = 'authenticated')

CREATE POLICY "Enable update for PMs"
ON project_members FOR UPDATE
USING (public.is_pm(project_id));

CREATE POLICY "Enable delete for PMs"
ON project_members FOR DELETE
USING (public.is_pm(project_id));