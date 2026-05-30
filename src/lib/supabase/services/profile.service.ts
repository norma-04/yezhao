// ─── 野造 · Profile Service ───
import { getSupabaseClient } from '../client'
import type { ProfileRow, ProfileUpdate } from '../database.types'

// ─── Profile CRUD ───

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId as never).single()
  if (error) return null
  return data as ProfileRow
}

export async function getProfileByUsername(username: string): Promise<ProfileRow | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('profiles').select('*').eq('username', username).single()
  if (error) return null
  return data as ProfileRow
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<ProfileRow | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('profiles').update(updates as never).eq('id' as never, userId).select('*').single()
  if (error) throw new Error(error.message)
  return data as ProfileRow
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const supabase = getSupabaseClient()
  const ext = file.name.split('.').pop() || 'jpg'
  const filePath = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true, contentType: file.type })
  if (error) throw new Error(error.message)

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
  await updateProfile(userId, { avatar_url: urlData.publicUrl })
  return urlData.publicUrl
}

// ─── User Stats ───

export async function getUserStats(userId: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.rpc('get_user_stats', { user_id: userId } as never)
  if (error) return { works_count: 0, favorites_count: 0, followers_count: 0, following_count: 0 }
  return data as { works_count: number; favorites_count: number; followers_count: number; following_count: number }
}

// ─── Follow/Unfollow ───

export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('follows').insert({ follower_id: followerId, following_id: followingId } as never)
  return !error
}

export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId as never)
    .eq('following_id', followingId as never)
  return !error
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId as never)
    .eq('following_id', followingId as never)
    .single()
  return !error
}

export async function getFollowers(userId: string): Promise<ProfileRow[]> {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('follows')
    .select('follower:profiles!follows_follower_id_fkey(*)')
    .eq('following_id', userId as never)
  return ((data || []) as { follower: ProfileRow }[]).map((f) => f.follower)
}

export async function getFollowing(userId: string): Promise<ProfileRow[]> {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('follows')
    .select('following:profiles!follows_following_id_fkey(*)')
    .eq('follower_id', userId as never)
  return ((data || []) as { following: ProfileRow }[]).map((f) => f.following)
}

// ─── Admin: User Management ───

export async function listUsers(params?: { search?: string; status?: string; page?: number; limit?: number }) {
  const supabase = getSupabaseClient()
  const page = params?.page || 1
  const limit = params?.limit || 20
  const offset = (page - 1) * limit

  let query = supabase.from('profiles').select('*', { count: 'exact' })
  if (params?.search) query = query.or(`nickname.ilike.%${params.search}%,email.ilike.%${params.search}%`)
  if (params?.status && params.status !== 'all') query = query.eq('status', params.status)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)
  return { items: (data || []) as ProfileRow[], total: count || 0 }
}

export async function banUser(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('profiles').update({ status: 'banned' } as never).eq('id' as never, userId)
  return !error
}

export async function unbanUser(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('profiles').update({ status: 'active' } as never).eq('id' as never, userId)
  return !error
}
