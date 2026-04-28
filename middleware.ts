import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // 1. Create an unmodified response object
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 2. Create the Supabase Server Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                // This safely updates the secure session cookies if they are expiring
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 3. Get the current user session
    const { data: { user } } = await supabase.auth.getUser();

    const isAccessingDashboard = request.nextUrl.pathname.startsWith('/dashboard');
    const isAccessingLogin = request.nextUrl.pathname === '/login';

    // 4. THE BOUNCER LOGIC
    
    // If they are NOT logged in and trying to hit the dashboard -> Kick to login
    if (isAccessingDashboard && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If they ARE logged in and trying to go to the login page -> Kick to dashboard
    if (isAccessingLogin && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Otherwise, let them pass
    return response;
}

// 5. THE MATCHER
// This tells Next.js exactly which routes to run this middleware on.
// We exclude static files, images, and Next.js internal routes to keep your app fast.
export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * Feel free to modify this pattern to include more paths.
        */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};