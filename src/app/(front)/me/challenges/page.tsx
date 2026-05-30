// ─── 野造 · 打卡挑战 ───
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy, Medal, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SectionHeader } from '@/components/shared/section-header'
import { Skeleton } from '@/components/shared/loading-skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import type { ChallengeData, BadgeData, CheckInRecord, LeaderboardUser } from '@/data/user-center'
import { cn } from '@/lib/utils'

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([])
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('month')

  useEffect(() => {
    fetch('/api/me/challenges').then((r) => r.json()).then((d) => {
      setChallenges(d.challenges)
      setBadges(d.badges)
      setCheckIns(d.checkIns)
      setLeaderboard(d.leaderboard)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-cream p-6"><Skeleton className="max-w-4xl mx-auto h-96 rounded-2xl" /></div>

  const earnedBadges = badges.filter((b) => b.earned)
  const unearnedBadges = badges.filter((b) => !b.earned)

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-6">
        <FadeUp><SectionHeader title="🔥 打卡挑战" size="sm" /></FadeUp>

        {/* Active Challenges */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {challenges.map((ch) => (
            <motion.div key={ch.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl bg-white border border-clay-100 p-5 lg:p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{ch.icon}</span>
                <div className="flex-1">
                  <h3 className="font-serif font-medium text-clay-800">{ch.title}</h3>
                  <p className="text-sm text-clay-500 mt-0.5">{ch.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-clay-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-clay-500 to-warm-400 rounded-full" style={{ width: `${(ch.completed_days / ch.target_days) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-clay-600">{ch.completed_days}/{ch.target_days}天</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-clay-400 flex items-center gap-1"><Flame className="h-3 w-3 text-warm-500" /> 连续 {ch.current_streak} 天</span>
                    <Badge variant="secondary" className="text-xs">截止 {ch.end_date}</Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calendar Heatmap */}
        <section className="mb-10">
          <h3 className="font-serif font-medium text-clay-700 mb-4">📅 本月打卡记录</h3>
          <div className="rounded-2xl bg-white border border-clay-100 p-5 lg:p-6">
            <div className="grid grid-cols-7 gap-1.5 lg:gap-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const record = checkIns[i]
                const level = record ? (record.hours >= 2 ? 3 : record.hours >= 1 ? 2 : 1) : 0
                return (
                  <div key={i} className={cn(
                    'aspect-square rounded-lg flex items-center justify-center text-[10px] lg:text-xs',
                    level === 0 ? 'bg-clay-50 text-clay-300' :
                    level === 1 ? 'bg-clay-200 text-clay-500' :
                    level === 2 ? 'bg-clay-400 text-white' :
                    'bg-clay-600 text-white',
                  )}>{i + 1}</div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-clay-400">
              <span>少</span>
              {[0,1,2,3].map((l) => <div key={l} className={cn('w-4 h-4 rounded', l===0?'bg-clay-50':l===1?'bg-clay-200':l===2?'bg-clay-400':'bg-clay-600')} />)}
              <span>多</span>
            </div>
          </div>
        </section>

        {/* Badge Wall */}
        <section className="mb-10">
          <h3 className="font-serif font-medium text-clay-700 mb-4 flex items-center gap-2"><Trophy className="h-4 w-4 text-warm-500" /> 勋章墙 ({earnedBadges.length}/{badges.length})</h3>
          <StaggerContainer>
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-3">
              {badges.map((b) => (
                <StaggerItem key={b.id}>
                  <div className={cn(
                    'rounded-2xl p-4 text-center transition-all',
                    b.earned ? 'bg-white border border-clay-100 card-hover' : 'bg-clay-50 border border-clay-100/50 opacity-50',
                  )}>
                    <span className="text-3xl">{b.icon}</span>
                    <p className="text-xs font-medium text-clay-700 mt-1.5">{b.name}</p>
                    {b.earned && b.earned_at && <p className="text-[10px] text-clay-400 mt-0.5">{b.earned_at}</p>}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>

        {/* Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-medium text-clay-700 flex items-center gap-2"><Crown className="h-4 w-4 text-warm-500" /> 排行榜</h3>
            <div className="flex gap-1 bg-clay-50 rounded-full p-0.5">
              {['week', 'month'].map((t) => (
                <button key={t} onClick={() => setActiveTab(t as 'week' | 'month')} className={cn('px-3 py-1 text-xs rounded-full transition-colors', activeTab === t ? 'bg-white text-clay-700 shadow-sm' : 'text-clay-400')}>
                  {t === 'week' ? '周榜' : '月榜'}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-clay-100 overflow-hidden">
            {leaderboard.slice(0, 8).map((u, i) => (
              <div key={i} className={cn('flex items-center gap-3 px-5 py-3', i < 7 && 'border-b border-clay-50')}>
                <span className={cn('w-7 text-center text-sm font-bold', u.rank <= 3 ? 'text-warm-500' : 'text-clay-400')}>
                  {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : u.rank}
                </span>
                <Avatar className="h-7 w-7"><AvatarFallback className="text-xs bg-clay-200">{u.nickname[0]}</AvatarFallback></Avatar>
                <span className="flex-1 text-sm text-clay-700">{u.nickname}</span>
                <span className="text-xs text-clay-400">{u.days}天 · {u.hours}h</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
