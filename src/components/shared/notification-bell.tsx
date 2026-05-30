// ─── 野造 · 通知铃铛组件 ───
// Real-time notification bell with unread badge & dropdown

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Heart, MessageCircle, Star, UserPlus, Trophy, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import * as NotificationService from '@/lib/supabase/services/notification.service'
import { useNotificationsRealtime } from '@/lib/hooks/use-realtime'
import { cn } from '@/lib/utils'
import type { NotificationRow } from '@/lib/supabase/database.types'
import { useRouter } from 'next/navigation'

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  like: <Heart className="h-3.5 w-3.5 text-red-400" />,
  comment: <MessageCircle className="h-3.5 w-3.5 text-blue-400" />,
  favorite: <Star className="h-3.5 w-3.5 text-warm-500" />,
  follow: <UserPlus className="h-3.5 w-3.5 text-sage-500" />,
  challenge_complete: <Trophy className="h-3.5 w-3.5 text-warm-600" />,
  badge_earned: <Award className="h-3.5 w-3.5 text-clay-500" />,
  system: <Bell className="h-3.5 w-3.5 text-clay-400" />,
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin} 分钟前`
  if (diffHr < 24) return `${diffHr} 小时前`
  if (diffDay < 7) return `${diffDay} 天前`
  return date.toLocaleDateString('zh-CN')
}

export function NotificationBell() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { items } = await NotificationService.getNotifications(user.id, { limit: 20 })
      setNotifications(items as unknown as NotificationRow[])
      const count = await NotificationService.getUnreadNotificationCount(user.id)
      setUnreadCount(count)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated, fetchNotifications])

  // Real-time subscription
  useNotificationsRealtime(
    user?.id,
    useCallback(() => {
      fetchNotifications()
    }, [fetchNotifications]),
    isAuthenticated
  )

  const handleMarkAllRead = async () => {
    if (!user) return
    await NotificationService.markAllNotificationsAsRead(user.id)
    setUnreadCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const handleClick = async (notif: NotificationRow) => {
    if (!notif.is_read && user) {
      await NotificationService.markNotificationAsRead(notif.id)
      setUnreadCount((c) => Math.max(0, c - 1))
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      )
    }

    // Navigate based on notification type
    const data = notif.data as Record<string, string> | null
    if (data?.post_id) {
      router.push(`/community/post/${data.post_id}`)
    }
    setIsOpen(false)
  }

  if (!isAuthenticated) return null

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-clay-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-red-400 text-white text-[10px] font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 z-50 bg-white rounded-2xl border border-clay-100 shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-clay-50">
                <span className="font-medium text-sm text-clay-700">通知</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-clay-400 hover:text-clay-600 transition-colors"
                  >
                    全部已读
                  </button>
                )}
              </div>

              {/* List */}
              <ScrollArea className="max-h-[360px]">
                {loading ? (
                  <div className="p-4 text-center text-sm text-clay-400">加载中...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-8 w-8 mx-auto text-clay-200 mb-2" />
                    <p className="text-sm text-clay-400">暂无通知</p>
                  </div>
                ) : (
                  <div>
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => handleClick(notif)}
                        className={cn(
                          'w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-clay-50/50 transition-colors border-b border-clay-50 last:border-b-0',
                          !notif.is_read && 'bg-clay-50/30'
                        )}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 rounded-full bg-clay-50 flex items-center justify-center">
                            {NOTIFICATION_ICONS[notif.type] || NOTIFICATION_ICONS.system}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm', !notif.is_read ? 'text-clay-800 font-medium' : 'text-clay-600')}>
                            {notif.title}
                          </p>
                          {notif.message && (
                            <p className="text-xs text-clay-400 mt-0.5 truncate">{notif.message}</p>
                          )}
                          <p className="text-xs text-clay-300 mt-1">{getRelativeTime(notif.created_at)}</p>
                        </div>
                        {!notif.is_read && (
                          <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-clay-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-clay-50">
                <button
                  onClick={() => { router.push('/me/notifications'); setIsOpen(false) }}
                  className="w-full text-center text-xs text-clay-400 hover:text-clay-600 transition-colors py-1"
                >
                  查看全部通知
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
