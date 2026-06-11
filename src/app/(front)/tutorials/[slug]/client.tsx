// ─── 野造 · 教程详情 Client Component ───
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Clock, User, Share2, CheckCircle2, Circle, ChevronLeft, ChevronRight,
  ShoppingCart, BookOpen, Play, MessageSquare, Send, ArrowLeft, Package, AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SectionHeader } from '@/components/shared/section-header'
import { TutorialCard } from '@/components/shared/tutorial-card'
import { DifficultyBadge } from '@/components/shared/difficulty-badge'
import { CategoryBadge } from '@/components/shared/category-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'
import type { Tutorial, Author } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'

interface CommentData {
  id: string; author: { name: string; avatar: string | null }; content: string
  createdAt: string; parentId: string | null
}

export function TutorialDetailClient({ tutorial, related }: { tutorial: Tutorial; related: Tutorial[] }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(tutorial.favorites_count)
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([])
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [comments, setComments] = useState<CommentData[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [progress, setProgress] = useState(0)

  // Fetch progress
  useEffect(() => {
    fetch(`/api/progress?tutorial=${tutorial.slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.completedStepIds) setCompletedStepIds(d.completedStepIds)
      })
      .catch(() => {})
  }, [tutorial.slug])

  // Fetch comments
  useEffect(() => {
    fetch(`/api/comments?tutorial=${tutorial.slug}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {})
  }, [tutorial.slug])

  useEffect(() => {
    setProgress(tutorial.steps.length > 0 ? Math.round((completedStepIds.length / tutorial.steps.length) * 100) : 0)
  }, [completedStepIds, tutorial.steps.length])

  const toggleStep = (stepId: string) => {
    const newCompleted = completedStepIds.includes(stepId)
      ? completedStepIds.filter((id) => id !== stepId)
      : [...completedStepIds, stepId]
    setCompletedStepIds(newCompleted)
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorialSlug: tutorial.slug, tutorialTitle: tutorial.title, stepId, totalSteps: tutorial.steps.length }),
    }).catch(() => {})
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    setFavoriteCount((c) => isFavorited ? c - 1 : c + 1)
    if (!isFavorited) {
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType: 'tutorial', itemId: tutorial.slug, itemTitle: tutorial.title }),
      })
    }
  }

  const handleComment = () => {
    if (!newComment.trim()) return
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorialSlug: tutorial.slug, content: newComment.trim(), parentId: replyTo }),
    })
      .then((r) => r.json())
      .then((c) => {
        setComments((prev) => [...prev, c])
        setNewComment('')
        setReplyTo(null)
      })
  }

  const handleReply = (parentId: string) => {
    if (!replyText.trim()) return
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorialSlug: tutorial.slug, content: replyText.trim(), parentId }),
    })
      .then((r) => r.json())
      .then((c) => {
        setComments((prev) => [...prev, c])
        setReplyText('')
        setReplyTo(null)
      })
  }

  const topComments = comments.filter((c) => !c.parentId)
  const replies = (parentId: string) => comments.filter((c) => c.parentId === parentId)

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-clay-500">
          <Link href="/" className="hover:text-clay-700">首页</Link>
          <span>/</span>
          <Link href="/tutorials" className="hover:text-clay-700">学教程</Link>
          <span>/</span>
          <Link href={`/tutorials?category=${tutorial.category}`} className="hover:text-clay-700">
            {CATEGORY_LABELS[tutorial.category]}
          </Link>
          <span>/</span>
          <span className="text-clay-700 truncate">{tutorial.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* ── Main Content (2 cols) ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-video rounded-2xl overflow-hidden bg-black"
            >
              {tutorial.video_url ? (
                tutorial.video_url.includes('bilibili.com') ? (
                  <iframe
                    src={
                      tutorial.video_url.includes('player.bilibili.com')
                        ? tutorial.video_url
                        : tutorial.video_url.replace(
                            /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/([a-zA-Z0-9]+).*/,
                            'https://player.bilibili.com/player.html?bvid=$1',
                          )
                    }
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                    title={tutorial.title}
                  />
                ) : (
                  <video
                    src={tutorial.video_url}
                    className="w-full h-full"
                    controls
                    playsInline
                    preload="metadata"
                  />
                )
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-clay-200 via-warm-100 to-clay-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/60 backdrop-blur flex items-center justify-center mx-auto shadow-lg">
                      <Play className="h-8 w-8 text-clay-500 ml-1" />
                    </div>
                    <p className="mt-3 text-clay-500 text-sm">暂无视频</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Title & Meta */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <CategoryBadge category={tutorial.category} />
                <DifficultyBadge difficulty={tutorial.difficulty} />
                <Badge variant="secondary" className="text-xs">{tutorial.steps.length}个步骤</Badge>
              </div>
              <h1 className="font-serif text-2xl lg:text-3xl xl:text-4xl font-semibold text-clay-800 leading-tight">
                {tutorial.title}
              </h1>
              <p className="mt-3 text-clay-500 leading-relaxed">{tutorial.description}</p>

              <div className="flex flex-wrap items-center gap-4 lg:gap-6 mt-5 pt-5 border-t border-clay-100">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-clay-200 text-clay-600 text-sm">{tutorial.author.nickname[0]}</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-medium text-clay-700">{tutorial.author.nickname}</p>
                    <p className="text-xs text-clay-400">{tutorial.created_at}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-clay-500">
                  <Clock className="h-4 w-4" /> {tutorial.duration_minutes} 分钟
                </div>
                <div className="flex items-center gap-1 text-sm text-clay-500">
                  <User className="h-4 w-4" /> {tutorial.learners_count?.toLocaleString() ?? 0} 人在学
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    onClick={toggleFavorite}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      isFavorited ? 'bg-red-50 text-red-500' : 'bg-clay-50 text-clay-500 hover:bg-clay-100',
                    )}
                  >
                    <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
                    {favoriteCount}
                  </button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              {progress > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-clay-500">学习进度</span>
                    <span className="text-xs font-medium text-clay-600">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-clay-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Materials checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-clay-100 p-5 lg:p-6"
            >
              <SectionHeader title="📦 材料清单" description="开始前请准备好以下材料" size="sm" />
              <div className="space-y-3">
                {tutorial.materials.map((m) => (
                  <div key={m.id} className="flex items-start gap-4 p-3 rounded-xl bg-clay-50/50 hover:bg-clay-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white border border-clay-200 flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-clay-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-clay-800 text-sm">{m.name}</span>
                        <span className="text-xs text-clay-400">{m.amount}</span>
                      </div>
                      <p className="text-xs text-clay-500 mt-0.5">{m.note}</p>
                    </div>
                    {m.purchase_url && (
                      <Link href={m.purchase_url}>
                        <Button size="sm" variant="outline" className="rounded-full text-xs shrink-0">
                          <ShoppingCart className="h-3 w-3 mr-1" /> 购买
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step-by-step Tutorial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <SectionHeader title="📖 分步教学" description={`共 ${tutorial.steps.length} 个步骤`} size="sm" />
              <div className="space-y-1">
                {tutorial.steps.map((step, i) => {
                  const isCompleted = completedStepIds.includes(step.id)
                  const isActive = i === activeStepIndex
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className={cn(
                        'rounded-2xl border transition-all duration-200 overflow-hidden',
                        isActive ? 'border-clay-300 bg-white shadow-sm' : 'border-transparent bg-transparent',
                      )}
                    >
                      <button
                        onClick={() => setActiveStepIndex(isActive ? -1 : i)}
                        className="w-full flex items-start gap-4 p-4 lg:p-5 text-left"
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleStep(step.id) }}
                          className="shrink-0 mt-0.5"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-sage-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-clay-300" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-clay-100 text-clay-600 text-xs font-medium shrink-0">
                              {step.order}
                            </span>
                            <h4 className={cn('font-medium text-sm lg:text-base', isCompleted ? 'text-clay-400 line-through' : 'text-clay-800')}>
                              {step.title}
                            </h4>
                          </div>
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 ml-14">
                                  <div className="aspect-video rounded-xl bg-gradient-to-br from-clay-100 to-warm-50 flex items-center justify-center mb-3">
                                    <span className="text-clay-400 text-sm">步骤 {step.order} 示意图</span>
                                  </div>
                                  <p className="text-sm text-clay-600 leading-relaxed">{step.description}</p>
                                  <div className="mt-3 flex items-center gap-4">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleStep(step.id) }}
                                      className={cn(
                                        'text-xs font-medium px-3 py-1.5 rounded-full transition-colors',
                                        isCompleted
                                          ? 'bg-sage-100 text-sage-600'
                                          : 'bg-clay-100 text-clay-600 hover:bg-clay-200',
                                      )}
                                    >
                                      {isCompleted ? '✓ 已完成' : '标记完成'}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Notes */}
            {tutorial.notes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-warm-50 border border-warm-200 rounded-2xl p-5 lg:p-6"
              >
                <h3 className="font-serif font-medium text-warm-800 flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4" /> 注意事项
                </h3>
                <ul className="space-y-2">
                  {tutorial.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-warm-700">
                      <span className="text-warm-400 mt-0.5">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Related Tutorials */}
            {related.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SectionHeader title="相关推荐" size="sm" />
                <div className="grid sm:grid-cols-2 gap-4">
                  {related.map((r) => (
                    <TutorialCard
                      key={r.id}
                      tutorial={{
                        id: r.slug,
                        title: r.title,
                        cover_url: r.cover_url,
                        category: r.category,
                        difficulty: r.difficulty,
                        duration_minutes: r.duration_minutes,
                        author: r.author,
                        favorites_count: r.favorites_count,
                        steps: r.steps.length,
                      }}
                      variant="horizontal"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Sidebar (1 col) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Step Navigator */}
              <div className="bg-white rounded-2xl border border-clay-100 p-5">
                <h4 className="font-serif font-medium text-clay-800 mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> 步骤导航
                </h4>
                <nav className="space-y-1">
                  {tutorial.steps.map((step, i) => {
                    const isCompleted = completedStepIds.includes(step.id)
                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          setActiveStepIndex(i)
                          document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                          i === activeStepIndex ? 'bg-clay-50 text-clay-700 font-medium' : 'text-clay-500 hover:text-clay-600 hover:bg-clay-50/50',
                        )}
                      >
                        <span className={cn(
                          'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium shrink-0',
                          isCompleted ? 'bg-sage-200 text-sage-700' : 'bg-clay-100 text-clay-500',
                        )}>
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.order}
                        </span>
                        <span className={cn('truncate', isCompleted && 'line-through text-clay-400')}>{step.title}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-clay-100 p-5">
                <h4 className="font-serif font-medium text-clay-800 mb-3">教程信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-clay-500">难度</span><span className="text-clay-700">{tutorial.difficulty === 'beginner' ? '入门' : tutorial.difficulty === 'intermediate' ? '进阶' : '挑战'}</span></div>
                  <div className="flex justify-between"><span className="text-clay-500">时长</span><span className="text-clay-700">{tutorial.duration_minutes} 分钟</span></div>
                  <div className="flex justify-between"><span className="text-clay-500">步骤</span><span className="text-clay-700">{tutorial.steps.length} 步</span></div>
                  <div className="flex justify-between"><span className="text-clay-500">材料</span><span className="text-clay-700">{tutorial.materials.length} 种</span></div>
                  <div className="flex justify-between"><span className="text-clay-500">收藏</span><span className="text-clay-700">{favoriteCount}</span></div>
                  <div className="flex justify-between"><span className="text-clay-500">学习者</span><span className="text-clay-700">{tutorial.learners_count?.toLocaleString() ?? 0}</span></div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Comments ── */}
        <div className="mt-12 max-w-3xl">
          <SectionHeader
            title={`💬 评论 (${comments.length})`}
            size="sm"
          />

          {/* Comment form */}
          <div className="bg-white rounded-2xl border border-clay-100 p-5 mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享你的学习心得..."
              className="w-full h-24 rounded-xl border border-clay-200 p-4 text-sm text-clay-700 placeholder:text-clay-400 focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/20 resize-none"
            />
            <div className="flex justify-end mt-3">
              <Button onClick={handleComment} disabled={!newComment.trim()} className="rounded-full">
                <Send className="h-4 w-4 mr-1.5" /> 发表评论
              </Button>
            </div>
          </div>

          {/* Comment list */}
          <div className="space-y-4">
            {topComments.length === 0 ? (
              <p className="text-center text-clay-400 py-8 text-sm">还没有评论，来第一个评论吧</p>
            ) : (
              topComments.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl border border-clay-100 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-7 w-7"><AvatarFallback className="text-xs bg-clay-200">{c.author.name[0]}</AvatarFallback></Avatar>
                    <span className="text-sm font-medium text-clay-700">{c.author.name}</span>
                    <span className="text-xs text-clay-400">{c.createdAt}</span>
                  </div>
                  <p className="text-sm text-clay-600 ml-10">{c.content}</p>
                  <button
                    onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                    className="ml-10 mt-2 text-xs text-clay-400 hover:text-clay-600"
                  >
                    回复
                  </button>

                  {/* Replies */}
                  {replies(c.id).map((r) => (
                    <div key={r.id} className="ml-10 mt-3 pl-4 border-l-2 border-clay-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-clay-200">{r.author.name[0]}</AvatarFallback></Avatar>
                        <span className="text-sm font-medium text-clay-700">{r.author.name}</span>
                      </div>
                      <p className="text-sm text-clay-600">{r.content}</p>
                    </div>
                  ))}

                  {/* Reply form */}
                  {replyTo === c.id && (
                    <div className="ml-10 mt-3 flex gap-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="写下回复..."
                        className="flex-1 h-9 rounded-full border border-clay-200 px-4 text-sm focus:border-clay-400 focus:outline-none"
                      />
                      <Button size="sm" className="rounded-full" onClick={() => handleReply(c.id)} disabled={!replyText.trim()}>
                        发送
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-clay-200/60 lg:hidden">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <button
            onClick={toggleFavorite}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm', isFavorited ? 'text-red-500' : 'text-clay-600')}
          >
            <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} /> {favoriteCount}
          </button>
          <div className="text-xs text-clay-400">{completedStepIds.length}/{tutorial.steps.length} 步骤完成</div>
          <Button size="sm" className="rounded-full">
            <Share2 className="h-3.5 w-3.5 mr-1" /> 分享
          </Button>
        </div>
      </div>
    </div>
  )
}
