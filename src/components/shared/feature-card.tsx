// ─── 野造 · Feature Card 组件 ───
// 用途: 特性/服务/功能展示卡片
// Props: icon, title, description, href, colorScheme
// 使用场景: 首页品类入口、材料选购指南入口、快捷入口

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon?: string | LucideIcon
  title: string
  description?: string
  href?: string
  onClick?: () => void
  colorScheme?: 'clay' | 'warm' | 'sage' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorStyles = {
  clay: { bg: 'bg-clay-50 hover:bg-clay-100', accent: 'bg-clay-200 text-clay-600', text: 'text-clay-700' },
  warm: { bg: 'bg-warm-50 hover:bg-warm-100', accent: 'bg-warm-200 text-warm-600', text: 'text-warm-700' },
  sage: { bg: 'bg-sage-50 hover:bg-sage-100', accent: 'bg-sage-200 text-sage-600', text: 'text-sage-700' },
  neutral: { bg: 'bg-white hover:bg-clay-50', accent: 'bg-clay-100 text-clay-500', text: 'text-clay-700' },
}

const sizeStyles = {
  sm: { card: 'p-4 rounded-xl', icon: 'h-10 w-10 text-lg', title: 'text-sm' },
  md: { card: 'p-5 lg:p-6 rounded-2xl', icon: 'h-12 w-12 text-xl', title: 'text-base' },
  lg: { card: 'p-6 lg:p-8 rounded-2xl', icon: 'h-16 w-16 text-2xl', title: 'text-lg' },
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  colorScheme = 'neutral',
  size = 'md',
  className,
}: FeatureCardProps) {
  const colors = colorStyles[colorScheme]
  const sizes = sizeStyles[size]

  const content = (
    <div className={cn('flex flex-col transition-all duration-300', colors.bg, sizes.card, href && 'card-hover', className)}>
      {/* Icon */}
      <div className={cn('rounded-xl flex items-center justify-center shrink-0 mb-3', colors.accent, sizes.icon)}>
        {typeof Icon === 'string' ? (
          <span>{Icon}</span>
        ) : Icon ? (
          <Icon className="h-5 w-5" />
        ) : (
          <span>✨</span>
        )}
      </div>

      {/* Title */}
      <h4 className={cn('font-medium', colors.text, sizes.title)}>{title}</h4>

      {/* Description */}
      {description && (
        <p className="mt-1.5 text-sm text-clay-400 leading-relaxed flex-1">{description}</p>
      )}

      {/* Link indicator */}
      {href && (
        <div className="flex items-center gap-1 mt-3 text-xs font-medium text-clay-400">
          了解更多 <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </div>
  )

  if (href) return <Link href={href}>{content}</Link>
  if (onClick) return <button onClick={onClick} className="text-left w-full">{content}</button>
  return content
}
