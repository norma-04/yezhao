// ─── 野造 · Category Badge ───
// 用途: 教程/材料品类标签
// Props: category, showIcon
// 使用场景: 卡片、详情页

import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'

interface CategoryBadgeProps {
  category: Category
  showIcon?: boolean
  className?: string
}

const catStyles: Record<Category, string> = {
  weaving: 'bg-amber-50 text-amber-700 border-amber-200',
  leather: 'bg-stone-100 text-stone-700 border-stone-200',
  woodwork: 'bg-orange-50 text-orange-700 border-orange-200',
  clay: 'bg-rose-50 text-rose-700 border-rose-200',
  embroidery: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  other: 'bg-violet-50 text-violet-700 border-violet-200',
}

export function CategoryBadge({ category, showIcon = true, className }: CategoryBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
      catStyles[category],
      className,
    )}>
      {showIcon && <span>{CATEGORY_ICONS[category]}</span>}
      {CATEGORY_LABELS[category]}
    </span>
  )
}
