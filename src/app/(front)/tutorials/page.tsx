// ─── 野造 · 教程列表页 ───
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/shared/section-header'
import { TutorialCard } from '@/components/shared/tutorial-card'
import { SearchBar } from '@/components/shared/search-bar'
import { FilterPanel } from '@/components/shared/filter-panel'
import { Pagination } from '@/components/shared/pagination'
import { EmptyState } from '@/components/shared/empty-state'
import { CardGridSkeleton } from '@/components/shared/loading-skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Tutorial, Category, Difficulty } from '@/lib/types'

const DIFFICULTY_OPTIONS = [
  { key: 'all', label: '全部难度' },
  { key: 'beginner', label: '入门' },
  { key: 'intermediate', label: '进阶' },
  { key: 'advanced', label: '挑战' },
]

const SORT_OPTIONS = [
  { key: 'latest', label: '最新' },
  { key: 'popular', label: '最热' },
  { key: 'favorites', label: '收藏最多' },
]

const TIME_FILTERS = [
  { key: 'all', label: '全部时长' },
  { key: '30', label: '30分钟内' },
  { key: '60', label: '1小时内' },
  { key: '120', label: '2小时内' },
  { key: '240', label: '4小时以上' },
]

function TutorialListContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState((searchParams.get('category') ?? 'all') as string)
  const [difficulty, setDifficulty] = useState((searchParams.get('difficulty') ?? 'all') as string)
  const [sort, setSort] = useState('latest')
  const [timeFilter, setTimeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const limit = 12

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (difficulty !== 'all') params.set('difficulty', difficulty)
    params.set('sort', sort)
    if (searchQuery) params.set('q', searchQuery)
    params.set('page', String(page))
    params.set('limit', String(limit))

    // Update URL without navigation
    const newUrl = `/tutorials${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState(null, '', newUrl)

    fetch(`/api/tutorials?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setTutorials(data.items)
        setTotalPages(data.totalPages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category, difficulty, sort, searchQuery, page])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPage(1)
  }

  const handleCategoryChange = (key: string) => {
    setCategory(key)
    setPage(1)
  }

  const handleDifficultyChange = (key: string) => {
    setDifficulty(key)
    setPage(1)
  }

  const handleSortChange = (key: string) => {
    setSort(key)
    setPage(1)
  }

  const filteredTutorials = timeFilter === 'all'
    ? tutorials
    : tutorials.filter((t) => {
        if (timeFilter === '30') return t.duration_minutes <= 30
        if (timeFilter === '60') return t.duration_minutes <= 60
        if (timeFilter === '120') return t.duration_minutes <= 120
        if (timeFilter === '240') return t.duration_minutes > 240
        return true
      })

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-clay-50 via-cream to-warm-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <FadeUp>
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-clay-800">
              发现适合你的手作教程
            </h1>
            <p className="mt-3 text-clay-500 text-lg">从零基础到创作者成长路线</p>
            <div className="mt-6 max-w-xl">
              <SearchBar onSubmit={handleSearch} placeholder="搜索教程...如：编织、木工、刺绣" size="lg" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-14 lg:top-16 z-20 bg-cream/90 backdrop-blur border-b border-clay-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {/* Category pills */}
            <FilterPanel
              options={[{ key: 'all', label: '全部' }, ...CATEGORIES.map((c) => ({ key: c.key, label: c.label, icon: c.icon }))]}
              selected={category}
              onSelect={handleCategoryChange}
              variant="pill"
            />

            {/* Mobile filter toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden shrink-0 rounded-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              筛选
            </Button>

            {/* Desktop filters */}
            <div className="hidden lg:flex items-center gap-3 ml-auto shrink-0">
              <FilterPanel options={DIFFICULTY_OPTIONS} selected={difficulty} onSelect={handleDifficultyChange} variant="chip" />
              <FilterPanel options={SORT_OPTIONS} selected={sort} onSelect={handleSortChange} variant="chip" />
              <FilterPanel options={TIME_FILTERS} selected={timeFilter} onSelect={setTimeFilter} variant="chip" />
            </div>
          </div>

          {/* Mobile expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pt-3 pb-2 space-y-3">
                  <div>
                    <span className="text-xs text-clay-500 mb-1.5 block">难度</span>
                    <FilterPanel options={DIFFICULTY_OPTIONS} selected={difficulty} onSelect={handleDifficultyChange} variant="chip" />
                  </div>
                  <div>
                    <span className="text-xs text-clay-500 mb-1.5 block">排序</span>
                    <FilterPanel options={SORT_OPTIONS} selected={sort} onSelect={handleSortChange} variant="chip" />
                  </div>
                  <div>
                    <span className="text-xs text-clay-500 mb-1.5 block">时长</span>
                    <FilterPanel options={TIME_FILTERS} selected={timeFilter} onSelect={setTimeFilter} variant="chip" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Tutorial Grid */}
      <section className="py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {loading ? (
            <CardGridSkeleton count={8} cols={3} />
          ) : filteredTutorials.length === 0 ? (
            <EmptyState
              title="没有找到符合条件的教程"
              description="试试调整筛选条件或搜索其他关键词"
              action={{ label: '清除筛选', onClick: () => { setCategory('all'); setDifficulty('all'); setTimeFilter('all'); setSearchQuery('') }}}
            />
          ) : (
            <>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {filteredTutorials.map((t) => (
                    <StaggerItem key={t.id}>
                      <TutorialCard
                        tutorial={{
                          id: t.slug,
                          title: t.title,
                          cover_url: t.cover_url,
                          category: t.category,
                          difficulty: t.difficulty,
                          duration_minutes: t.duration_minutes,
                          author: t.author,
                          favorites_count: t.favorites_count,
                          steps: t.steps.length,
                        }}
                        variant="grid"
                      />
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination current={page} total={totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default function TutorialListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><CardGridSkeleton count={6} cols={3} /></div>}>
      <TutorialListContent />
    </Suspense>
  )
}
