import { supabase } from "../supabase";


export const profileService = {
    async getMyProfile() {
        // 1. Get the current user session from the server
        const { data: { user } } = await supabase.auth.getUser();

        console.log("user ", user)
        
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