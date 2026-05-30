// ─── 野造 · Realtime Hooks ───
// Hooks for Supabase Realtime subscriptions

'use client'

import { useEffect, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

type TableName =
  | 'posts'
  | 'comments'
  | 'likes'
  | 'notifications'
  | 'profiles'
  | 'tutorials'
  | 'checkins'

type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface UseRealtimeOptions {
  table: TableName
  event?: ChangeEvent
  filter?: string
  onInsert?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void
  onUpdate?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void
  onDelete?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void
  enabled?: boolean
}

/**
 * Generic hook for subscribing to Supabase Realtime changes
 */
export function useRealtime({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeOptions) {
  const channelRef = useRef<string>(`realtime:${table}:${Math.random().toString(36).slice(2, 6)}`)

  useEffect(() => {
    if (!enabled) return

    const supabase = getSupabaseClient()

    const channel = supabase
      .channel(channelRef.current)
      .on(
        'postgres_changes' as const,
        {
          event,
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT': onInsert?.(payload as { new: Record<string, unknown>; old: Record<string, unknown> }); break
            case 'UPDATE': onUpdate?.(payload as { new: Record<string, unknown>; old: Record<string, unknown> }); break
            case 'DELETE': onDelete?.(payload as { new: Record<string, unknown>; old: Record<string, unknown> }); break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, event, filter, enabled, onInsert, onUpdate, onDelete])
}

// ─── Specific Real-time Hooks ───

/**
 * Subscribe to new comments on a post
 */
export function useCommentsRealtime(
  postId: string | undefined,
  onNewComment: (comment: Record<string, unknown>) => void,
  enabled = true
) {
  useRealtime({
    table: 'comments',
    event: 'INSERT',
    filter: postId ? `post_id=eq.${postId}` : undefined,
    onInsert: (payload) => onNewComment(payload.new),
    enabled: enabled && !!postId,
  })
}

/**
 * Subscribe to new likes on a post
 */
export function useLikesRealtime(
  postId: string | undefined,
  onLikeChange: () => void,
  enabled = true
) {
  useRealtime({
    table: 'likes',
    event: '*',
    filter: postId ? `target_type=eq.post AND target_id=eq.${postId}` : undefined,
    onInsert: () => onLikeChange(),
    onDelete: () => onLikeChange(),
    enabled: enabled && !!postId,
  })
}

/**
 * Subscribe to new posts (for community feed)
 */
export function useNewPostsRealtime(
  onNewPost: (post: Record<string, unknown>) => void,
  enabled = true
) {
  useRealtime({
    table: 'posts',
    event: 'INSERT',
    filter: 'status=eq.approved',
    onInsert: (payload) => onNewPost(payload.new),
    enabled,
  })
}

/**
 * Subscribe to user notifications
 */
export function useNotificationsRealtime(
  userId: string | undefined,
  onNewNotification: (notification: Record<string, unknown>) => void,
  enabled = true
) {
  useRealtime({
    table: 'notifications',
    event: 'INSERT',
    filter: userId ? `user_id=eq.${userId}` : undefined,
    onInsert: (payload) => onNewNotification(payload.new),
    enabled: enabled && !!userId,
  })
}

/**
 * Subscribe to presence (online users, typing indicators, etc.)
 */
export function usePresence(channelName: string, userId: string, enabled = true) {
  const channelRef = useRef<string>(`presence:${channelName}`)

  useEffect(() => {
    if (!enabled || !userId) return

    const supabase = getSupabaseClient()
    const channel = supabase.channel(channelRef.current, {
      config: { presence: { key: userId } },
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ user_id: userId, online_at: new Date().toISOString() })
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName, userId, enabled])
}
