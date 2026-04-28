import { createSupabaseServerClient } from "../supabase/server";

export const profileService = {
    async getMyProfile() {
        const supabase = await createSupabaseServerClient();

        // 1. Get the current user session from the server
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return { data: null, error: 'No session' };

        // 2. Get the matching row from our public.profiles table
        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

        return { data, error };
    }
};