// ─── 野造 · GET/POST /api/comments ───
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import { CommunityService } from '@/lib/supabase/services'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('post')
  const result = postId ? await CommunityService.getComments(postId) : []
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const comment = await CommunityService.createComment({
    post_id: body.post_id,
    content: body.content,
    parent_id: body.parent_id ?? null,
    author_id: user.id,
    status: 'approved',
  })
  return NextResponse.json(comment, { status: 201 })
}
