CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,           -- e.g., "Warteg Logo Assets"
    url TEXT NOT NULL,            -- The actual link or storage path
    type TEXT,                    -- e.g., 'link', 'pdf', 'image'
    
    -- The Hierarchy (Make them all nullable so the doc can attach anywhere)
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. READ: Only people assigned to the project can see its documents
CREATE POLICY "Roster can view documents" 
ON documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = documents.project_id
    AND project_members.user_id = auth.uid()
  )
);

-- 3. INSERT: Must be on the project, AND must upload under your own ID
CREATE POLICY "Roster can upload documents" 
ON documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.user_id = auth.uid()
  )
  AND auth.uid() = uploaded_by -- Prevents forging who uploaded it!
);

-- 4. DELETE: Only the original uploader OR a PM can delete it
CREATE POLICY "Uploader or PM can delete" 
ON documents FOR DELETE
USING (
  auth.uid() = uploaded_by OR public.is_pm(project_id)
);