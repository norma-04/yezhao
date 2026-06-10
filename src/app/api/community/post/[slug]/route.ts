// ─── 野造 · GET /api/community/post/[slug] ───
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  // Dynamic import — avoids loading Supabase client on cold start
  const { getPostBySlug } = await import('@/lib/supabase/services/community.service')
  const post = await getPostBySlug(slug)
  if (!post) return NextResponse.json({ error: '帖子未找到' }, { status: 404 })
  return NextResponse.json(post)
}
