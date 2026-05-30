// ─── 野造 · 材料分类页 ───
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/shared/section-header'
import { FilterPanel } from '@/components/shared/filter-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { CardGridSkeleton } from '@/components/shared/loading-skeleton'
import { FadeUp } from '@/components/shared/animated-container'
import { materialCategories } from '@/data/materials'
import type { MaterialData } from '@/data/materials'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { key: 'rating', label: '评分最高' },
  { key: 'price_asc', label: '价格最低' },
  { key: 'newest', label: '最新' },
]

export default function MaterialCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [materials, setMaterials] = useState<MaterialData[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('rating')

  const category = materialCategories.find((c) => c.slug === slug)
  const catLabel = { weaving: '编织', leather: '皮具', woodwork: '木工', clay: '黏土', embroidery: '刺绣', other: '其他' }[slug] || slug
  const catEmoji = { weaving: '🧶', leather: '👜', woodwork: '🪵', clay: '🏺', embroidery: '🪡', other: '✨' }[slug] || '📦'

  useEffect(() => {
    setLoading(true)
    fetch(`/api/materials?category=${slug}&sort=${sort}`)
      .then((r) => r.json())
      .then((d) => setMaterials(d.items))
      .finally(() => setLoading(false))
  }, [slug, sort])

  const priceSymbol = (level: string) => level

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-clay-50 via-cream to-warm-50 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <FadeUp>
            <Link href="/materials" className="inline-flex items-center gap-1.5 text-sm text-clay-500 hover:text-clay-700 mb-4">
              <ArrowLeft className="h-4 w-4" /> 回到材料库
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{catEmoji}</span>
              <div>
                <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-clay-800">{catLabel}材料</h1>
                {category && <p className="mt-2 text-clay-500">{category.description}</p>}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Sort + Grid */}
      <section className="py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-clay-500">{materials.length} 条材料指南</p>
            <FilterPanel options={SORT_OPTIONS} selected={sort} onSelect={setSort} variant="chip" />
          </div>

          {loading ? (
            <CardGridSkeleton count={4} cols={2} />
          ) : materials.length === 0 ? (
            <EmptyState title="该品类暂无材料指南" description="我们正在努力补充中" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              {materials.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link href={`/materials/${m.slug}`} className="block group">
                    <div className="rounded-2xl bg-white border border-clay-100 p-5 lg:p-6 card-hover flex gap-5">
                      <div className={cn(
                        'w-20 h-20 lg:w-24 lg:h-24 rounded-xl shrink-0 flex items-center justify-center text-3xl',
                        slug === 'weaving' ? 'bg-gradient-to-br from-amber-100 to-orange-100' :
                        slug === 'leather' ? 'bg-gradient-to-br from-stone-200 to-amber-100' :
                        slug === 'woodwork' ? 'bg-gradient-to-br from-amber-100 to-yellow-100' :
                        slug === 'clay' ? 'bg-gradient-to-br from-rose-100 to-pink-100' :
                        slug === 'embroidery' ? 'bg-gradient-to-br from-green-50 to-emerald-100' :
                        'bg-gradient-to-br from-purple-50 to-violet-100'
                      )}>
                        {catEmoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="secondary" className={`text-xs ${m.difficulty_level === 'beginner' ? 'bg-sage-100 text-sage-700' : m.difficulty_level === 'intermediate' ? 'bg-warm-100 text-warm-700' : 'bg-clay-100 text-clay-700'}`}>
                            {m.difficulty_level === 'beginner' ? '新手友好' : m.difficulty_level === 'intermediate' ? '进阶' : '专业'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{priceSymbol(m.price_level)}</Badge>
                        </div>
                        <h3 className="font-serif font-medium text-clay-800 group-hover:text-clay-600 transition-colors">{m.name}</h3>
                        <p className="text-sm text-clay-500 mt-1 line-clamp-2">{m.summary}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-3.5 w-3.5 fill-warm-400 text-warm-400" />
                          <span className="text-sm font-medium text-clay-600">{m.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
