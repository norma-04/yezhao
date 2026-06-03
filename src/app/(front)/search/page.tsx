// ─── 野造 · 搜索结果页 ───
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/shared/search-bar'
import { TutorialCard } from '@/components/shared/tutorial-card'
import { SectionHeader } from '@/components/shared/section-header'
import { EmptyState } from '@/components/shared/empty-state'
import { CardGridSkeleton } from '@/components/shared/loading-skeleton'
import { FadeUp } from '@/components/shared/animated-container'
import { CATEGORIES } from '@/lib/constants'
import { FilterPanel } from '@/components/shared/filter-panel'
import type { Tutorial } from '@/lib/types'

const HOT_SEARCHES = ['藤编', '皮具入门', '木勺', '多肉', '刺绣', '挂毯', '卡包', '手办']
const typeOptions = [
  { key: 'all', label: '全部' },
  { key: 'tutorial', label: '教程' },
  { key: 'material', label: '材料' },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [searchValue, setSearchValue] = useState(query)
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [activeType, setActiveType] = useState('all')

  useEffect(() => {
    if (query) {
      setHasSearched(true)
      setLoading(true)
      fetch(`/api/search?q=${encodeURIComponent(query)}&type=${activeType}`)
        .then((r) => r.json())
        .then((data) => {
          setTutorials(data.tutorials || [])
        })
        .finally(() => setLoading(false))
    }
  }, [query, activeType])

  const handleSearch = (value: string) => {
    if (value.trim()) {
      const url = `/search?q=${encodeURIComponent(value.trim())}`
      window.history.pushState(null, '', url)
      setHasSearched(true)
      setLoading(true)
      fetch(`/api/search?q=${encodeURIComponent(value.trim())}&type=${activeType}`)
        .then((r) => r.json())
        .then((data) => setTutorials(data.tutorials || []))
        .finally(() => setLoading(false))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="bg-gradient-to-br from-clay-50 via-cream to-warm-50 py-10 lg:py-14">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <FadeUp>
            <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-clay-800 text-center">
              搜索你想要的
            </h1>
            <div className="mt-5">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                onSubmit={handleSearch}
                placeholder="搜索教程、材料...如：编织、木工、刺绣"
                size="lg"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
        {/* No query yet — show suggestions */}
        {!hasSearched && (
          <FadeUp>
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-clay-500">热门搜索</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {HOT_SEARCHES.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      setSearchValue(term)
                      handleSearch(term)
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
              <div className="mt-12">
                <p className="text-center text-clay-500 mb-6">或按品类浏览</p>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.key}
                      href={`/tutorials?category=${cat.key}`}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white card-hover text-center"
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm text-clay-600">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        )}

        {/* Results */}
        {hasSearched && (
          <>
            {/* Type filter */}
            <div className="mb-8">
              <FilterPanel options={typeOptions} selected={activeType} onSelect={setActiveType} variant="pill" />
            </div>

            {loading ? (
              <CardGridSkeleton count={6} cols={3} />
            ) : tutorials.length === 0 ? (
              <EmptyState
                title="没有找到相关结果"
                description="试试其他关键词，或者浏览推荐教程"
                action={{ label: '浏览全部教程', onClick: () => { window.location.href = '/tutorials' }}}
              />
            ) : (
              <>
                <p className="text-sm text-clay-500 mb-6">
                  找到 {tutorials.length} 个教程
                  {query && <span className="text-clay-600"> &quot;{query}&quot;</span>}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {tutorials.map((t) => (
                    <TutorialCard
                      key={t.id}
                      tutorial={{
                        id: t.slug,
                        title: t.title,
                        cover_url: t.cover_url,
                        category: t.category as any,
                        difficulty: t.difficulty as any,
                        duration_minutes: t.duration_minutes,
                        author: (t as any).author || { id: '', nickname: '未知', avatar_url: null },
                        favorites_count: t.favorites_count,
                        steps: (t as any).steps?.length || 0,
                      }}
                      variant="grid"
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><CardGridSkeleton count={6} cols={3} /></div>}>
      <SearchContent />
    </Suspense>
  )
}
