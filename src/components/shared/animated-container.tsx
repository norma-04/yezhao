// ─── 野造 · Animated Container ───
// 用途: 统一 Framer Motion 入场动画容器
// Variants: fadeUp, stagger, scaleIn, slideIn
// 使用场景: 页面区块加载动画、列表渐进显示

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── Preset Animation Variants ──
const easeOut = 'easeOut' as const

export const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  },

  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  },

  staggerChild: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  },

  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut } },
  },

  slideInLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
  },

  slideInRight: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
  },
}

// ── Components ──
interface AnimatedProps {
  children: React.ReactNode
  className?: string
  once?: boolean
}

export function FadeUp({ children, className, once = true }: AnimatedProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={animations.fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className, once = true }: AnimatedProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      variants={animations.stagger}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={animations.staggerChild} className={className}>
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className, once = true }: AnimatedProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      variants={animations.scaleIn}
      className={className}
    >
      {children}
    </motion.div>
  )
}
