// ─── 野造 · Middleware ───
// Session refresh + Route protection + RBAC
// Performance: public routes skip Supabase entirely; auth/protected routes use
//   getSession() (local cookie check, ~0ms); only admin routes hit the network.
import '@/lib/polyfills/websocket' // MUST be before @supabase/ssr for Node 18
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ─── Route Categories ───
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

  // ── Early return for public routes: no Supabase call needed ──
  const needsAuth = matchesRoute(pathname, AUTH_ROUTES)
  const needsProtection = matchesRoute(pathname, PROTECTED_ROUTES)
  const needsAdmin = matchesRoute(pathname, ADMIN_ROUTES)

  if (!needsAuth && !needsProtection && !needsAdmin) {
    return NextResponse.next()
  }

  const { supabase, response } = createMiddlewareClient(request)

  // ── Auth routes: fast local session check (getSession reads cookies, no network) ──
  if (needsAuth) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      // getSession failed — allow access to auth pages
    }
    return response
  }

  // ── Protected routes: local session check ──
  if (needsProtection) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      // getSession failed — redirect to login for safety
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // ── Admin routes: full verification (network calls unavoidable for security) ──
  if (needsAdmin) {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .single()

      if (profile?.status === 'banned') {
        await supabase.auth.signOut()
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('error', 'banned')
        return NextResponse.redirect(loginUrl)
      }

      const role = profile?.role || 'user'
      if (role !== 'admin' && role !== 'super_admin') {
        const forbiddenUrl = new URL('/', request.url)
        forbiddenUrl.searchParams.set('error', 'forbidden')
        return NextResponse.redirect(forbiddenUrl)
      }
    } catch {
      // Auth check failed — redirect to login for safety
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

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
