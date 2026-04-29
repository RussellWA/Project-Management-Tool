"use server"

import { Project } from "../mockData";
import { createSupabaseServerClient } from "../supabase/server";

export async function getAllProjects(): Promise<{data: Project[] | null, error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("projects")
        .select(`*, milestones (*)`)
        .order("created_at", { ascending: false })


    return { data, error: error ? error.message : null}
}

export async function createProject(name: string, client: string): Promise<{error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("projects")
        .insert([{ name, client }])

    return { error: error ? error.message : null }
}

export async function getProject(id: string): Promise<{data: Project | null, error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("projects")
        .select(`*, milestones (*)`)
        .eq("id", id)
        .single()


    return { data, error: error ? error.message : null}
}