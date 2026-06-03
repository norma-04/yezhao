// ─── 野造 · 作品详情页 ───
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft, Send, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SectionHeader } from '@/components/shared/section-header'
import { TutorialCard } from '@/components/shared/tutorial-card'
import { Skeleton } from '@/components/shared/loading-skeleton'
import { cn } from '@/lib/utils'
import type { CommunityPost, CommunityComment } from '@/data/community'

export default function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [imageIndex, setImageIndex] = useState(0)
  const [relatedTutorials, setRelatedTutorials] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    fetch('/api/community/post/' + slug)
      .then((r) => {
        if (!r.ok) throw new Error('Post not found')
        return r.json()
      })
      .then((data) => {
        setPost(data)
        if (data.related_tutorial_slugs && data.related_tutorial_slugs.length > 0) {
          Promise.all(
            data.related_tutorial_slugs.map((s: string) =>
              fetch('/api/tutorials/' + s).then((r) => r.ok ? r.json() : null).catch(() => null)
            )
          ).then((tutorials) => setRelatedTutorials(tutorials.filter(Boolean)))
        }
        setLoading(false)
      })
      .catch(() => { setPost(null); setLoading(false) })
    fetch('/api/community/comment?post=' + slug)
      .then((r) => r.json()).then(setComments).catch(() => {})
  }, [slug])

  const handleLike = () => {
    if (!post) return
    fetch('/api/community/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postSlug: slug }) })
      .then((r) => r.json())
      .then((d) => setPost({ ...post, is_liked: d.is_liked, likes_count: d.likes_count }))
  }

  const handleFavorite = () => {
    if (!post) return
    fetch('/api/community/favorite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postSlug: slug }) })
      .then((r) => r.json())
      .then((d) => setPost({ ...post, is_favorited: d.is_favorited, favorites_count: d.favorites_count }))
  }

  const handleComment = () => {
    if (!newComment.trim()) return
    fetch('/api/community/comment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postSlug: slug, content: newComment, parent_id: replyTo }) })
      .then((r) => r.json())
      .then((c) => { setComments((prev) => [...prev, c]); setNewComment(''); setReplyTo(null) })
  }

  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center"><Skeleton className="w-full max-w-2xl h-96 rounded-2xl" /></div>
  if (!post) return <div className="min-h-screen bg-cream flex items-center justify-center text-clay-500">作品未找到</div>

  const topComments = comments.filter((c) => !c.parent_id)
  const replies = (pid: string) => comments.filter((c) => c.parent_id === pid)

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-4">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-clay-500 hover:text-clay-700">
          <ArrowLeft className="h-4 w-4" /> 回到社区
        </Link>
      </div>

      <div className="mx-auto max-w-4xl px-4 lg:px-8 pb-20">
        {/* Image Carousel */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-clay-100 to-warm-50 aspect-[16/9] lg:aspect-[2/1] flex items-center justify-center">
          <span className="text-6xl opacity-20">{{ showcase: '🎨', newbie: '🔰', review: '📊', activity: '🎪' }[post.topic] || '✨'}</span>
          {/* Carousel nav - placeholder */}
          {post.images.length > 1 && (
            <>
              <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur"><ChevronLeft className="h-5 w-5" /></button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur"><ChevronRight className="h-5 w-5" /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.images.map((_, i) => <div key={i} className={cn('h-1.5 rounded-full transition-all', i === imageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50')} />)}
              </div>
            </>
          )}
        </motion.div>

        {/* Title & Meta */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">{{ showcase: '成品展示', newbie: '新手避坑', review: '材料测评', activity: '活动专区' }[post.topic]}</Badge>
            {post.tags.slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-clay-800 leading-tight">{post.title}</h1>
          <p className="mt-4 text-clay-600 leading-relaxed">{post.content}</p>

          {/* Author row */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-clay-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarFallback className="bg-clay-200 text-clay-600">{post.author.nickname[0]}</AvatarFallback></Avatar>
              <div>
                <p className="font-medium text-clay-700 text-sm">{post.author.nickname}</p>
                <p className="text-xs text-clay-400">{post.created_at}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-full" onClick={handleFavorite}>
                <Bookmark className={cn('h-4 w-4 mr-1', post.is_favorited && 'fill-clay-500 text-clay-500')} />
                {post.favorites_count}
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Action bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center gap-4 mt-4">
          <button onClick={handleLike} className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all', post.is_liked ? 'bg-red-50 text-red-500' : 'bg-clay-50 text-clay-600 hover:bg-clay-100')}>
            <Heart className={cn('h-5 w-5', post.is_liked && 'fill-current')} /> {post.likes_count}
          </button>
          <span className="flex items-center gap-2 text-sm text-clay-500"><MessageCircle className="h-5 w-5" /> {post.comments_count}</span>
        </motion.div>

        {/* Process Steps */}
        {post.process_steps.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10">
            <SectionHeader title="📝 制作过程" size="sm" />
            <div className="space-y-3">
              {post.process_steps.map((s, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-clay-100">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-clay-100 text-clay-600 text-sm font-medium shrink-0">{i + 1}</span>
                  <div>
                    <h4 className="font-medium text-clay-800 text-sm">{s.title}</h4>
                    <p className="text-sm text-clay-500 mt-0.5">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Materials Used */}
        {post.materials_used.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-10">
            <SectionHeader title="🧵 使用材料" size="sm" />
            <div className="flex flex-wrap gap-2">
              {post.materials_used.map((m, i) => (
                m.slug ? (
                  <Link key={i} href={`/materials/${m.slug}`}>
                    <Badge className="px-3 py-1.5 text-sm cursor-pointer hover:bg-clay-100 transition-colors">{m.name}</Badge>
                  </Link>
                ) : (
                  <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm">{m.name}</Badge>
                )
              ))}
            </div>
          </motion.section>
        )}

        {/* Related Tutorials */}
        {post.related_tutorial_slugs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10">
            <SectionHeader title="📖 关联教程" size="sm" />
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedTutorials.map((t: any) => (
                <TutorialCard key={t.slug} tutorial={{ id: t.slug, title: t.title, cover_url: t.cover_url, category: t.category, difficulty: t.difficulty, duration_minutes: t.duration_minutes, author: t.author, favorites_count: t.favorites_count, steps: t.steps?.length || 0 }} variant="horizontal" />
              ))}
            </div>
          </motion.section>
        )}

        {/* Comments */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-10">
          <SectionHeader title={`💬 评论 (${comments.length})`} size="sm" />

          {/* Comment input */}
          <div className="flex gap-3 mb-6">
            <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-clay-200 text-xs">我</AvatarFallback></Avatar>
            <div className="flex-1">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="w-full h-10 rounded-full border border-clay-200 px-4 text-sm focus:border-clay-400 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              />
            </div>
            <Button size="sm" className="rounded-full" onClick={handleComment} disabled={!newComment.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Comment list */}
          <div className="space-y-3">
            {topComments.length === 0 ? (
              <p className="text-sm text-clay-400 text-center py-6">还没有评论，来第一个评论吧</p>
            ) : topComments.map((c) => (
              <div key={c.id} className="rounded-xl bg-white border border-clay-100 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-clay-200">{c.author.nickname[0]}</AvatarFallback></Avatar>
                  <span className="text-sm font-medium text-clay-700">{c.author.nickname}</span>
                  <span className="text-xs text-clay-400">{c.created_at}</span>
                </div>
                <p className="text-sm text-clay-600 ml-8">{c.content}</p>
                <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)} className="ml-8 mt-1.5 text-xs text-clay-400 hover:text-clay-600">回复</button>

                {replies(c.id).map((r) => (
                  <div key={r.id} className="ml-8 mt-2 pl-3 border-l-2 border-clay-100">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px] bg-clay-200">{r.author.nickname[0]}</AvatarFallback></Avatar>
                      <span className="text-xs font-medium text-clay-600">{r.author.nickname}</span>
                    </div>
                    <p className="text-xs text-clay-500">{r.content}</p>
                  </div>
                ))}

                {replyTo === c.id && (
                  <div className="ml-8 mt-2 flex gap-2">
                    <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="写下回复..." className="flex-1 h-8 rounded-full border border-clay-200 px-3 text-xs focus:outline-none" />
                    <Button size="sm" className="rounded-full text-xs h-8" onClick={handleComment} disabled={!replyText.trim()}>发送</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Bottom Action Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-clay-200/60 lg:hidden">
        <div className="flex items-center justify-around h-14">
          <button onClick={handleLike} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm', post.is_liked ? 'text-red-500' : 'text-clay-600')}>
            <Heart className={cn('h-5 w-5', post.is_liked && 'fill-current')} /> {post.likes_count}
          </button>
          <button onClick={handleFavorite} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-clay-600">
            <Bookmark className={cn('h-5 w-5', post.is_favorited && 'fill-current')} /> {post.favorites_count}
          </button>
          <Button size="sm" variant="outline" className="rounded-full"><Share2 className="h-4 w-4 mr-1" /> 分享</Button>
        </div>
      </div>
    </div>
  )
}
