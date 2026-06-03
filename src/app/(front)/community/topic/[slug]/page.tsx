// ─── 野造 · 话题页 ───
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SectionHeader } from '@/components/shared/section-header'
import { FilterPanel } from '@/components/shared/filter-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { FadeUp } from '@/components/shared/animated-container'
import { Skeleton } from '@/components/shared/loading-skeleton'
import { topics } from '@/data/community'
import type { CommunityPost } from '@/data/community'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { key: 'latest', label: '最新' },
  { key: 'popular', label: '最热' },
  { key: 'favorites', label: '最多收藏' },
]

const topicCatEmoji: Record<string, string> = { showcase: '🎨', newbie: '🔰', review: '📊', activity: '🎪' }

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('latest')

  const topic = topics.find((t) => t.slug === slug)
  const emoji = topicCatEmoji[slug] || '📌'

  useEffect(() => {
    setLoading(true)
    fetch(`/api/community?topic=${slug}&sort=${sort}`)
      .then((r) => r.json())
      .then((d) => setPosts(d.items))
      .finally(() => setLoading(false))
  }, [slug, sort])

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-clay-50 via-cream to-warm-50 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <FadeUp>
            <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-clay-500 hover:text-clay-700 mb-4">
              <ArrowLeft className="h-4 w-4" /> 回到社区
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{emoji}</span>
              <div>
                <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-clay-800">{topic?.name || slug}</h1>
                {topic && <p className="mt-2 text-clay-500">{topic.description}</p>}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-clay-500">{posts.length} 篇作品</p>
            <FilterPanel options={SORT_OPTIONS} selected={sort} onSelect={setSort} variant="chip" />
          </div>

          {loading ? (
            <div className="columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className={cn('w-full rounded-2xl', i % 2 === 0 ? 'aspect-[4/3]' : 'aspect-square')} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState title="该话题还没有作品" description="来发布第一个作品吧！" />
          ) : (
            <div className="columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="break-inside-avoid"
                >
                  <Link href={`/community/post/${post.slug}`} className="block group">
                    <div className="rounded-2xl bg-white overflow-hidden card-hover">
                      <div className={cn('flex items-center justify-center text-4xl bg-gradient-to-br', i % 3 === 0 ? 'from-amber-100 to-orange-100' : i % 3 === 1 ? 'from-green-50 to-emerald-100' : 'from-blue-50 to-sky-100', i % 2 === 0 ? 'aspect-[4/3]' : 'aspect-square')}>
                        <span className="opacity-30">{emoji}</span>
                      </div>
                      <div className="p-4">
                        <Badge variant="secondary" className="text-xs mb-2">{topic?.name}</Badge>
                        <h3 className="font-serif font-medium text-clay-800 group-hover:text-clay-600 text-sm line-clamp-2">{post.title}</h3>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-clay-50">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5"><AvatarFallback className="text-[10px] bg-clay-200 text-clay-500">{(post as any).author?.nickname?.[0] || '?'}</AvatarFallback></Avatar>
                            <span className="text-xs text-clay-400">{(post as any).author?.nickname || '未知'}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-clay-400">
                            <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{(post as any).likes_count || 0}</span>
                            <span className="flex items-center gap-0.5"><MessageCircle className="h-3 w-3" />{(post as any).comments_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
