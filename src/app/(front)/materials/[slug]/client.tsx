// ─── 野造 · 材料详情 Client ───
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, ArrowLeft, Check, X, ShoppingBag, Lightbulb, AlertTriangle, ChevronDown,
  ThumbsUp, ThumbsDown, BookOpen, ExternalLink, Package, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/shared/section-header'
import { TutorialCard } from '@/components/shared/tutorial-card'
import { cn } from '@/lib/utils'
import type { MaterialData } from '@/data/materials'
import type { Tutorial } from '@/lib/types'

const catLabels: Record<string, string> = { weaving: '编织', leather: '皮具', woodwork: '木工', clay: '黏土', embroidery: '刺绣', other: '其他' }
const catEmoji: Record<string, string> = { weaving: '🧶', leather: '👜', woodwork: '🪵', clay: '🏺', embroidery: '🪡', other: '✨' }

export function MaterialDetailClient({ material: m, relatedTutorials }: { material: MaterialData; relatedTutorials: Tutorial[] }) {
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]))
  const [activeAltTab, setActiveAltTab] = useState(0)

  const toggleFaq = (i: number) => {
    const next = new Set(openFaqs)
    next.has(i) ? next.delete(i) : next.add(i)
    setOpenFaqs(next)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-5xl px-4 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-clay-500">
          <Link href="/" className="hover:text-clay-700">首页</Link><span>/</span>
          <Link href="/materials" className="hover:text-clay-700">选材料</Link><span>/</span>
          <Link href={`/materials/category/${m.category}`} className="hover:text-clay-700">{catLabels[m.category]}</Link><span>/</span>
          <span className="text-clay-700 truncate">{m.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4 lg:px-8 pb-20">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-clay-100 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className={cn(
              'w-full lg:w-48 h-48 rounded-2xl shrink-0 flex items-center justify-center text-6xl',
              m.category === 'weaving' ? 'bg-gradient-to-br from-amber-100 to-orange-100' :
              m.category === 'leather' ? 'bg-gradient-to-br from-stone-200 to-amber-100' :
              m.category === 'woodwork' ? 'bg-gradient-to-br from-amber-100 to-yellow-100' :
              m.category === 'clay' ? 'bg-gradient-to-br from-rose-100 to-pink-100' :
              m.category === 'embroidery' ? 'bg-gradient-to-br from-green-50 to-emerald-100' :
              'bg-gradient-to-br from-purple-50 to-violet-100'
            )}>
              {catEmoji[m.category]}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">{catLabels[m.category]}</Badge>
                <Badge variant="secondary" className={`text-xs ${m.difficulty_level === 'beginner' ? 'bg-sage-100 text-sage-700' : m.difficulty_level === 'intermediate' ? 'bg-warm-100 text-warm-700' : 'bg-clay-100 text-clay-700'}`}>
                  {m.difficulty_level === 'beginner' ? '新手友好' : m.difficulty_level === 'intermediate' ? '进阶适用' : '专业级'}
                </Badge>
                <Badge variant="outline" className="text-xs">价格: {m.price_level}</Badge>
              </div>
              <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-clay-800">{m.name}</h1>
              <p className="mt-3 text-clay-500 leading-relaxed">{m.summary}</p>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={cn('h-4 w-4', s <= Math.round(m.rating) ? 'fill-warm-400 text-warm-400' : 'text-clay-200')} />
                  ))}
                  <span className="ml-1.5 text-sm font-medium text-clay-700">{m.rating}</span>
                </div>
                <span className="text-sm text-clay-400">· 推荐指数</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-clay-100 p-6 lg:p-8">
              <h2 className="font-serif text-xl font-semibold text-clay-800 mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-clay-500" />材料简介</h2>
              <p className="text-clay-600 leading-relaxed">{m.description}</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {m.characteristics.map((ch) => (
                  <div key={ch.label} className="rounded-xl bg-clay-50 p-4">
                    <span className="text-xs font-medium text-clay-500">{ch.label}</span>
                    <p className="text-sm text-clay-700 mt-1">{ch.value}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Pros / Cons */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid sm:grid-cols-2 gap-4">
              <div className="bg-sage-50 border border-sage-200 rounded-2xl p-5 lg:p-6">
                <h3 className="font-serif font-medium text-sage-800 flex items-center gap-2 mb-3"><ThumbsUp className="h-4 w-4" />优点</h3>
                <ul className="space-y-2">
                  {m.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-sage-700">
                      <Check className="h-4 w-4 text-sage-500 shrink-0 mt-0.5" />{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-clay-50 border border-clay-200 rounded-2xl p-5 lg:p-6">
                <h3 className="font-serif font-medium text-clay-800 flex items-center gap-2 mb-3"><ThumbsDown className="h-4 w-4" />缺点</h3>
                <ul className="space-y-2">
                  {m.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-clay-700">
                      <X className="h-4 w-4 text-clay-400 shrink-0 mt-0.5" />{c}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Buying Guide */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-clay-100 p-6 lg:p-8">
              <h2 className="font-serif text-xl font-semibold text-clay-800 mb-4 flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-clay-500" />选购指南</h2>
              <div className="space-y-4">
                {m.buying_guide.map((g, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-clay-50/50">
                    <span className="text-2xl shrink-0">{g.icon || '📌'}</span>
                    <div>
                      <h4 className="font-medium text-clay-800 text-sm">{g.title}</h4>
                      <p className="text-sm text-clay-500 mt-1 leading-relaxed">{g.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Pitfalls */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-warm-50 border border-warm-200 rounded-2xl p-6 lg:p-8">
              <h2 className="font-serif text-xl font-semibold text-warm-800 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warm-600" />避坑指南</h2>
              <div className="space-y-4">
                {m.pitfalls.map((p, i) => (
                  <div key={i} className="bg-white/60 rounded-xl p-4">
                    <p className="text-sm font-medium text-warm-800">❌ {p.mistake}</p>
                    <p className="text-sm text-warm-600 mt-1"><span className="font-medium">后果：</span>{p.consequence}</p>
                    <p className="text-sm text-sage-700 mt-1.5 bg-sage-50 rounded-lg p-3"><span className="font-medium">✅ 正确做法：</span>{p.solution}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Alternatives */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-clay-100 p-6 lg:p-8">
              <h2 className="font-serif text-xl font-semibold text-clay-800 mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-clay-500" />替代方案</h2>
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                {['💰 平价替代', '🌱 新手替代', '💎 高级替代', '♻️ 环保替代'].map((label, i) => (
                  <button key={i} onClick={() => setActiveAltTab(i)} className={cn(
                    'px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors',
                    activeAltTab === i ? 'bg-clay-600 text-white' : 'bg-clay-50 text-clay-600 hover:bg-clay-100',
                  )}>{label}</button>
                ))}
              </div>
              {m.alternatives[activeAltTab] && (
                <motion.div key={activeAltTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-clay-50 rounded-xl p-5">
                  <h4 className="font-serif font-medium text-clay-800">{m.alternatives[activeAltTab].name}</h4>
                  <p className="text-sm text-clay-500 mt-1">{m.alternatives[activeAltTab].description}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="text-xs">{m.alternatives[activeAltTab].price}</Badge>
                  </div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-medium text-sage-600 mb-1">👍 优势</p>
                      {m.alternatives[activeAltTab].pros.map((p, i) => (
                        <p key={i} className="text-xs text-sage-600 flex items-start gap-1"><Check className="h-3 w-3 mt-0.5 shrink-0" />{p}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-clay-500 mb-1">👎 不足</p>
                      {m.alternatives[activeAltTab].cons.map((c, i) => (
                        <p key={i} className="text-xs text-clay-500 flex items-start gap-1"><X className="h-3 w-3 mt-0.5 shrink-0" />{c}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.section>

            {/* FAQ */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl border border-clay-100 p-6 lg:p-8">
              <h2 className="font-serif text-xl font-semibold text-clay-800 mb-4">💬 常见问题</h2>
              <div className="space-y-2">
                {m.faqs.map((faq, i) => (
                  <div key={i} className="border border-clay-100 rounded-xl overflow-hidden">
                    <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-clay-50 transition-colors">
                      <span className="text-sm font-medium text-clay-700 pr-4">{faq.question}</span>
                      <ChevronDown className={cn('h-4 w-4 text-clay-400 shrink-0 transition-transform', openFaqs.has(i) && 'rotate-180')} />
                    </button>
                    <AnimatePresence>
                      {openFaqs.has(i) && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <p className="px-4 pb-4 text-sm text-clay-500 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <SectionHeader title="📖 使用该材料的教程" size="sm" />
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedTutorials.map((t) => (
                    <TutorialCard key={t.id} tutorial={{ id: t.slug, title: t.title, cover_url: t.cover_url, category: t.category as any, difficulty: t.difficulty as any, duration_minutes: t.duration_minutes, author: (t as any).author || { id: '', nickname: '未知', avatar_url: null }, favorites_count: t.favorites_count, steps: (t as any).steps?.length || 0 }} variant="horizontal" />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-5">
              {/* Specs */}
              <div className="bg-white rounded-2xl border border-clay-100 p-5">
                <h4 className="font-serif font-medium text-clay-800 mb-3 flex items-center gap-2"><Package className="h-4 w-4" />规格参数</h4>
                <ul className="space-y-2">
                  {m.specs.map((s, i) => (
                    <li key={i} className="text-sm text-clay-500 flex items-start gap-2">
                      <span className="text-clay-300 mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Nav */}
              <div className="bg-white rounded-2xl border border-clay-100 p-5">
                <h4 className="font-serif font-medium text-clay-800 mb-3">页面导航</h4>
                <nav className="space-y-1 text-sm">
                  {['材料简介', '优缺点', '选购指南', '避坑指南', '替代方案', '常见问题', '相关教程'].map((label) => (
                    <a key={label} href={`#${label}`} className="block px-3 py-1.5 text-clay-500 hover:text-clay-700 hover:bg-clay-50 rounded-lg transition-colors">{label}</a>
                  ))}
                </nav>
              </div>

              {/* Back */}
              <Link href="/materials">
                <Button variant="outline" className="w-full rounded-full">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> 回到材料库
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
