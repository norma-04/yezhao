// ─── 野造 · Featured Tutorials Section ───
// 布局: Desktop 4列网格 / Mobile 横向滑动
// 数据: 从 Supabase API 获取入门教程

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/shared/section-header'
import { TutorialCard } from '@/components/shared/tutorial-card'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import { CardGridSkeleton } from '@/components/shared/loading-skeleton'
import type { Difficulty, Category, Author } from '@/lib/types'

interface ApiTutorial {
  id: string
  slug: string
  title: string
  cover_url: string | null
  category: Category
  difficulty: Difficulty
  duration_minutes: number
  favorites_count: number
  author: Author
  steps?: number
}

export function FeaturedTutorialsSection() {
  const [tutorials, setTutorials] = useState<ApiTutorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tutorials?sort=popular&limit=8')
      .then((r) => r.json())
      .then((data) => {
        const items = data.items || data.tutorials || data || []
        setTutorials(items)
      })
      .catch(() => {
        // Fallback: empty state, no hardcoded data
        setTutorials([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Normalize for TutorialCard — use slug as id so links go to the correct page
  const cards = tutorials.map((t) => ({
    id: t.slug || t.id,
    title: t.title,
    cover_url: t.cover_url,
    category: t.category,
    difficulty: t.difficulty,
    duration_minutes: t.duration_minutes,
    author: t.author,
    favorites_count: t.favorites_count,
    steps: t.steps,
  }))

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeUp>
          <SectionHeader
            title="从这里开始你的第一件作品"
            description="精选适合入门的教程，零基础也能轻松上手"
            action={
              <Link href="/tutorials">
                <Button variant="ghost" className="rounded-full text-clay-600">
                  查看全部 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            }
          />
        </FadeUp>

        {loading ? (
          <CardGridSkeleton count={8} cols={4} />
        ) : cards.length === 0 ? (
          <p className="text-center text-clay-400 py-12">暂无教程，敬请期待</p>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:block">
              <StaggerContainer>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                  {cards.map((t) => (
                    <StaggerItem key={t.id}>
                      <TutorialCard tutorial={t} variant="grid" showAuthor={false} />
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>

            {/* Mobile horizontal scroll */}
            <div className="md:hidden flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {cards.map((t) => (
                <div key={t.id} className="shrink-0 w-[260px]">
                  <TutorialCard tutorial={t} variant="grid" showAuthor={false} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
