// ─── 野造 · Filter Panel 组件 ───
// 用途: 筛选面板（品类/难度/排序）
// Props: categories, selected, onSelect

'use client'

import { cn } from '@/lib/utils'

interface FilterOption {
  key: string
  label: string
  icon?: string
}

interface FilterPanelProps {
  options: FilterOption[]
  selected: string
  onSelect: (key: string) => void
  variant?: 'chip' | 'pill' | 'tab'
  className?: string
}

const variantStyles = {
  chip: {
    wrapper: 'flex flex-wrap gap-2',
    item: (active: boolean) =>
      cn(
        'px-3 py-1.5 text-sm rounded-full border transition-all duration-200',
        active
          ? 'bg-clay-600 text-white border-clay-600 shadow-sm'
          : 'bg-white text-clay-600 border-clay-200 hover:border-clay-300 hover:bg-clay-50',
      ),
  },
  pill: {
    wrapper: 'flex flex-wrap gap-1.5',
    item: (active: boolean) =>
      cn(
        'px-4 py-2 text-sm rounded-full transition-all duration-200 font-medium',
        active
          ? 'bg-clay-100 text-clay-700'
          : 'text-clay-500 hover:text-clay-700 hover:bg-clay-50',
      ),
  },
  tab: {
    wrapper: 'flex border-b border-clay-200',
    item: (active: boolean) =>
      cn(
        'px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 -mb-px',
        active
          ? 'border-clay-600 text-clay-700'
          : 'border-transparent text-clay-500 hover:text-clay-600',
      ),
  },
}

export function FilterPanel({
  options,
  selected,
  onSelect,
  variant = 'pill',
  className,
}: FilterPanelProps) {
  const style = variantStyles[variant]

  return (
    <div className={cn(style.wrapper, className)}>
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onSelect(opt.key)}
          className={style.item(selected === opt.key)}
        >
          {opt.icon && <span className="mr-1">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
