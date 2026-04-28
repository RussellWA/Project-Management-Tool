CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

CREATE POLICY "Users can view their assigned projects"
ON projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_members.project_id = projects.id
    AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Only PMs can update project details"
ON projects FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_members.project_id = projects.id
    AND project_members.user_id = auth.uid()
    AND project_members.role = 'PM'
  )
);

CREATE POLICY "Only PMs can delete projects"
ON projects FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_members.project_id = projects.id
    AND project_members.user_id = auth.uid()
    AND project_members.role = 'PM'
  )
);

CREATE OR REPLACE FUNCTION public.handle_new_project_pm()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.project_members (project_id, user_id, role)
  VALUES (new.id, new.created_by, 'PM');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_project_pm();

CREATE POLICY "Logged in users can create projects"
ON projects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- SECURITY DEFINER means this function ignores RLS. It will strictly 
-- check the table, get a true/false, and return it without triggering loops.
CREATE OR REPLACE FUNCTION public.is_pm(check_project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = check_project_id
    AND user_id = auth.uid()
    AND role = 'PM'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Users can view their assigned projects"
ON projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = id
    AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Logged in users can create projects"
ON projects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only PMs can update project details"
ON projects FOR UPDATE
USING (public.is_pm(id));

CREATE POLICY "Only PMs can delete projects"
ON projects FOR DELETE
USING (public.is_pm(id));