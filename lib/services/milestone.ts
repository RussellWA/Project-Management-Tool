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

    // const { data, error } = await supabase
    //     .from("milestones")
    //     .select(`*, tasks (*), documents (*)`)
    //     .eq("id", id)
    //     .single()

    const { data: milestone, error } = await supabase
        .from("milestones")
        .select(`*`)
        .eq("id", id)
        .single();

    const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .or(`milestone_id.eq.${milestone.id},and(project_id.eq.${milestone.project_id},milestone_id.is.null)`);

    return {
        data: {
            ...milestone,
            documents: documents || []
        },
        error: error ? error.message : null
    };

}