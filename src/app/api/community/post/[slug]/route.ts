// ─── 野造 · GET /api/community/post/[slug] ───
import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/data/community'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return NextResponse.json({ error: '帖子未找到' }, { status: 404 })
  return NextResponse.json(post)
}
