import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes and their required roles
  const protectedRoutes = {
    '/dashboard': ['job_seeker', 'employer', 'legal_advisor', 'super_admin'],
    '/admin': ['super_admin'],
    '/employer': ['employer', 'super_admin'],
    '/legal': ['legal_advisor', 'super_admin'],
    '/saved-jobs': ['job_seeker', 'employer', 'legal_advisor', 'super_admin'],
    '/messages': ['job_seeker', 'employer', 'legal_advisor', 'super_admin'],
  };

  const currentPath = req.nextUrl.pathname;

  // Check if the current path requires authentication
  const requiresAuth = Object.keys(protectedRoutes).some(route => 
    currentPath.startsWith(route)
  );

  if (requiresAuth && !user) {
    // Redirect to login if not authenticated
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', currentPath);
    return NextResponse.redirect(redirectUrl);
  }

  // Check role-based access for specific routes
  if (user && requiresAuth) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const userRole = profile?.role || 'job_seeker';

    // Check if user has required role for the current path
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (currentPath.startsWith(route) && !allowedRoles.includes(userRole)) {
        // Redirect to unauthorized page or dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/employer/:path*',
    '/legal/:path*',
    '/saved-jobs/:path*',
    '/messages/:path*',
  ],
};
