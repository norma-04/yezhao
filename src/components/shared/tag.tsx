// ─── 野造 · Tag 组件 ───
// 用途: 内容标签（品类、话题、材料标签等）
// Props: label, variant, size, removable, onRemove

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagProps {
  label: string
  variant?: 'default' | 'clay' | 'warm' | 'sage' | 'outline'
  size?: 'sm' | 'md'
  removable?: boolean
  onRemove?: () => void
  className?: string
}

const variantStyles = {
  default: 'bg-clay-100 text-clay-700',
  clay: 'bg-clay-100 text-clay-700',
  warm: 'bg-warm-100 text-warm-700',
  sage: 'bg-sage-100 text-sage-700',
  outline: 'bg-transparent border border-clay-300 text-clay-600 hover:bg-clay-50',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function Tag({ label, variant = 'default', size = 'sm', removable, onRemove, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        !removable && 'cursor-default',
        className,
      )}
    >
      {label}
      {removable && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove?.() }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-clay-200/50 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
