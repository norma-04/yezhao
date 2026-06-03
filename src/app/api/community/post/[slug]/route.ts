// ─── 野造 · GET /api/community/post/[slug] ───
import { NextRequest, NextResponse } from 'next/server'
import * as CommunityService from '@/lib/supabase/services/community.service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await CommunityService.getPostBySlug(slug)
  if (!post) return NextResponse.json({ error: '帖子未找到' }, { status: 404 })
  return NextResponse.json(post)
}
