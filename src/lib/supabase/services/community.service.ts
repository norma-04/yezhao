// ─── 野造 · Community Service ───
import { getSupabaseClient } from '../client'
import type { PostRow, PostInsert, CommentRow, CommentInsert } from '../database.types'

// ─── Posts ───

export async function getPosts(params?: {
  topic?: string; sort?: string; search?: string; page?: number; limit?: number
}) {
  const supabase = getSupabaseClient()
  const page = params?.page || 1
  const limit = params?.limit || 12
  const offset = (page - 1) * limit

  let query = supabase
    .from('posts')
    .select('*, author:profiles!posts_author_id_fkey(id, nickname, avatar_url)', { count: 'exact' })
    .eq('status', 'approved')

  if (params?.topic && params.topic !== 'all') query = query.eq('topic', params.topic as PostRow['topic'])
  if (params?.search) query = query.ilike('title', `%${params.search}%`)

  switch (params?.sort) {
    case 'popular': query = (query as ReturnType<typeof supabase.from>).order('likes_count', { ascending: false }); break
    case 'commented': query = (query as ReturnType<typeof supabase.from>).order('comments_count', { ascending: false }); break
    default: query = (query as ReturnType<typeof supabase.from>).order('created_at', { ascending: false })
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)
  return { items: (data || []) as PostRow[], total: count || 0 }
}

export async function getPostBySlug(slug: string, userId?: string) {
  const supabase = getSupabaseClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('*, author:profiles!posts_author_id_fkey(id, nickname, avatar_url)')
    .eq('slug', slug)
    .single()

  if (error || !post) return null

  const { data: comments } = await supabase
    .from('comments')
    .select('*, author:profiles!comments_author_id_fkey(id, nickname, avatar_url)')
    .eq('post_id', (post as PostRow).id)
    .is('parent_id', null)
    .order('created_at', { ascending: true })

  let is_liked = false
  let is_favorited = false
  if (userId) {
    const [likeRes, favRes] = await Promise.all([
      supabase.from('likes').select('id').eq('user_id', userId).eq('target_type', 'post').eq('target_id', (post as PostRow).id).single(),
      supabase.from('favorites').select('id').eq('user_id', userId).eq('item_type', 'post').eq('item_id', (post as PostRow).id).single(),
    ])
    is_liked = !likeRes.error
    is_favorited = !favRes.error
  }

  return {
    ...(post as PostRow),
    comments: (comments || []) as CommentRow[],
    is_liked,
    is_favorited,
  }
}

export async function createPost(input: PostInsert): Promise<PostRow> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('posts').insert(input as never).select('*').single()
  if (error) throw new Error(error.message)
  return data as PostRow
}

export async function deletePost(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('posts').delete().eq('id' as never, id)
  if (error) throw new Error(error.message)
}

// ─── Comments ───

export async function getComments(postId: string, parentId?: string | null): Promise<CommentRow[]> {
  const supabase = getSupabaseClient()
  let query = supabase
    .from('comments')
    .select('*, author:profiles!comments_author_id_fkey(id, nickname, avatar_url)')
    .eq('post_id', postId as never)
    .order('created_at', { ascending: true })

  if (parentId !== undefined) query = query.eq('parent_id', parentId as never)

  const { data } = await query
  return (data || []) as CommentRow[]
}

export async function createComment(input: CommentInsert): Promise<CommentRow> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('comments').insert(input as never).select('*').single()
  if (error) throw new Error(error.message)
  return data as CommentRow
}

export async function deleteComment(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('comments').delete().eq('id' as never, id)
  if (error) throw new Error(error.message)
}

// ─── Likes ───

export async function toggleLike(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<{ liked: boolean }> {
  const supabase = getSupabaseClient()
  const { data: existing } = await supabase.from('likes').select('id')
    .eq('user_id', userId as never).eq('target_type', targetType).eq('target_id', targetId as never)
    .single()

  if (existing) {
    await supabase.from('likes').delete().eq('id', (existing as { id: string }).id as never)
    return { liked: false }
  } else {
    await supabase.from('likes').insert({ user_id: userId, target_type: targetType, target_id: targetId } as never)
    return { liked: true }
  }
}

export async function hasUserLiked(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('likes').select('id')
    .eq('user_id', userId as never).eq('target_type', targetType).eq('target_id', targetId as never)
    .single()
  return !error
}

// ─── Favorites ───

export async function toggleFavorite(userId: string, itemType: 'tutorial' | 'material' | 'post', itemId: string): Promise<{ favorited: boolean }> {
  const supabase = getSupabaseClient()
  const { data: existing } = await supabase.from('favorites').select('id')
    .eq('user_id', userId as never).eq('item_type', itemType).eq('item_id', itemId as never)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', (existing as { id: string }).id as never)
    return { favorited: false }
  } else {
    await supabase.from('favorites').insert({ user_id: userId, item_type: itemType, item_id: itemId } as never)
    return { favorited: true }
  }
}

export async function getUserFavorites(userId: string, itemType?: string) {
  const supabase = getSupabaseClient()
  let query = supabase.from('favorites').select('*').eq('user_id', userId as never)
  if (itemType) query = query.eq('item_type', itemType)
  const { data } = await query.order('created_at', { ascending: false })
  return (data || []) as PostRow[]
}

// ─── Admin ───

export async function getPendingReviews() {
  const supabase = getSupabaseClient()
  const [postsRes, commentsRes] = await Promise.all([
    supabase.from('posts').select('*, author:profiles!posts_author_id_fkey(id, nickname, avatar_url)').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('comments').select('*, author:profiles!comments_author_id_fkey(id, nickname, avatar_url)').eq('status', 'pending').order('created_at', { ascending: false }),
  ])
  return { posts: (postsRes.data || []) as PostRow[], comments: (commentsRes.data || []) as CommentRow[] }
}

export async function approveContent(type: 'post' | 'comment', id: string) {
  const supabase = getSupabaseClient()
  const table = type === 'post' ? 'posts' : 'comments'
  const { error } = await supabase.from(table).update({ status: 'approved' } as never).eq('id' as never, id)
  if (error) throw new Error(error.message)
}

export async function rejectContent(type: 'post' | 'comment', id: string) {
  const supabase = getSupabaseClient()
  const table = type === 'post' ? 'posts' : 'comments'
  const { error } = await supabase.from(table).update({ status: 'rejected' } as never).eq('id' as never, id)
  if (error) throw new Error(error.message)
}
