"use server"

import { createSupabaseServerClient } from "../supabase/server";

export async function getAllProjects() {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })


    return { data, error: error ? error.message : null}
}

export async function createProject(name: string, client: string) {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("projects")
        .insert([{ name, client }])

    return { error: error ? error.message : null }
}