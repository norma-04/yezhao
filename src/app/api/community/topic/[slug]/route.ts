// ─── 野造 · GET /api/community/topic/[slug] ───
import { NextRequest, NextResponse } from 'next/server'
import { getPostsByTopic, topics } from '@/data/community'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const topic = topics.find((t) => t.slug === slug)
  const posts = getPostsByTopic(slug)
  if (!topic) return NextResponse.json({ error: '话题未找到' }, { status: 404 })
  return NextResponse.json({ topic, posts, total: posts.length })
}
