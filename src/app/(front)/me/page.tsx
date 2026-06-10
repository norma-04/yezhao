// ─── 野造 · 个人中心首页 ───
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, BookOpen, Image, Calendar, Clock, Star, TrendingUp, Settings, ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/shared/section-header'
import { FeatureCard } from '@/components/shared/feature-card'
import { Skeleton } from '@/components/shared/loading-skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { UserProfile } from '@/data/user-center'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.replace('/auth/login?redirect=/me')
    return null
  }

  useEffect(() => {
    fetch('/api/me').then((r) => r.json()).then(setProfile).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-cream p-8"><Skeleton className="max-w-4xl mx-auto h-96 rounded-3xl" /></div>
  if (!profile) return <div className="min-h-screen bg-cream flex items-center justify-center text-clay-500">加载失败</div>

  const { stats } = profile
  const statCards = [
    { icon: BookOpen, label: '完成教程', value: stats.completed_tutorials, color: 'sage' as const },
    { icon: Clock, label: '学习时长', value: `${stats.total_hours}h`, color: 'clay' as const },
    { icon: Heart, label: '收藏', value: stats.favorites_count, color: 'warm' as const },
    { icon: Image, label: '作品', value: stats.works_count, color: 'clay' as const },
    { icon: Star, label: '连续打卡', value: `${stats.streak_days}天`, color: 'sage' as const },
    { icon: TrendingUp, label: '获赞', value: stats.total_likes, color: 'warm' as const },
  ]

  const quickLinks = [
    { icon: Heart, label: '我的收藏', href: '/me/favorites', desc: `${stats.favorites_count} 项收藏` },
    { icon: BookOpen, label: '学习进度', href: '/me/learning', desc: `${stats.completed_tutorials} 个完成` },
    { icon: Image, label: '我的作品', href: '/me/works', desc: `${stats.works_count} 件作品` },
    { icon: Calendar, label: '打卡挑战', href: '/me/challenges', desc: `连续 ${stats.streak_days} 天` },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-clay-500 via-clay-400 to-warm-400 py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
        <div className="mx-auto max-w-4xl px-4 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 lg:h-24 lg:w-24 ring-4 ring-white/30">
              <AvatarFallback className="bg-white/20 text-white text-2xl lg:text-3xl">{profile.nickname[0]}</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl lg:text-3xl font-semibold">{profile.nickname}</h1>
                <Badge className="bg-white/20 text-white border-white/30">{profile.level_name}</Badge>
              </div>
              <p className="mt-1.5 text-white/70 text-sm max-w-md">{profile.bio}</p>
              <p className="mt-2 text-white/50 text-xs">Lv.{profile.level} · 加入于 {profile.joined_at}</p>
            </div>
            <Link href="/me/settings" className="sm:ml-auto">
              <Button variant="outline" size="sm" className="rounded-full border-white/30 text-white hover:bg-white/10">
                <Settings className="h-4 w-4 mr-1" /> 编辑资料
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="relative -mt-8 mx-auto max-w-4xl px-4 lg:px-8">
        <StaggerContainer>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {statCards.map((s) => (
              <StaggerItem key={s.label}>
                <div className="rounded-2xl bg-white border border-clay-100 p-4 text-center card-hover">
                  <s.icon className="h-5 w-5 mx-auto mb-1.5 text-clay-400" />
                  <p className="font-serif text-xl font-semibold text-clay-800">{s.value}</p>
                  <p className="text-xs text-clay-400 mt-0.5">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Quick Links */}
      <section className="py-10 lg:py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <FadeUp>
            <SectionHeader title="快捷入口" size="sm" />
          </FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl bg-white border border-clay-100 p-5 card-hover h-full">
                  <div className="w-10 h-10 rounded-xl bg-clay-50 flex items-center justify-center mb-3">
                    <link.icon className="h-5 w-5 text-clay-500" />
                  </div>
                  <h3 className="font-serif font-medium text-clay-800 text-sm">{link.label}</h3>
                  <p className="text-xs text-clay-400 mt-1">{link.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-clay-500"><span>查看</span><ArrowRight className="h-3 w-3" /></div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Progress */}
      <section className="py-8 lg:py-10 bg-clay-50/40">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <FadeUp>
            <SectionHeader title="📖 最近学习" size="sm" action={<Link href="/me/learning"><Button variant="ghost" size="sm" className="rounded-full text-clay-500">查看全部 →</Button></Link>} />
          </FadeUp>
          <div className="space-y-3">
            {[
              { title: '初学者藤编收纳篮', progress: 75, time: '2天前', slug: 'beginner-weaving-basket' },
              { title: '法式刺绣入门：叶片胸针', progress: 50, time: '5天前', slug: 'french-embroidery-brooch' },
            ].map((t) => (
              <Link key={t.slug} href={`/tutorials/${t.slug}`}>
                <div className="rounded-xl bg-white border border-clay-100 p-4 flex items-center gap-4 card-hover">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clay-100 to-warm-50 flex items-center justify-center shrink-0">📖</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-clay-800 text-sm truncate">{t.title}</h4>
                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-clay-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full transition-all" style={{ width: `${t.progress}%` }} />
                      </div>
                      <span className="text-xs text-clay-400">{t.progress}%</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full shrink-0"><Play className="h-3 w-3 mr-0.5" /> 继续</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
