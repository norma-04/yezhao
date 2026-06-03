// ─── 野造 · GET/POST /api/community ───
import { NextRequest, NextResponse } from 'next/server'
import * as CommunityService from '@/lib/supabase/services/community.service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topic = searchParams.get('topic') ?? 'all'
  const sort = searchParams.get('sort') ?? 'latest'
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const { items, total } = await CommunityService.getPosts({ topic, sort, limit })

  return NextResponse.json({ items, total })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post = await CommunityService.createPost({
    title: body.title,
    slug: body.slug || `post-${Date.now()}`,
    content: body.content,
    images: body.images,
    topic: body.topic || 'showcase',
    tags: body.tags,
    author_id: body.author_id,
    status: 'pending',
  })
  return NextResponse.json(post, { status: 201 })
}
