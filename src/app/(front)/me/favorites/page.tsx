// ─── 野造 · 我的收藏 ───
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Package, Image, Trash2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/shared/section-header'
import { FilterPanel } from '@/components/shared/filter-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/shared/loading-skeleton'
import { FadeUp } from '@/components/shared/animated-container'
import type { FavoriteItem } from '@/data/user-center'
import { cn } from '@/lib/utils'

const TYPE_TABS = [
  { key: 'all', label: '全部', icon: '📦' },
  { key: 'tutorial', label: '教程', icon: '📖' },
  { key: 'material', label: '材料', icon: '📦' },
  { key: 'post', label: '作品', icon: '🖼️' },
]

const typeLabels = { tutorial: '教程', material: '材料', post: '作品' }
const typeColors = { tutorial: 'bg-sage-50 text-sage-600', material: 'bg-warm-50 text-warm-600', post: 'bg-clay-50 text-clay-600' }

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('all')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/me/favorites${activeType !== 'all' ? `?type=${activeType}` : ''}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false))
  }, [activeType])

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    fetch('/api/me/favorites', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
  }

  const getLink = (item: FavoriteItem) => {
    if (item.type === 'tutorial') return `/tutorials/${item.slug}`
    if (item.type === 'material') return `/materials/${item.slug}`
    return `/community/post/${item.slug}`
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-6">
        <FadeUp><SectionHeader title="💝 我的收藏" description={`共 ${items.length} 项`} size="sm" /></FadeUp>
        <FilterPanel options={TYPE_TABS} selected={activeType} onSelect={setActiveType} variant="pill" className="mb-6" />

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState title="还没有收藏" description="去发现感兴趣的内容吧" action={{ label: '浏览教程', onClick: () => window.location.href = '/tutorials' }} />
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={getLink(item)} className="block group">
                  <div className="rounded-xl bg-white border border-clay-100 p-4 card-hover flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clay-100 to-warm-50 flex items-center justify-center shrink-0 text-xl">
                      {item.type === 'tutorial' ? '📖' : item.type === 'material' ? '📦' : '🖼️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="secondary" className={cn('text-xs', typeColors[item.type])}>{typeLabels[item.type]}</Badge>
                        <span className="text-xs text-clay-400">{item.category}</span>
                      </div>
                      <h4 className="font-medium text-clay-800 text-sm group-hover:text-clay-600 transition-colors truncate">{item.title}</h4>
                      <p className="text-xs text-clay-400 mt-0.5">收藏于 {item.created_at}</p>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(item.id) }} className="p-2 rounded-full text-clay-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
