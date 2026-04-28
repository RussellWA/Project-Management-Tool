'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // 1. Tell Supabase to destroy the session cookie
    await supabase.auth.signOut();
    
    // 2. Refresh the router to trigger the middleware
    router.refresh();
    
    // 3. Kick them back to login
    router.push('/login');
  };

  return (
    <button 
      onClick={handleSignOut}
      className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      Sign Out
    </button>
  );
}