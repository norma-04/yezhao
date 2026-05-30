// ─── 野造 · Notification Service ───
import { getSupabaseClient } from '../client'
import type { NotificationRow, CheckinRow, ChallengeRow, BadgeRow, UserBadgeRow } from '../database.types'

// ─── Notifications ───

export async function getNotifications(userId: string, params?: { unreadOnly?: boolean; page?: number; limit?: number }) {
  const supabase = getSupabaseClient()
  const page = params?.page || 1
  const limit = params?.limit || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('notifications')
    .select('*, actor:profiles!notifications_actor_id_fkey(id, nickname, avatar_url)', { count: 'exact' })
    .eq('user_id', userId as never)

  if (params?.unreadOnly) query = query.eq('is_read', false)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)
  return { items: (data || []) as NotificationRow[], total: count || 0 }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = getSupabaseClient()
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId as never)
    .eq('is_read', false)
  if (error) return 0
  return count || 0
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  await supabase.from('notifications').update({ is_read: true } as never).eq('id' as never, id)
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const supabase = getSupabaseClient()
  await supabase
    .from('notifications')
    .update({ is_read: true } as never)
    .eq('user_id', userId as never)
    .eq('is_read', false)
}

// ─── Real-time Notification Subscription ───

export function subscribeToNotifications(userId: string, onInsert: (notification: NotificationRow) => void) {
  const supabase = getSupabaseClient()
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      (payload) => { onInsert(payload.new as NotificationRow) }
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}

// ─── Checkins ───

export async function getCheckins(userId: string, year?: number, month?: number): Promise<CheckinRow[]> {
  const supabase = getSupabaseClient()
  let query = supabase.from('checkins').select('*').eq('user_id', userId as never).order('check_date', { ascending: false })

  if (year) {
    const startDate = `${year}-${String(month || 1).padStart(2, '0')}-01`
    const endMonth = month || 12
    const endDate = `${year}-${String(endMonth).padStart(2, '0')}-31`
    query = query.gte('check_date', startDate).lte('check_date', endDate)
  }

  const { data } = await query
  return (data || []) as CheckinRow[]
}

export async function createCheckin(userId: string, hoursSpent?: number, tutorialsCompleted?: number): Promise<CheckinRow> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('checkins')
    .upsert({
      user_id: userId,
      check_date: new Date().toISOString().split('T')[0],
      hours_spent: hoursSpent || 0,
      tutorials_completed: tutorialsCompleted || 0,
    } as never, { onConflict: 'user_id,check_date' })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as CheckinRow
}

export async function getLeaderboard(params?: { year?: number; month?: number; limit?: number }) {
  const supabase = getSupabaseClient()
  const limit = params?.limit || 20
  const { data } = await supabase.from('checkins').select('user_id, profiles:profiles!checkins_user_id_fkey(id, nickname, avatar_url)')

  if (!data) return []

  const aggregated = new Map<string, { user: unknown; days: number; hours: number }>()
  for (const entry of data as { user_id: string; profiles: unknown; hours_spent: number }[]) {
    const existing = aggregated.get(entry.user_id)
    if (existing) { existing.days++; existing.hours += entry.hours_spent }
    else { aggregated.set(entry.user_id, { user: entry.profiles, days: 1, hours: entry.hours_spent }) }
  }

  return Array.from(aggregated.entries())
    .sort((a, b) => b[1].days - a[1].days)
    .slice(0, limit)
    .map(([, val], index) => ({ rank: index + 1, user: val.user, checkin_days: val.days, total_hours: Math.round(val.hours * 10) / 10 }))
}

// ─── Challenges ───

export async function getChallenges(): Promise<ChallengeRow[]> {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('challenges').select('*').order('created_at', { ascending: false })
  return (data || []) as ChallengeRow[]
}

export async function getChallengeParticipants(challengeId: string) {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from('challenge_participants')
    .select('*, user:profiles!challenge_participants_user_id_fkey(id, nickname, avatar_url)')
    .eq('challenge_id', challengeId as never)
    .order('current_streak', { ascending: false })
  return (data || []) as never[]
}

export async function joinChallenge(challengeId: string, userId: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('challenge_participants')
    .insert({ challenge_id: challengeId, user_id: userId } as never)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

// ─── Badges ───

export async function getAllBadges(): Promise<BadgeRow[]> {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('badges').select('*')
  return (data || []) as BadgeRow[]
}

export async function getUserBadges(userId: string): Promise<(UserBadgeRow & { badge: BadgeRow })[]> {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', userId as never)
    .order('earned_at', { ascending: false })
  return (data || []) as (UserBadgeRow & { badge: BadgeRow })[]
}

// ─── Admin Stats ───

export async function getAdminStats() {
  const supabase = getSupabaseClient()
  const [usersRes, tutorialsRes, postsRes, checkinsRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('tutorials').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('checkins').select('*', { count: 'exact', head: true }).eq('check_date', new Date().toISOString().split('T')[0]),
  ])
  return {
    total_users: usersRes.count || 0,
    total_tutorials: tutorialsRes.count || 0,
    total_posts: postsRes.count || 0,
    daily_active_users: checkinsRes.count || 0,
  }
}
