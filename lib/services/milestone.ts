"use server"

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