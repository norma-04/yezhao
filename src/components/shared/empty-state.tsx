// ─── 野造 · Empty State 组件 ───
// 用途: 空数据占位提示
// Props: icon, title, description, action
// 使用场景: 列表无数据、搜索无结果、收藏为空等

import { PackageOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: { icon: 'h-10 w-10', wrapper: 'p-6', title: 'text-base' },
  md: { icon: 'h-14 w-14', wrapper: 'p-10', title: 'text-lg' },
  lg: { icon: 'h-20 w-20', wrapper: 'p-16', title: 'text-xl' },
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  const s = sizeStyles[size]

  return (
    <div className={cn('flex flex-col items-center justify-center text-center rounded-2xl bg-clay-50/50', s.wrapper, className)}>
      <div className={cn('rounded-full bg-clay-100 flex items-center justify-center mb-4', size === 'lg' ? 'p-5' : size === 'sm' ? 'p-2.5' : 'p-4')}>
        <Icon className={cn('text-clay-400', s.icon)} strokeWidth={1.5} />
      </div>
      <h3 className={cn('font-serif font-medium text-clay-600', s.title)}>
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-clay-400 max-w-xs">{description}</p>
      )}
      {action && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5 rounded-full"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
