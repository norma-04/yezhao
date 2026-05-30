// ─── 野造 · Featured Tutorials Section ───
// 布局: Desktop 4列网格 / Mobile 横向滑动
// 数据: 8个入门教程卡片

'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/shared/section-header'
import { TutorialCard } from '@/components/shared/tutorial-card'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import type { Difficulty, Category, Author } from '@/lib/types'

const featuredTutorials = [
  { id: 't1', title: '初学者藤编收纳篮', category: 'weaving' as Category, difficulty: 'beginner' as Difficulty, duration_minutes: 45, favorites_count: 1234, favorite_count: 1234, author: { id: 'u1', nickname: '小藤匠', avatar_url: null } as Author, cover_url: null, steps: 8 },
  { id: 't3', title: '入门木勺雕刻', category: 'woodwork' as Category, difficulty: 'beginner' as Difficulty, duration_minutes: 90, favorites_count: 2105, favorite_count: 2105, author: { id: 'u3', nickname: '木语人', avatar_url: null } as Author, cover_url: null, steps: 6 },
  { id: 't11', title: '新手皮具：极简卡包', category: 'leather' as Category, difficulty: 'beginner' as Difficulty, duration_minutes: 40, favorites_count: 1789, favorite_count: 1789, author: { id: 'u6', nickname: '皮小新', avatar_url: null } as Author, cover_url: null, steps: 5 },
  { id: 't4', title: '软陶多肉植物盆栽', category: 'clay' as Category, difficulty: 'beginner' as Difficulty, duration_minutes: 60, favorites_count: 1567, favorite_count: 1567, author: { id: 'u4', nickname: '泥巴匠', avatar_url: null } as Author, cover_url: null, steps: 7 },
  { id: 't5', title: '法式刺绣入门：叶片胸针', category: 'embroidery' as Category, difficulty: 'beginner' as Difficulty, duration_minutes: 75, favorites_count: 987, favorite_count: 987, author: { id: 'u5', nickname: '绣绣子', avatar_url: null } as Author, cover_url: null, steps: 9 },
  { id: 't20', title: '编织挂毯入门', category: 'weaving' as Category, difficulty: 'beginner' as Difficulty, duration_minutes: 80, favorites_count: 1890, favorite_count: 1890, author: { id: 'u1', nickname: '小藤匠', avatar_url: null } as Author, cover_url: null, steps: 7 },
  { id: 't12', title: '黏土迷你美食摆件', category: 'clay' as Category, difficulty: 'beginner' as Difficulty, duration_minutes: 50, favorites_count: 2340, favorite_count: 2340, author: { id: 'u4', nickname: '泥巴匠', avatar_url: null } as Author, cover_url: null, steps: 6 },
  { id: 't14', title: '刺绣基础：小花手帕', category: 'embroidery' as Category, difficulty: 'beginner' as Difficulty, duration_minutes: 45, favorites_count: 1450, favorite_count: 1450, author: { id: 'u5', nickname: '绣绣子', avatar_url: null } as Author, cover_url: null, steps: 6 },
]

// Normalize for TutorialCard
const cards = featuredTutorials.map(t => ({
  id: t.id,
  title: t.title,
  cover_url: t.cover_url,
  category: t.category,
  difficulty: t.difficulty,
  duration_minutes: t.duration_minutes,
  author: t.author,
  favorites_count: t.favorites_count,
  steps: t.steps,
}))

export function FeaturedTutorialsSection() {
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
      </div>
    </section>
  )
}
