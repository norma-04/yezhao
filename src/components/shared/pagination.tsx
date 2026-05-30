// ─── 野造 · Pagination 组件 ───
// 用途: 分页导航
// Props: current, total, onPageChange

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  current: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ current, total, onPageChange, className }: PaginationProps) {
  if (total <= 1) return null

  const pages: (number | '...')[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  const baseBtn = 'inline-flex items-center justify-center h-9 min-w-[36px] rounded-lg text-sm font-medium transition-colors duration-150'

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)}>
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current <= 1}
        className={cn(baseBtn, 'px-2 text-clay-500 hover:text-clay-700 disabled:opacity-30 disabled:cursor-not-allowed')}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className={cn(baseBtn, 'text-clay-400 cursor-default')}>...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              baseBtn,
              p === current
                ? 'bg-clay-600 text-white shadow-sm'
                : 'text-clay-600 hover:bg-clay-100',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current >= total}
        className={cn(baseBtn, 'px-2 text-clay-500 hover:text-clay-700 disabled:opacity-30 disabled:cursor-not-allowed')}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
