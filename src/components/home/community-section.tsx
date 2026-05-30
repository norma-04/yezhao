// ─── 野造 · Community Showcase Section ───
// 布局: Masonry 瀑布流 · Pinterest 风格作品墙

'use client'

import Link from 'next/link'
import { Heart, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SectionHeader } from '@/components/shared/section-header'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import { cn } from '@/lib/utils'

// Mock community posts
const posts = [
  { id: 'p1', title: '藤编收纳篮', image: null, cat: 'weaving', emoji: '🧺', author: '手工小白', likes: 238, comments: 15, height: 'row-span-1' },
  { id: 'p3', title: '木勺雕刻合集', image: null, cat: 'woodwork', emoji: '🥄', author: '木木夕', likes: 189, comments: 22, height: 'row-span-2' },
  { id: 'p7', title: '法式刺绣团扇', image: null, cat: 'embroidery', emoji: '🌸', author: '绣花娘', likes: 345, comments: 18, height: 'row-span-1' },
  { id: 'p9', title: '燕尾榫首饰盒', image: null, cat: 'woodwork', emoji: '📦', author: '木头人', likes: 420, comments: 25, height: 'row-span-1' },
  { id: 'p15', title: '植鞣皮养色记录', image: null, cat: 'leather', emoji: '👝', author: '养皮人', likes: 890, comments: 56, height: 'row-span-2' },
  { id: 'p6', title: '五月打卡挑战', image: null, cat: 'other', emoji: '🏅', author: '野造小助手', likes: 890, comments: 67, height: 'row-span-1' },
]

const catGradients: Record<string, string> = {
  weaving: 'from-amber-100 to-orange-100',
  leather: 'from-stone-200 to-amber-100',
  woodwork: 'from-amber-100 to-yellow-100',
  embroidery: 'from-green-50 to-emerald-100',
  clay: 'from-rose-100 to-pink-100',
  other: 'from-purple-50 to-violet-100',
}

export function CommunitySection() {
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

        {/* Masonry Grid */}
        <div className="columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              className="break-inside-avoid"
            >
              <Link href={`/community/post/${post.id}`} className="block group">
                <div className="rounded-2xl bg-white overflow-hidden card-hover">
                  {/* Image area */}
                  <div className={cn(
                    'flex items-center justify-center text-5xl lg:text-6xl',
                    'bg-gradient-to-br',
                    catGradients[post.cat],
                    post.height === 'row-span-2' ? 'aspect-[3/4]' : 'aspect-[4/3]',
                  )}>
                    <span className="opacity-30">{post.emoji}</span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-clay-800 text-sm group-hover:text-clay-600 transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-clay-200 text-clay-500">{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-clay-400">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-clay-400">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
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
      </div>
    </section>
  )
}
