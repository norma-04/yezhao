// ─── 野造 · Middleware ───
// Session refresh + Route protection + RBAC
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ─── Route Categories ───
const PUBLIC_ROUTES = [
  '/',
  '/tutorials',
  '/materials',
  '/community',
  '/search',
]

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
]

const PROTECTED_ROUTES = [
  '/me',
  '/community/create',
]

const ADMIN_ROUTES = [
  '/admin',
]

// ─── Helper: Check if path matches ───
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(route + '/'))
}

// ─── Helper: Create Supabase client for middleware ───
function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response }
}

// ─── Main Middleware ───
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  const { supabase, response } = createMiddlewareClient(request)

  // Refresh session (keeps auth state fresh)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = !!user

  // Check user role for admin routes
  let userRole: string | null = null
  if (isAuthenticated) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    userRole = profile?.role || 'user'

    // Block banned users
    if (profile?.status === 'banned') {
      // Sign them out
      await supabase.auth.signOut()
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'banned')
      return NextResponse.redirect(loginUrl)
    }
  }

  // ─── Route Protection Logic ───

  // 1. Auth routes (login/register): redirect to home if already authenticated
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return response
  }

  // 2. Admin routes: require admin role
  if (matchesRoute(pathname, ADMIN_ROUTES)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      // Render a 403 or redirect
      const forbiddenUrl = new URL('/', request.url)
      forbiddenUrl.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(forbiddenUrl)
    }

    return response
  }

  // 3. Protected routes: require authentication
  if (matchesRoute(pathname, PROTECTED_ROUTES)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // 4. API routes: check auth headers
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return response
  }

  // 5. Public routes: allow all
  return response
}

// ─── Config: Which paths to run middleware on ───
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     * - .svg, .png, etc. (static assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|eot)$).*)',
  ],
}
