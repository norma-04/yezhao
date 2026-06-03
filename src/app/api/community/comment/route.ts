// ─── 野造 · GET/POST /api/community/comment ───
import { NextRequest, NextResponse } from 'next/server'
import * as CommunityService from '@/lib/supabase/services/community.service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('post')
  const items = postId ? await CommunityService.getComments(postId) : []
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const comment = await CommunityService.createComment({
    post_id: body.post_id,
    content: body.content,
    parent_id: body.parent_id ?? null,
    status: 'approved',
  })
  return NextResponse.json(comment, { status: 201 })
}
