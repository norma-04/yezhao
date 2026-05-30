// ─── 野造 · 社区首页 ───
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Plus, Star, Flame, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SectionHeader } from '@/components/shared/section-header'
import { FilterPanel } from '@/components/shared/filter-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import { Skeleton } from '@/components/shared/loading-skeleton'
import { topics, creators, challenges } from '@/data/community'
import type { CommunityPost, Creator, Challenge } from '@/data/community'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { key: 'latest', label: '最新' },
  { key: 'popular', label: '最热' },
  { key: 'favorites', label: '最多收藏' },
]

const topicCatEmoji: Record<string, string> = { showcase: '🎨', newbie: '🔰', review: '📊', activity: '🎪' }

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTopic, setActiveTopic] = useState('all')
  const [sort, setSort] = useState('latest')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/community?topic=${activeTopic}&sort=${sort}&limit=20`)
      .then((r) => r.json())
      .then((d) => setPosts(d.items))
      .finally(() => setLoading(false))
  }, [activeTopic, sort])

  const topPosts = posts.slice(0, 6)  // Masonry featured
  const latestPosts = posts.slice(6)   // Rest in list

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-clay-50 via-cream to-warm-50 py-12 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <FadeUp>
            <div className="max-w-2xl">
              <h1 className="font-serif text-3xl lg:text-5xl font-semibold text-clay-800 leading-tight">
                把你的创作<br />分享给更多人
              </h1>
              <p className="mt-4 text-lg text-clay-500">每一件作品，都值得被看见。</p>
              <div className="mt-6">
                <Link href="/community/create">
                  <Button size="lg" className="rounded-full bg-clay-600 hover:bg-clay-700 text-white px-8">
                    <Plus className="h-4 w-4 mr-1.5" /> 发布作品
                  </Button>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Topic Chips + Sort */}
      <div className="sticky top-14 lg:top-16 z-20 bg-cream/90 backdrop-blur border-b border-clay-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <FilterPanel
            options={[{ key: 'all', label: '全部', icon: '🌟' }, ...topics.map((t) => ({ key: t.slug, label: t.name, icon: t.icon }))]}
            selected={activeTopic}
            onSelect={setActiveTopic}
            variant="pill"
          />
          <div className="ml-auto shrink-0 hidden lg:block">
            <FilterPanel options={SORT_OPTIONS} selected={sort} onSelect={setSort} variant="chip" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
        {loading ? (
          <div className="columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="break-inside-avoid">
                <Skeleton className={cn('w-full rounded-2xl', i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]')} />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState title="该话题还没有作品" description="来发布第一个作品吧！" action={{ label: '发布作品', onClick: () => window.location.href = '/community/create' }} />
        ) : (
          <>
            {/* Masonry Grid */}
            <div className="columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                  className="break-inside-avoid"
                >
                  <Link href={`/community/post/${post.slug}`} className="block group">
                    <div className="rounded-2xl bg-white overflow-hidden card-hover">
                      {/* Image */}
                      <div className={cn(
                        'flex items-center justify-center text-4xl lg:text-5xl bg-gradient-to-br',
                        post.topic === 'showcase' ? 'from-amber-100 to-orange-100' :
                        post.topic === 'newbie' ? 'from-green-50 to-emerald-100' :
                        post.topic === 'review' ? 'from-blue-50 to-sky-100' :
                        'from-rose-50 to-pink-100',
                        i % 4 === 0 ? 'aspect-[3/4]' : i % 4 === 1 ? 'aspect-square' : 'aspect-[4/3]'
                      )}>
                        <span className="opacity-30">{topicCatEmoji[post.topic] || '✨'}</span>
                      </div>

                      <div className="p-4">
                        {/* Topic tag */}
                        <Badge variant="secondary" className="text-xs mb-2">
                          {post.topic === 'showcase' ? '成品展示' : post.topic === 'newbie' ? '新手避坑' : post.topic === 'review' ? '材料测评' : '活动专区'}
                        </Badge>

                        <h3 className="font-serif font-medium text-clay-800 group-hover:text-clay-600 transition-colors line-clamp-2 text-sm leading-snug">
                          {post.title}
                        </h3>

                        {/* Author + Stats */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-clay-50">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px] bg-clay-200 text-clay-500">{post.author.nickname[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-clay-400">{post.author.nickname}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-clay-400">
                            <span className="flex items-center gap-0.5"><Heart className={cn('h-3 w-3', post.is_liked && 'fill-red-400 text-red-400')} />{post.likes_count}</span>
                            <span className="flex items-center gap-0.5"><MessageCircle className="h-3 w-3" />{post.comments_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Load more */}
            {posts.length >= 20 && (
              <div className="mt-10 text-center">
                <Button variant="outline" className="rounded-full">加载更多</Button>
              </div>
            )}
          </>
        )}

        {/* ── Creators ── */}
        <section className="mt-16 lg:mt-20">
          <FadeUp>
            <SectionHeader title="🌟 热门创作者" description="关注优秀的手作达人" />
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {creators.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white border border-clay-100 p-5 text-center card-hover"
              >
                <Avatar className="h-14 w-14 mx-auto">
                  <AvatarFallback className="bg-clay-200 text-clay-600 text-lg">{c.author.nickname[0]}</AvatarFallback>
                </Avatar>
                <h4 className="mt-3 font-medium text-clay-800 text-sm">{c.author.nickname}</h4>
                <p className="text-xs text-clay-500 mt-1">{c.specialty}</p>
                <div className="flex items-center justify-center gap-3 mt-3 text-xs text-clay-400">
                  <span>{c.works_count} 作品</span>
                  <span>{c.total_likes.toLocaleString()} 赞</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Challenges ── */}
        <section className="mt-16 lg:mt-20 bg-clay-50/40 -mx-4 lg:-mx-8 px-4 lg:px-8 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <FadeUp>
              <SectionHeader title="🎪 本月挑战活动" description="参与挑战，赢取限定勋章" />
            </FadeUp>
            <div className="grid sm:grid-cols-2 gap-5">
              {challenges.map((ch) => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-white border border-clay-100 p-6 lg:p-8 flex gap-5"
                >
                  <span className="text-4xl shrink-0">{ch.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-clay-800">{ch.title}</h3>
                    <p className="text-sm text-clay-500 mt-1">{ch.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant="secondary" className="text-xs">{ch.participants} 人参与</Badge>
                      <span className="text-xs text-clay-400">截止 {ch.end_date}</span>
                    </div>
                    <Link href="/community/create">
                      <Button size="sm" variant="outline" className="mt-3 rounded-full">参与挑战</Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FAB - Mobile create */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Link href="/community/create">
          <Button size="lg" className="rounded-full h-14 w-14 shadow-xl bg-clay-600 hover:bg-clay-700">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
