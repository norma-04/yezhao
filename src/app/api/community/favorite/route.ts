// ─── 野造 · POST /api/community/favorite ───
import { NextRequest, NextResponse } from 'next/server'
import { CommunityService } from '@/lib/supabase/services'
import { getCurrentUser, createServerClientWithCookies } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { postSlug } = await request.json()

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

  const post = await CommunityService.getPostBySlug(postSlug)
  if (!post) return NextResponse.json({ error: '帖子未找到' }, { status: 404 })

  const { favorited } = await CommunityService.toggleFavorite(user.id, 'post', (post as any).id)

  // Query current favorites count
  const supabase = await createServerClientWithCookies()
  const { count } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', (post as any).id)
    .eq('item_type', 'post')

  return NextResponse.json({ is_favorited: favorited, favorites_count: count || 0 })
}
