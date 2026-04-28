CREATE TABLE project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role access_level NOT NULL DEFAULT 'MEMBER',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id) 
);

-- 🚪 PROJECT MEMBERS POLICIES
-- Read: Anyone logged in can see who is on the roster
CREATE POLICY "Members - Read" ON project_members FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Insert/Update/Delete: Only existing PMs can modify the roster
-- Note: Your initial PM assignment works because the Trigger bypasses these!
CREATE POLICY "Members - Insert" ON project_members FOR INSERT
WITH CHECK (public.is_pm(project_id));

CREATE POLICY "Members - Update" ON project_members FOR UPDATE
USING (public.is_pm(project_id));

CREATE POLICY "Members - Delete" ON project_members FOR DELETE
USING (public.is_pm(project_id));