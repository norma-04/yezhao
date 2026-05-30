// ─── 野造 · 我的作品 ───
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/shared/section-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/shared/loading-skeleton'
import { FadeUp } from '@/components/shared/animated-container'
import type { CommunityPost } from '@/data/community'
import { cn } from '@/lib/utils'

interface WorksStats { total: number; total_likes: number; total_favorites: number; total_comments: number }

export default function WorksPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [stats, setStats] = useState<WorksStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me/works').then((r) => r.json()).then((d) => {
      setPosts(d.items)
      setStats(d.stats)
    }).finally(() => setLoading(false))
  }, [])

  const handleDelete = (slug: string) => {
    if (!confirm('确定删除这件作品吗？')) return
    setPosts((prev) => prev.filter((p) => p.slug !== slug))
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-6">
        <FadeUp>
          <SectionHeader
            title="🎨 我的作品"
            description={stats ? `${stats.total} 件作品 · ${stats.total_likes} 赞 · ${stats.total_comments} 评论` : ''}
            size="sm"
            action={<Link href="/community/create"><Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1" /> 发布新作品</Button></Link>}
          />
        </FadeUp>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>
        ) : posts.length === 0 ? (
          <EmptyState title="还没有发布作品" description="去分享你的第一个作品吧" action={{ label: '发布作品', onClick: () => window.location.href = '/community/create' }} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <div className="rounded-2xl bg-white border border-clay-100 overflow-hidden card-hover group">
                  <Link href={`/community/post/${post.slug}`}>
                    <div className={cn('h-40 flex items-center justify-center text-4xl bg-gradient-to-br', post.topic === 'showcase' ? 'from-amber-100 to-orange-100' : post.topic === 'newbie' ? 'from-green-50 to-emerald-100' : 'from-blue-50 to-sky-100')}>
                      <span className="opacity-20">{{ showcase: '🎨', newbie: '🔰', review: '📊', activity: '🎪' }[post.topic] || '✨'}</span>
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="text-xs mb-1.5">{{ showcase: '成品展示', newbie: '新手避坑', review: '材料测评', activity: '活动专区' }[post.topic]}</Badge>
                      <h3 className="font-serif font-medium text-clay-800 text-sm line-clamp-1">{post.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-clay-400">
                        <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{post.likes_count}</span>
                        <span className="flex items-center gap-0.5"><MessageCircle className="h-3 w-3" />{post.comments_count}</span>
                        <span className="flex items-center gap-0.5"><Bookmark className="h-3 w-3" />{post.favorites_count}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/community/post/${post.slug}`}><Button size="sm" variant="ghost" className="rounded-full h-7 text-xs"><Eye className="h-3 w-3 mr-1" />查看</Button></Link>
                    <Button size="sm" variant="ghost" className="rounded-full h-7 text-xs text-red-400" onClick={() => handleDelete(post.slug)}><Trash2 className="h-3 w-3 mr-1" />删除</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
