// ─── 野造 · GET/POST /api/community ───
import { NextRequest, NextResponse } from 'next/server'
import { communityPosts, getPostsByTopic } from '@/data/community'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topic = searchParams.get('topic') ?? 'all'
  const sort = searchParams.get('sort') ?? 'latest'
  const limit = parseInt(searchParams.get('limit') ?? '20')

  let items = topic === 'all' ? [...communityPosts] : getPostsByTopic(topic)
  if (sort === 'popular') items.sort((a, b) => b.likes_count - a.likes_count)
  else if (sort === 'favorites') items.sort((a, b) => b.favorites_count - a.favorites_count)
  else items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return NextResponse.json({ items: items.slice(0, limit), total: items.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post: typeof communityPosts[0] = {
    id: `p${Date.now()}`, slug: body.slug || `post-${Date.now()}`,
    title: body.title, content: body.content, images: body.images || [],
    topic: body.topic || 'showcase', tags: body.tags || [],
    author: { id: 'u10', nickname: '手工小白', avatar_url: null },
    likes_count: 0, comments_count: 0, favorites_count: 0,
    is_liked: false, is_favorited: false,
    process_steps: body.process_steps || [],
    materials_used: body.materials_used || [],
    related_tutorial_slugs: body.related_tutorial_slugs || [],
    created_at: new Date().toISOString().split('T')[0],
  }
  communityPosts.unshift(post)
  return NextResponse.json(post, { status: 201 })
}
