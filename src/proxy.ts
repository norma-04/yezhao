// ─── 野造 · Middleware ───
// Session check + Route protection + RBAC
// Parses Supabase auth cookie directly — no @supabase/ssr dependency,
// avoiding WebSocket issues in edge environments (EdgeOne Node 18).
import { NextResponse, type NextRequest } from 'next/server'

// ─── Route Categories ───
const AUTH_ROUTES = [
  '/auth/login', '/auth/register', '/auth/forgot-password',
  '/auth/reset-password', '/auth/callback',
]
const PROTECTED_ROUTES = ['/me', '/community/create']
const ADMIN_ROUTES = ['/admin']

// ─── Helpers ───
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + '/'))
}

// Base64 decode (edge-compatible: atob for Web APIs, Buffer fallback for Node)
function base64Decode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  if (typeof atob !== 'undefined') {
    try { return atob(base64) } catch { /* fall through */ }
  }
  // Node.js fallback
  return Buffer.from(base64, 'base64').toString('utf-8')
}

// Find Supabase session cookie by scanning cookie names (robust — no env var needed)
function findSession(request: NextRequest): { userId: string } | null {
  // Scan for sb-*-auth-token cookie (e.g. sb-abcdefghijkl-auth-token)
  let cookieValue: string | undefined
  const allCookies = request.cookies.getAll()
  for (const c of allCookies) {
    if (/^sb-[a-z0-9]+-auth-token/.test(c.name)) {
      cookieValue = c.value
      break
    }
  }
  if (!cookieValue) return null

  try {
    const raw = JSON.parse(base64Decode(cookieValue))
    if (!raw.access_token) return null

    // Decode JWT payload to check expiry (no verification — Supabase handles that)
    const parts = raw.access_token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(base64Decode(parts[1]))

    // Expired?
    if (payload.exp && payload.exp * 1000 < Date.now()) return null

    return { userId: payload.sub }
  } catch {
    return null
  }
}

// ─── Main Middleware ───
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, API routes, Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  const needsAuth = matchesRoute(pathname, AUTH_ROUTES)
  const needsProtection = matchesRoute(pathname, PROTECTED_ROUTES)
  const needsAdmin = matchesRoute(pathname, ADMIN_ROUTES)

  if (!needsAuth && !needsProtection && !needsAdmin) {
    return NextResponse.next()
  }

  const session = findSession(request)

  // Auth routes: redirect to home if already logged in
  if (needsAuth) {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes: require auth
  if (needsProtection) {
    if (!session) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Admin routes: require auth (role check done client-side)
  if (needsAdmin) {
    if (!session) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|eot)$).*)',
  ],
}
