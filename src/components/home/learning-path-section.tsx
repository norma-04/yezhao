// ─── 野造 · Learning Path Section ───
// 布局: 3条成长路线 · Timeline 设计

'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/shared/section-header'
import { FadeUp } from '@/components/shared/animated-container'
import { cn } from '@/lib/utils'

const paths = [
  {
    id: 'beginner',
    icon: Sparkles,
    title: '零基础入门',
    subtitle: '从零到第一件作品',
    description: '不需要任何经验。从最简单的项目开始，每一步都有详细拆解，让你轻松完成第一个手工作品。',
    steps: ['选择入门品类', '完成基础教程', '制作第一件作品', '加入新手社区'],
    color: 'from-sage-400 to-sage-500',
    bg: 'bg-sage-50',
    border: 'border-sage-200',
    href: '/tutorials?difficulty=beginner',
  },
  {
    id: 'intermediate',
    icon: TrendingUp,
    title: '兴趣进阶',
    subtitle: '深入探索一门手艺',
    description: '找到你真正热爱的手作方向。学习更复杂的技法，挑战更高难度，让手艺成为你的核心竞争力。',
    steps: ['锁定擅长品类', '掌握核心技法', '完成进阶挑战', '形成个人风格'],
    color: 'from-clay-400 to-clay-600',
    bg: 'bg-clay-50',
    border: 'border-clay-200',
    href: '/tutorials?difficulty=intermediate',
  },
  {
    id: 'advanced',
    icon: Star,
    title: '创作者成长',
    subtitle: '让你的手艺被看见',
    description: '从爱好者到创作者。分享你的作品与心得，帮助更多的人爱上手作，成为社区的意见领袖。',
    steps: ['持续创作输出', '分享制作过程', '帮助新手成长', '建立个人品牌'],
    color: 'from-warm-400 to-warm-600',
    bg: 'bg-warm-50',
    border: 'border-warm-200',
    href: '/community',
  },
]

export function LearningPathSection() {
  return (
    <section className="py-16 lg:py-24 bg-clay-50/40">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeUp>
          <SectionHeader
            title="不知道学什么？"
            description="三条成长路线，找到适合你的手作之旅"
            align="center"
            size="lg"
          />
        </FadeUp>

        {/* Timeline connector - desktop */}
        <div className="hidden lg:block relative">
          <div className="absolute top-1/2 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-sage-300 via-clay-400 to-warm-300 -translate-y-1/2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-12">
          {paths.map((path, i) => {
            const Icon = path.icon
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
              >
                <div className={cn(
                  'relative rounded-2xl p-6 lg:p-8 border h-full flex flex-col',
                  path.bg, path.border,
                )}>
                  {/* Step number */}
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-5',
                    'bg-gradient-to-br text-white shadow-lg',
                    path.color,
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Badge */}
                  <span className="text-xs font-medium text-clay-500 mb-2">
                    Step {i + 1}
                  </span>

                  <h3 className="font-serif text-xl font-semibold text-clay-800">{path.title}</h3>
                  <p className="text-sm text-clay-500 mt-1">{path.subtitle}</p>
                  <p className="text-sm text-clay-500 mt-3 leading-relaxed">{path.description}</p>

                  {/* Steps timeline */}
                  <div className="mt-6 space-y-3 flex-1">
                    {path.steps.map((step, si) => (
                      <div key={si} className="flex items-center gap-3">
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                          'bg-white border-2',
                          si === 0 ? path.border : 'border-clay-100',
                        )}>
                          <span className={cn(
                            'text-xs font-medium',
                            si === 0 ? 'text-clay-600' : 'text-clay-400',
                          )}>
                            {si + 1}
                          </span>
                        </div>
                        <span className="text-sm text-clay-600">{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={path.href}
                    className={cn(
                      'mt-6 inline-flex items-center gap-2 text-sm font-medium',
                      'text-clay-600 hover:text-clay-700 transition-colors',
                    )}
                  >
                    开始探索 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
