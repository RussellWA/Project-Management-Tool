"use server"

import { Milestone } from "@/types/milestone"
import { createSupabaseServerClient } from "../supabase/server"

export async function createMilestone(id: string, name: string): Promise<{error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("milestones")
        .insert([{ 
            project_id: id,
            name: name,
            progress: 0,
        }])

    return { error: error ? error.message : null }
}

export async function getMilestone(id: string): Promise<{data: Milestone | null, error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("milestones")
        .select(`*, task (*)`)
        .eq("id", id)
        .single()

    return { data, error: error ? error.message : null}
}