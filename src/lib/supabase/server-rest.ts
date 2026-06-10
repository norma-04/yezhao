// ─── 野造 · Supabase Server REST Client ───
// Direct REST API calls — avoids @supabase/ssr / @supabase/supabase-js
// entirely on the server side. No WebSocket, no Realtime, no socket error.
//
// Uses service_role key for write/authenticated operations.
// For public reads, use serverRead() with anon key.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function headers(auth: 'anon' | 'service'): Record<string, string> {
  const key = auth === 'service' ? SERVICE_KEY : ANON_KEY
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`,
    apikey: key,
  }
}

/** Public read (uses anon key, bypasses RLS for public tables) */
export async function serverGet<T = unknown>(
  path: string, params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const res = await fetch(url.toString(), { headers: headers('anon') })
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText)
    throw new Error(`Supabase GET ${path}: ${res.status} ${err}`)
  }
  return res.json()
}

/** Authenticated write (uses service_role key) */
export async function serverPost<T = unknown>(
  path: string, body: unknown
): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: { ...headers('service'), Prefer: 'return=representation' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText)
    throw new Error(`Supabase POST ${path}: ${res.status} ${err}`)
  }
  return res.json()
}
