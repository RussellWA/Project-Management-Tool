"use server"

import { Document } from "@/types/document";
import { createSupabaseServerClient } from "../supabase/server"


export async function createDocument(document: Document): Promise<{error: string | null}> {
    const supabase = await createSupabaseServerClient()

    console.log("document ", document)

    const { error } = await supabase
        .from('documents')
        .insert([{ 
            name: document.name, 
            url: document.url,
            type: document.type,
            project_id: document.project_id,
            milestone_id: document.milestone_id,
            task_id: document.task_id,
            uploaded_by: document.uploaded_by 
        }]);

    return { error: error ? error.message : null }
}