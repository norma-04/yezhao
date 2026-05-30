// ─── 野造 · POST /api/community/like ───
import { NextRequest, NextResponse } from 'next/server'
import { communityPosts } from '@/data/community'

export async function POST(request: NextRequest) {
  const { postSlug } = await request.json()
  const post = communityPosts.find((p) => p.slug === postSlug)
  if (!post) return NextResponse.json({ error: '帖子未找到' }, { status: 404 })
  post.is_liked = !post.is_liked
  post.likes_count += post.is_liked ? 1 : -1
  return NextResponse.json({ is_liked: post.is_liked, likes_count: post.likes_count })
}
