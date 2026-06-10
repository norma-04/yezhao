// ─── 野造 · GET /api/community/topic/[slug] ───
import { NextRequest, NextResponse } from 'next/server'

const topics = [
  { slug: 'showcase', name: '成品展示', icon: '🎨', description: '展示你的手作作品，让更多人看到' },
  { slug: 'newbie', name: '新手避坑', icon: '🔰', description: '新手经验分享，一起成长' },
  { slug: 'review', name: '材料测评', icon: '📊', description: '工具和材料的真实使用体验' },
  { slug: 'activity', name: '活动专区', icon: '🎪', description: '线上活动和挑战赛事' },
]

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const topic = topics.find((t) => t.slug === slug)
  if (!topic) return NextResponse.json({ error: '话题未找到' }, { status: 404 })
  const { getPosts } = await import('@/lib/supabase/services/community.service')
  const { items: posts, total } = await getPosts({ topic: slug })
  return NextResponse.json({ topic, posts, total })
}
