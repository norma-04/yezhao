// ─── 野造 · Supabase Server Client ───
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

export async function createServerClientWithCookies() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Cookies cannot be set in Server Components — handled by middleware
          }
        },
      },
    }
  )
}

/** Get the current session (for Server Components / API Routes) */
export async function getSession() {
  const supabase = await createServerClientWithCookies()
  const { data } = await supabase.auth.getSession()
  return data.session
}

/** Get the current authenticated user (for Server Components / API Routes) */
export async function getCurrentUser() {
  const supabase = await createServerClientWithCookies()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/** Get the current user's profile with full data */
export async function getCurrentProfile() {
  const supabase = await createServerClientWithCookies()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/** Service-role client (for admin operations, use ONLY in secure API routes) */
export async function createServiceClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignore
          }
        },
      },
    }
  )
}
