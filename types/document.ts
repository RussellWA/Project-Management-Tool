
export interface Document {
    id: string
    name: string;
    url: string;
    type: string;
    project_id: string;
    milestone_id: string | null;
    task_id: string | null;
    uploaded_by: string;
}