// ─── 野造 · CTA Section ───
// 布局: 全宽渐变横幅 · 情绪化号召

'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl lg:rounded-4xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-clay-600 via-clay-500 to-warm-500" />

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/3 blur-3xl" />

          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Content */}
          <div className="relative px-6 py-14 lg:px-16 lg:py-20 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-white/70 text-sm lg:text-base font-medium tracking-wide uppercase"
            >
              现在就开始
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 font-serif text-3xl lg:text-4xl xl:text-5xl font-semibold text-white leading-tight text-balance"
            >
              开始你的第一件作品
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 text-white/60 text-base lg:text-lg max-w-xl mx-auto leading-relaxed"
            >
              加入野造，与千万手作爱好者一起，用双手创造温暖
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link href="/tutorials">
                <Button size="lg" className="rounded-full bg-white text-clay-700 hover:bg-clay-50 h-12 px-10 text-base shadow-xl shadow-black/10">
                  浏览教程
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 h-12 px-10 text-base">
                  免费注册
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 text-white/40 text-sm"
            >
              已有 12,000+ 创作者加入 · 200+ 精选教程 · 50+ 材料指南
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
