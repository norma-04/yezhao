// ─── 野造 · Middleware ───
// Session check + Route protection + RBAC
// No Supabase imports — parses auth cookie directly to avoid
// WebSocket dependency issues in edge environments (Node 18, EdgeOne).
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

// Base64 decode (works in edge runtime — no Node.js Buffer)
function base64Decode(str: string): string {
  // Convert base64url to standard base64
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  // atob() is available in Web/Edge runtimes
  if (typeof atob !== 'undefined') return atob(base64)
  // Fallback for Node.js
  return Buffer.from(base64, 'base64').toString('utf-8')
}

// Parse Supabase auth cookie to check if user has a valid session
// Cookie format: sb-<project-ref>-auth-token = base64({ access_token, refresh_token, ... })
function getSessionFromCookies(request: NextRequest): { userId: string } | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)/)?.[1] || ''
  const cookieName = `sb-${projectRef}-auth-token`

  const cookie = request.cookies.get(cookieName)
  if (!cookie) return null

  try {
    const raw = JSON.parse(base64Decode(cookie.value))
    if (!raw.access_token) return null

    // Decode JWT payload (without verification — just to check expiry)
    const payload = raw.access_token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(base64Decode(payload))

    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null

    return { userId: decoded.sub }
  } catch {
    return null
  }
}

// ─── Main Middleware ───
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, API, Next.js internals
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

  // Public route — no auth check needed
  if (!needsAuth && !needsProtection && !needsAdmin) {
    return NextResponse.next()
  }

  const session = getSessionFromCookies(request)

  // Auth routes (login/register): redirect to home if already logged in
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

  // Admin routes: we can check the cookie exists but can't verify role
  // without a DB call. For now, just require auth — the admin page itself
  // will do the role check client-side.
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
