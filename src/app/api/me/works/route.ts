import { NextResponse } from 'next/server'
import { communityPosts } from '@/data/community'

export async function GET() {
  const myPosts = communityPosts.filter((p) => p.author.id === 'u10')
  const stats = { total: myPosts.length, total_likes: myPosts.reduce((s, p) => s + p.likes_count, 0), total_favorites: myPosts.reduce((s, p) => s + p.favorites_count, 0), total_comments: myPosts.reduce((s, p) => s + p.comments_count, 0) }
  return NextResponse.json({ items: myPosts, stats })
}
