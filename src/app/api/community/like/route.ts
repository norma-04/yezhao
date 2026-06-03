// ─── 野造 · POST /api/community/like ───
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import * as CommunityService from '@/lib/supabase/services/community.service'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

    const { postSlug } = await request.json()
    if (!postSlug) return NextResponse.json({ error: '缺少帖子标识' }, { status: 400 })

    const post = await CommunityService.getPostBySlug(postSlug)
    if (!post) return NextResponse.json({ error: '帖子未找到' }, { status: 404 })

    const result = await CommunityService.toggleLike(user.id, 'post', post.id)
    const likesCount = (post.likes_count ?? 0) + (result.liked ? 1 : -1)

    return NextResponse.json({
      is_liked: result.liked,
      likes_count: likesCount,
    })
  } catch {
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
