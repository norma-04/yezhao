// ─── 野造 · 材料知识库首页 ───
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Star, ArrowRight, BookOpen, AlertTriangle, ShoppingBag, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/shared/section-header'
import { SearchBar } from '@/components/shared/search-bar'
import { FeatureCard } from '@/components/shared/feature-card'
import { EmptyState } from '@/components/shared/empty-state'
import { CardGridSkeleton } from '@/components/shared/loading-skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import { cn } from '@/lib/utils'
import type { MaterialData } from '@/data/materials'

const HOT_SEARCHES = ['藤条', '植鞣皮', '樱桃木', 'DMC绣线', '石塑黏土', 'UV树脂', '软陶', '棉绳']

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [materialCategories, setMaterialCategories] = useState<{slug: string; name: string; icon: string; count: number; description: string}[]>([])

  useEffect(() => {
    fetch('/api/materials?sort=rating&limit=12')
      .then((r) => r.json())
      .then((d) => setMaterials(d.items))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/materials/category')
      .then((r) => r.json())
      .then((d) => setMaterialCategories(d.categories || d))
      .catch(() => setMaterialCategories([]))
  }, [])

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    if (!q.trim()) { setHasSearched(false); return }
    setHasSearched(true)
    setLoading(true)
    fetch(`/api/materials/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setMaterials(d.items))
      .finally(() => setLoading(false))
  }

  const priceSymbol = (level: string) => { const map: Record<string, string> = { '¥': '¥', '¥¥': '¥¥', '¥¥¥': '¥¥¥', '¥¥¥¥': '¥¥¥¥' }; return map[level] || level }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-clay-50 via-cream to-warm-50 py-16 lg:py-24 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-clay-200/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative">
          <FadeUp>
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-clay-100/60 text-clay-600 text-sm mb-6">材料选购指南</span>
              <h1 className="font-serif text-4xl lg:text-6xl font-semibold text-clay-800 leading-tight text-balance">
                选对材料，<br /><span className="text-gradient-clay">成功一半</span>
              </h1>
              <p className="mt-4 text-lg text-clay-500 max-w-lg">从编织到木工，从皮具到刺绣——找到最适合你的手作材料。</p>
              <div className="mt-8 max-w-lg">
                <SearchBar onSubmit={handleSearch} placeholder="搜索材料...如：藤条、植鞣皮、樱桃木" size="lg" />
              </div>
              {!hasSearched && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-clay-400">
                  <span>热门搜索:</span>
                  {HOT_SEARCHES.slice(0, 6).map((t) => (
                    <button key={t} onClick={() => handleSearch(t)} className="text-clay-500 hover:text-clay-700 underline underline-offset-2">{t}</button>
                  ))}
                </div>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Category Grid */}
      {!hasSearched && (
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <FadeUp>
              <SectionHeader title="按品类探索" description="六大品类材料知识库" />
            </FadeUp>
            <StaggerContainer>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {materialCategories.map((cat) => (
                  <StaggerItem key={cat.slug}>
                    <Link href={`/materials/category/${cat.slug}`}>
                      <div className="rounded-2xl bg-white border border-clay-100 p-4 lg:p-5 card-hover text-center h-full">
                        <span className="text-3xl lg:text-4xl">{cat.icon}</span>
                        <h3 className="font-serif font-medium text-clay-800 mt-2 text-sm">{cat.name}</h3>
                        <p className="text-xs text-clay-400 mt-1">{cat.count} 条指南</p>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Knowledge Hub */}
      {!hasSearched && (
        <section className="py-12 lg:py-16 bg-clay-50/40">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <FadeUp>
              <SectionHeader title="📚 材料知识中心" description="不只是介绍材料，更是你的选购决策助手" align="center" />
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              <FeatureCard icon={BookOpen} title="选购指南" description="每种材料的详细选购要点，从规格到品牌" colorScheme="clay" />
              <FeatureCard icon={AlertTriangle} title="避坑手册" description="常见买错材料的错误案例，少交学费" colorScheme="warm" />
              <FeatureCard icon={Lightbulb} title="替代方案" description="平价/新手/高级/环保四类替代选择" colorScheme="sage" />
              <FeatureCard icon={ShoppingBag} title="购买建议" description="靠谱购买渠道和价格参考" colorScheme="clay" />
            </div>
          </div>
        </section>
      )}

      {/* Materials Grid */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <FadeUp>
            <SectionHeader
              title={hasSearched ? `"${searchQuery}" 的搜索结果` : '⭐ 热门材料推荐'}
              description={hasSearched ? `找到 ${materials.length} 条材料指南` : '评分最高的手作材料'}
            />
          </FadeUp>

          {loading ? (
            <CardGridSkeleton count={6} cols={3} />
          ) : materials.length === 0 ? (
            <EmptyState title="没有找到相关材料" description="试试其他关键词" action={hasSearched ? { label: '浏览全部材料', onClick: () => { setSearchQuery(''); setHasSearched(false) }} : undefined} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {materials.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link href={`/materials/${m.slug}`} className="block group">
                    <div className="rounded-2xl bg-white border border-clay-100 overflow-hidden card-hover h-full flex flex-col">
                      {/* Category gradient area */}
                      <div className={cn(
                        'h-32 flex items-center justify-center text-5xl',
                        m.category === 'weaving' ? 'bg-gradient-to-br from-amber-100 to-orange-100' :
                        m.category === 'leather' ? 'bg-gradient-to-br from-stone-200 to-amber-100' :
                        m.category === 'woodwork' ? 'bg-gradient-to-br from-amber-100 to-yellow-100' :
                        m.category === 'clay' ? 'bg-gradient-to-br from-rose-100 to-pink-100' :
                        m.category === 'embroidery' ? 'bg-gradient-to-br from-green-50 to-emerald-100' :
                        'bg-gradient-to-br from-purple-50 to-violet-100'
                      )}>
                        {{ weaving: '🧶', leather: '👜', woodwork: '🪵', clay: '🏺', embroidery: '🪡', other: '✨' }[m.category]}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">{m.category === 'weaving' ? '编织' : m.category === 'leather' ? '皮具' : m.category === 'woodwork' ? '木工' : m.category === 'clay' ? '黏土' : m.category === 'embroidery' ? '刺绣' : '其他'}</Badge>
                          <Badge variant="secondary" className={`text-xs ${m.difficulty_level === 'beginner' ? 'bg-sage-100 text-sage-700' : m.difficulty_level === 'intermediate' ? 'bg-warm-100 text-warm-700' : 'bg-clay-100 text-clay-700'}`}>
                            {m.difficulty_level === 'beginner' ? '新手友好' : m.difficulty_level === 'intermediate' ? '进阶' : '专业'}
                          </Badge>
                        </div>
                        <h3 className="font-serif font-medium text-clay-800 group-hover:text-clay-600 transition-colors">{m.name}</h3>
                        <p className="text-sm text-clay-500 mt-1.5 line-clamp-2 flex-1">{m.summary}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-clay-50">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-warm-400 text-warm-400" />
                            <span className="text-sm font-medium text-clay-700">{m.rating}</span>
                          </div>
                          <span className="text-sm text-clay-400">{priceSymbol(m.price_level)}</span>
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

      {/* Bottom CTA */}
      {!hasSearched && (
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-clay-600 via-clay-500 to-warm-500 p-10 lg:p-14 text-center text-white relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
              <h2 className="relative font-serif text-2xl lg:text-3xl font-semibold">还不确定买什么材料？</h2>
              <p className="relative mt-3 text-white/70">从你感兴趣的教程开始，教程材料清单已为你准备好</p>
              <div className="relative mt-6">
                <Link href="/tutorials">
                  <Button size="lg" className="rounded-full bg-white text-clay-700 hover:bg-clay-50 px-8">浏览教程 <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
