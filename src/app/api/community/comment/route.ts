// ─── 野造 · GET/POST /api/community/comment ───
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('post')
  const { getComments } = await import('@/lib/supabase/services/community.service')
  const items = postId ? await getComments(postId) : []
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { createComment } = await import('@/lib/supabase/services/community.service')
  const comment = await createComment({
    post_id: body.post_id,
    content: body.content,
    parent_id: body.parent_id ?? null,
    status: 'approved',
  })
  return NextResponse.json(comment, { status: 201 })
}
