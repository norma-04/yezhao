// ─── 野造 · POST /api/community/favorite ───
import { NextRequest, NextResponse } from 'next/server'
import { communityPosts } from '@/data/community'

export async function POST(request: NextRequest) {
  const { postSlug } = await request.json()
  const post = communityPosts.find((p) => p.slug === postSlug)
  if (!post) return NextResponse.json({ error: '帖子未找到' }, { status: 404 })
  post.is_favorited = !post.is_favorited
  post.favorites_count += post.is_favorited ? 1 : -1
  return NextResponse.json({ is_favorited: post.is_favorited, favorites_count: post.favorites_count })
}
