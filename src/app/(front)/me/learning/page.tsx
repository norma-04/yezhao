// ─── 野造 · 学习进度 ───
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, CheckCircle2, Clock, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/shared/section-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/shared/loading-skeleton'
import { FadeUp } from '@/components/shared/animated-container'
import type { LearningItem, UserDashboardStats } from '@/data/user-center'

export default function LearningPage() {
  const [items, setItems] = useState<LearningItem[]>([])
  const [stats, setStats] = useState<UserDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me/learning').then((r) => r.json()).then((d) => {
      setItems(d.items)
      setStats(d.stats)
    }).finally(() => setLoading(false))
  }, [])

  const inProgress = items.filter((i) => i.progress_percent < 100)
  const completed = items.filter((i) => i.progress_percent === 100)

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-6">
        <FadeUp><SectionHeader title="📖 学习进度" size="sm" /></FadeUp>

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState title="还没有开始学习" description="去选择一个教程开始你的手作之旅" action={{ label: '浏览教程', onClick: () => window.location.href = '/tutorials' }} />
        ) : (
          <>
            {/* Stats strip */}
            {stats && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Clock, label: '学习时长', value: `${stats.total_hours}h` },
                  { icon: BookOpen, label: '完成教程', value: stats.completed_tutorials },
                  { icon: TrendingUp, label: '完成率', value: `${items.length > 0 ? Math.round(stats.completed_tutorials / items.length * 100) : 0}%` },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white border border-clay-100 p-4 text-center">
                    <s.icon className="h-5 w-5 mx-auto mb-1 text-clay-400" />
                    <p className="font-serif text-lg font-semibold text-clay-800">{s.value}</p>
                    <p className="text-xs text-clay-400">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* In Progress */}
            {inProgress.length > 0 && (
              <section className="mb-10">
                <h3 className="font-serif font-medium text-clay-700 mb-4">🚧 进行中</h3>
                <div className="space-y-3">
                  {inProgress.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={`/tutorials/${item.tutorial_slug}`}>
                        <div className="rounded-xl bg-white border border-clay-100 p-4 lg:p-5 card-hover flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-clay-100 to-warm-50 flex items-center justify-center shrink-0 text-2xl">📖</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-clay-800 text-sm">{item.tutorial_title}</h4>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-clay-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full" style={{ width: `${item.progress_percent}%` }} />
                              </div>
                              <span className="text-xs text-clay-400">{item.progress_percent}%</span>
                            </div>
                            <p className="text-xs text-clay-400 mt-1.5">上次学习: {item.last_learned_at} · {item.completed_steps}/{item.total_steps} 步骤</p>
                          </div>
                          <Button size="sm" variant="outline" className="rounded-full shrink-0"><Play className="h-3 w-3 mr-0.5" /> 继续</Button>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <section>
                <h3 className="font-serif font-medium text-clay-700 mb-4">✅ 已完成</h3>
                <div className="space-y-2">
                  {completed.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link href={`/tutorials/${item.tutorial_slug}`}>
                        <div className="rounded-xl bg-sage-50/50 border border-sage-100 p-4 flex items-center gap-4">
                          <CheckCircle2 className="h-5 w-5 text-sage-500 shrink-0" />
                          <div className="flex-1">
                            <span className="text-sm text-clay-600 line-through">{item.tutorial_title}</span>
                          </div>
                          <Badge className="bg-sage-100 text-sage-600 text-xs">完成于 {item.completed_at}</Badge>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
