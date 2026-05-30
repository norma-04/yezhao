// ─── 野造 · Hero Section ───
// 布局: 左侧文案 + 右侧 Pinterest 拼贴视觉墙
// 动效: stagger reveal + floating cards + parallax

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ── 拼贴卡片数据 ──
const collageCards = [
  { size: 'lg', category: 'weaving', emoji: '🧶', label: '编织', offset: 'top-0 right-0 lg:right-8' },
  { size: 'md', category: 'woodwork', emoji: '🪵', label: '木工', offset: 'top-16 lg:top-20 right-16 lg:right-48' },
  { size: 'sm', category: 'embroidery', emoji: '🪡', label: '刺绣', offset: 'top-40 right-4 lg:right-12' },
  { size: 'lg', category: 'clay', emoji: '🏺', label: '黏土', offset: 'bottom-20 lg:bottom-16 right-20 lg:right-56' },
  { size: 'md', category: 'leather', emoji: '👜', label: '皮具', offset: 'bottom-0 lg:bottom-8 right-4 lg:right-20' },
  { size: 'sm', category: 'weaving', emoji: '🧵', label: '绳编', offset: 'top-20 left-4 lg:left-12' },
  { size: 'xs', category: 'clay', emoji: '🎨', label: '软陶', offset: 'bottom-32 left-0 lg:left-8' },
  { size: 'xs', category: 'embroidery', emoji: '🖼️', label: '十字绣', offset: 'top-52 right-24 lg:right-80' },
]

const catGradients: Record<string, string> = {
  weaving: 'from-amber-100 to-orange-100',
  leather: 'from-stone-200 to-amber-100',
  woodwork: 'from-amber-100 to-yellow-100',
  clay: 'from-rose-100 to-pink-100',
  embroidery: 'from-green-50 to-emerald-100',
  other: 'from-purple-50 to-violet-100',
}

const sizeStyles: Record<string, string> = {
  lg: 'w-36 h-36 lg:w-44 lg:h-44 text-4xl lg:text-5xl rounded-3xl',
  md: 'w-28 h-28 lg:w-32 lg:h-32 text-3xl rounded-2xl',
  sm: 'w-20 h-20 lg:w-24 lg:h-24 text-2xl rounded-2xl',
  xs: 'w-16 h-16 lg:w-18 lg:h-18 text-xl rounded-xl',
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-cream via-clay-50/30 to-warm-50/40">
      {/* Ambient background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-clay-200/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-warm-200/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-sage-200/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 lg:px-8 py-20 lg:py-24">
        {/* ── Left: 文案区 ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
          className="relative z-10 max-w-xl"
        >
          {/* Badge */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-clay-100/60 backdrop-blur border border-clay-200/50 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-clay-500" />
            <span className="text-sm text-clay-600 font-medium">探索手作的无限可能</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-clay-800 leading-[1.08] tracking-tight text-balance"
          >
            让每一次手作，
            <br />
            都成为
            <span className="text-gradient-clay"> 生活的创作</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            className="mt-6 text-base lg:text-lg text-clay-500 leading-relaxed max-w-md"
          >
            从零开始学习手作，找到适合你的材料，
            <br className="hidden sm:block" />
            记录属于你的每一件作品。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <Link href="/tutorials">
              <Button size="lg" className="rounded-full bg-clay-600 hover:bg-clay-700 text-white h-12 px-8 text-base shadow-lg shadow-clay-600/20">
                开始学习
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" size="lg" className="rounded-full border-clay-300 text-clay-600 hover:bg-clay-50 h-12 px-8 text-base">
                探索作品
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="mt-10 flex items-center gap-6 lg:gap-8 text-sm text-clay-400"
          >
            {[
              { num: '200+', label: '精选教程' },
              { num: '50+', label: '材料指南' },
              { num: '12,000+', label: '创作者' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="font-serif text-lg font-semibold text-clay-600">{s.num}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Pinterest 拼贴视觉墙 ── */}
        <div className="relative hidden lg:block h-[550px] lg:h-[650px] xl:h-[700px]">
          {collageCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.4 + i * 0.12,
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={cn(
                'absolute flex flex-col items-center justify-center shadow-lg shadow-clay-900/5',
                'bg-white/80 backdrop-blur border border-white/50',
                sizeStyles[card.size],
                card.offset,
                `bg-gradient-to-br ${catGradients[card.category] || catGradients.other}`,
              )}
              style={{
                rotate: i % 2 === 0 ? `${2 + i * 0.5}deg` : `${-2 - i * 0.3}deg`,
              }}
              whileHover={{
                scale: 1.08,
                rotate: 0,
                boxShadow: '0 8px 30px rgba(139, 74, 56, 0.12)',
                transition: { duration: 0.4 },
              }}
            >
              <span className="drop-shadow-sm">{card.emoji}</span>
              <span className="mt-1 text-xs font-medium text-clay-500 hidden xl:block">{card.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Simplified visual strip */}
        <div className="lg:hidden relative h-40 -mx-4 mt-8">
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {collageCards.slice(0, 5).map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className={cn(
                  'shrink-0 flex flex-col items-center justify-center rounded-2xl shadow-sm',
                  `bg-gradient-to-br ${catGradients[card.category] || catGradients.other}`,
                  'w-20 h-20 text-2xl',
                )}
              >
                <span>{card.emoji}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
    </section>
  )
}
