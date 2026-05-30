// ─── 野造 · Search Bar 组件 ───
// 用途: 全局搜索输入框
// Props: value, onChange, onSubmit, placeholder, size
// 使用场景: Header 搜索、搜索页

'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: 'h-9 text-sm',
  md: 'h-11 text-sm',
  lg: 'h-14 text-base',
}

export function SearchBar({
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = '搜索教程、材料...',
  size = 'md',
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')
  const value = controlledValue ?? internalValue

  const handleChange = (v: string) => {
    setInternalValue(v)
    onChange?.(v)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSubmit?.(value.trim())
  }

  const handleClear = () => {
    setInternalValue('')
    onChange?.('')
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-clay-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-full border border-clay-200 bg-white/80 pl-11 pr-10',
          'text-clay-700 placeholder:text-clay-400',
          'focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/20',
          'transition-all duration-200',
          sizeStyles[size],
        )}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-clay-400 hover:text-clay-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
