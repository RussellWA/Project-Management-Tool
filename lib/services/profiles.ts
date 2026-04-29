"use server"

import { createSupabaseServerClient } from "../supabase/server";

export async function getProfile() {
    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { data: null, error: 'No session' };

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();


    return { data, error: error ? error.message : null}
}
