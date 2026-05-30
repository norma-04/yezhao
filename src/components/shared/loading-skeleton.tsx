// ─── 野造 · Loading Skeleton 组件 ───
// 用途: 内容加载占位
// Variants: card-grid, list, detail, text
// 使用场景: 页面加载中状态

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />
}

// ── Card Grid Skeleton ──
export function CardGridSkeleton({ count = 6, cols = 3 }: { count?: number; cols?: 1 | 2 | 3 | 4 }) {
  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols]

  return (
    <div className={cn('grid gap-5', colClass)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-3 w-2/3 rounded" />
        </div>
      ))}
    </div>
  )
}

// ── List Skeleton ──
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Detail Skeleton ──
export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <Skeleton className="h-8 w-2/3 rounded" />
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-32 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
    </div>
  )
}

// ── Text Block Skeleton ──
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4 rounded', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

export { Skeleton }
