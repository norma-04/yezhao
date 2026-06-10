// ─── 野造 · GET/POST /api/community ───
// POST: uses direct REST API (no Supabase client — no socket error)
// GET: dynamic import to avoid loading Supabase client on POST codepath
import { NextRequest, NextResponse } from 'next/server'
import { serverPost } from '@/lib/supabase/server-rest'

// Base64 decode (edge-compatible)
function base64Decode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  if (typeof atob !== 'undefined') {
    try { return atob(base64) } catch { /* fall through */ }
  }
  return Buffer.from(base64, 'base64').toString('utf-8')
}

// Extract user ID from Supabase auth cookie
function getUserIdFromCookies(request: NextRequest): string | null {
  const allCookies = request.cookies.getAll()
  for (const c of allCookies) {
    if (!/^sb-[a-z0-9]+-auth-token/.test(c.name)) continue
    try {
      const raw = JSON.parse(base64Decode(c.value))
      if (!raw.access_token) continue
      const parts = raw.access_token.split('.')
      if (parts.length !== 3) continue
      const payload = JSON.parse(base64Decode(parts[1]))
      if (payload.sub) return payload.sub
    } catch { continue }
  }
  return null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topic = searchParams.get('topic') ?? 'all'
  const sort = searchParams.get('sort') ?? 'latest'
  const limit = parseInt(searchParams.get('limit') ?? '20')

  // Dynamic import — only loads Supabase client when GET is actually called
  const { getPosts } = await import('@/lib/supabase/services/community.service')
  const { items, total } = await getPosts({ topic, sort, limit })
  return NextResponse.json({ items, total })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authorId = getUserIdFromCookies(request)
    if (!authorId) {
      return NextResponse.json({ error: '请先登录后再发布作品' }, { status: 401 })
    }

    // Use direct REST call — no Supabase client library, no Realtime, no socket error
    const data = await serverPost('posts', {
      title: body.title,
      slug: body.slug || `post-${Date.now()}`,
      content: body.content,
      images: body.images || [],
      topic: body.topic || 'showcase',
      tags: body.tags || [],
      author_id: authorId,
      status: 'pending',
    })

    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '发布失败'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
