"use server";

import { ProjectMember, Role } from "@/types/project_member";
import { createSupabaseServerClient } from "../supabase/server"

export async function getMembers(id: string): Promise<{data: ProjectMember[] | null, error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("project_members")
        .select(`*`)
        .eq("project_id", id)

    return {data, error: error ? error.message : null }
}

export async function createMember(member: ProjectMember): Promise<{error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("project_members")
        .insert([{ 
            project_id: member.project_id,
            user_id: member.user_id,
            role: member.role,
            role_detail: member.role_detail
        }])

    return {error: error ? error.message : null }
}

export async function updateMemberRoles(id: string, roleList: Role[]): Promise<{error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("project_members")
        .update([{
            role_detail: roleList,
        }])
        .eq("id", id)

    return {error: error ? error.message : null }
}

export async function deleteMember(id: string): Promise<{error: string | null}> {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", id)

    return {error: error ? error.message : null }
}