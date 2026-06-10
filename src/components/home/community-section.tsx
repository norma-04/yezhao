// ─── 野造 · Community Showcase Section ───
// 布局: Masonry 瀑布流 · Pinterest 风格作品墙
// 数据: 从 Supabase API 获取热门社区帖子

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SectionHeader } from '@/components/shared/section-header'
import { FadeUp } from '@/components/shared/animated-container'
import { cn } from '@/lib/utils'

interface ApiPost {
  id: string
  slug: string
  title: string
  images: string[] | null
  topic: string
  likes_count: number
  comments_count: number
  author: {
    id: string
    nickname: string
    avatar_url: string | null
  } | null
}

const catGradients: Record<string, string> = {
  weaving: 'from-amber-100 to-orange-100',
  leather: 'from-stone-200 to-amber-100',
  woodwork: 'from-amber-100 to-yellow-100',
  embroidery: 'from-green-50 to-emerald-100',
  clay: 'from-rose-100 to-pink-100',
  other: 'from-purple-50 to-violet-100',
}

const topicEmoji: Record<string, string> = {
  showcase: '🎨',
  question: '❓',
  challenge: '🏅',
  discussion: '💬',
}

export function CommunitySection() {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/community?sort=popular&limit=6')
      .then((r) => r.json())
      .then((data) => {
        const items = data.items || data || []
        setPosts(items)
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  // Assign pseudo-random heights for masonry visual variety (based on id hash)
  const getHeight = (id: string) => {
    const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return n % 3 === 0 ? 'row-span-2' : 'row-span-1'
  }

  // Get the first image or null
  const getImage = (post: ApiPost) => {
    if (post.images && post.images.length > 0) return post.images[0]
    return null
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeUp>
          <SectionHeader
            title="来自创作者们的灵感"
            description="发现社区中最受欢迎的手作作品"
            action={
              <Link href="/community" className="inline-flex items-center gap-1 text-sm font-medium text-clay-600 hover:text-clay-700 transition-colors">
                探索社区 →
              </Link>
            }
          />
        </FadeUp>

        {loading ? (
          <div className="columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="break-inside-avoid">
                <div className={cn(
                  'rounded-2xl bg-clay-100 animate-pulse',
                  i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]',
                )} />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-clay-100 rounded animate-pulse w-3/4" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-clay-100 rounded animate-pulse w-1/3" />
                    <div className="h-3 bg-clay-100 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-clay-400 py-12">暂无作品展示，敬请期待</p>
        ) : (
          <>
            {/* Masonry Grid */}
            <div className="columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
              {posts.map((post, i) => {
                const image = getImage(post)
                const height = getHeight(post.id)
                const emoji = topicEmoji[post.topic] || '✨'

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                    className="break-inside-avoid"
                  >
                    <Link href={`/community/post/${post.slug}`} className="block group">
                      <div className="rounded-2xl bg-white overflow-hidden card-hover">
                        {/* Image area */}
                        {image ? (
                          <div className={cn(
                            'relative overflow-hidden',
                            height === 'row-span-2' ? 'aspect-[3/4]' : 'aspect-[4/3]',
                          )}>
                            <Image
                              src={image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className={cn(
                            'flex items-center justify-center text-5xl lg:text-6xl',
                            'bg-gradient-to-br',
                            catGradients[post.topic] || catGradients.other,
                            height === 'row-span-2' ? 'aspect-[3/4]' : 'aspect-[4/3]',
                          )}>
                            <span className="opacity-30">{emoji}</span>
                          </div>
                        )}

                        {/* Info */}
                        <div className="p-4">
                          <h3 className="font-medium text-clay-800 text-sm group-hover:text-clay-600 transition-colors line-clamp-1">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-5 w-5">
                                {post.author?.avatar_url && <AvatarImage src={post.author.avatar_url} />}
                                <AvatarFallback className="text-[10px] bg-clay-200 text-clay-500">
                                  {post.author?.nickname?.[0] || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-clay-400">{post.author?.nickname || '未知'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-clay-400">
                              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likes_count}</span>
                              <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{post.comments_count}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* View more */}
            <div className="mt-10 text-center">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-clay-200 text-clay-600 hover:bg-clay-50 transition-colors text-sm font-medium"
              >
                查看更多作品 →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
