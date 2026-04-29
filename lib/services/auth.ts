'use server'

import { createSupabaseServerClient } from "../supabase/server"

export async function login(email: string, password: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  return { data, error: error ? error.message : null}
}

export async function signout() {
  const supabase = await createSupabaseServerClient()

  return await supabase.auth.signOut();
}