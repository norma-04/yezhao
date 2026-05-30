// ─── 野造 · Difficulty Badge ───
// 用途: 教程难度标签
// Props: difficulty ('beginner' | 'intermediate' | 'advanced')
// 使用场景: 教程卡片、教程详情

import { cn } from '@/lib/utils'
import type { Difficulty } from '@/lib/types'

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

const config: Record<Difficulty, { label: string; className: string }> = {
  beginner: { label: '入门', className: 'bg-sage-100 text-sage-700 border-sage-200' },
  intermediate: { label: '进阶', className: 'bg-warm-100 text-warm-700 border-warm-200' },
  advanced: { label: '挑战', className: 'bg-clay-100 text-clay-700 border-clay-200' },
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const { label, className: style } = config[difficulty]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border', style, className)}>
      {label}
    </span>
  )
}
