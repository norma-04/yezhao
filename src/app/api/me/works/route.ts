import { NextResponse } from 'next/server'
import { getCurrentUser, createServerClientWithCookies } from '@/lib/supabase/server'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerClientWithCookies()
  const { data: posts } = await supabase
    .from('posts')
    .select('*, author:profiles!posts_author_id_fkey(id, nickname, avatar_url)')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  const myPosts = (posts || []) as any[]
  const stats = { total: myPosts.length, total_likes: myPosts.reduce((s: number, p: any) => s + (p.likes_count || 0), 0), total_favorites: myPosts.reduce((s: number, p: any) => s + (p.favorites_count || 0), 0), total_comments: myPosts.reduce((s: number, p: any) => s + (p.comments_count || 0), 0) }
  return NextResponse.json({ items: myPosts, stats })
}
