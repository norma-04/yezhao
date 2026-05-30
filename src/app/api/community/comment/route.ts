// ─── 野造 · GET/POST /api/community/comment ───
import { NextRequest, NextResponse } from 'next/server'
import { communityComments } from '@/data/community'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postSlug = searchParams.get('post')
  const items = postSlug ? communityComments.filter((c) => c.postSlug === postSlug) : communityComments
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const comment = {
    id: `cc${Date.now()}`, postSlug: body.postSlug,
    author: { id: 'u10', nickname: '手工小白', avatar_url: null },
    content: body.content, created_at: new Date().toISOString().split('T')[0],
    parent_id: body.parent_id ?? null,
  }
  communityComments.push(comment)
  return NextResponse.json(comment, { status: 201 })
}
