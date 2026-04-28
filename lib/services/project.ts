import { Project } from "../mockData";
import { supabase } from "../supabase";


export const projectService = {
    async getAll(): Promise<{data: Project[] | null; error: any}> {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false })

        return { data, error }
    },
    
    async create(name: string, client: string): Promise<{data: Project | null; error: any}> {
        const { data, error } = await supabase
            .from('projects')
            .insert([{ name, client }])
            .select()
            .single();

        return { data , error }
    }
}