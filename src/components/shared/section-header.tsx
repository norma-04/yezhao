// ─── 野造 · Section Header 组件 ───
// 用途: 页面/区块标题，统一视觉风格
// Props: title, description, action, alignment, size
// 使用场景: 首页各分区标题、列表页标题、详情页区块标题

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  align?: 'left' | 'center'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: { title: 'text-xl lg:text-2xl', desc: 'text-sm' },
  md: { title: 'text-2xl lg:text-3xl', desc: 'text-base' },
  lg: { title: 'text-3xl lg:text-4xl', desc: 'text-lg' },
}

export function SectionHeader({
  title,
  description,
  action,
  align = 'left',
  size = 'md',
  className,
}: SectionHeaderProps) {
  const s = sizeStyles[size]

  return (
    <div
      className={cn(
        'flex items-end justify-between gap-4 mb-8 lg:mb-10',
        align === 'center' && 'flex-col items-center text-center',
        className,
      )}
    >
      <div className={cn('space-y-2', align === 'center' && 'max-w-lg')}>
        <h2 className={cn('font-serif font-semibold text-clay-800', s.title)}>
          {title}
        </h2>
        {description && (
          <p className={cn('text-clay-500', s.desc)}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
