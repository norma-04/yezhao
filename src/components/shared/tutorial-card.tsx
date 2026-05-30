// ─── 野造 · Tutorial Card 组件 ───
// 用途: 教程卡片（网格 / 横向 / 紧凑型）
// Props: tutorial, variant, showAuthor
// 使用场景: 教程列表、首页热门、搜索列表

import Link from 'next/link'
import { Clock, Heart } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DifficultyBadge } from './difficulty-badge'
import { CategoryBadge } from './category-badge'
import { cn } from '@/lib/utils'
import type { Category, Difficulty, Author } from '@/lib/types'

interface TutorialCardData {
  id: string
  title: string
  cover_url: string | null
  category: Category
  difficulty: Difficulty
  duration_minutes: number
  author: Author
  favorites_count: number
  steps?: number
}

interface TutorialCardProps {
  tutorial: TutorialCardData
  variant?: 'grid' | 'horizontal' | 'compact'
  showAuthor?: boolean
  className?: string
}

const catGradients: Record<Category, string> = {
  weaving: 'bg-gradient-to-br from-amber-100 to-orange-100',
  leather: 'bg-gradient-to-br from-stone-200 to-amber-100',
  woodwork: 'bg-gradient-to-br from-amber-100 to-yellow-100',
  clay: 'bg-gradient-to-br from-rose-100 to-pink-100',
  embroidery: 'bg-gradient-to-br from-green-50 to-emerald-100',
  other: 'bg-gradient-to-br from-purple-50 to-violet-100',
}

const catEmoji: Record<Category, string> = {
  weaving: '🧶', leather: '👜', woodwork: '🪵', clay: '🏺', embroidery: '🪡', other: '✨',
}

export function TutorialCard({ tutorial: t, variant = 'grid', showAuthor = true, className }: TutorialCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/tutorials/${t.id}`} className={cn('block group', className)}>
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white card-hover">
          <div className={cn('h-16 w-16 rounded-xl shrink-0 flex items-center justify-center text-2xl', catGradients[t.category])}>
            <span>{catEmoji[t.category]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <DifficultyBadge difficulty={t.difficulty} className="mb-1" />
            <h4 className="font-medium text-clay-800 text-sm truncate group-hover:text-clay-600 transition-colors">{t.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-clay-400">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration_minutes}分钟</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{t.favorites_count}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/tutorials/${t.id}`} className={cn('block group', className)}>
        <div className="flex gap-5 p-4 rounded-2xl bg-white card-hover">
          <div className={cn('w-40 lg:w-52 aspect-[4/3] rounded-xl shrink-0 flex items-center justify-center text-4xl', catGradients[t.category])}>
            <span>{catEmoji[t.category]}</span>
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={t.category} />
              <DifficultyBadge difficulty={t.difficulty} />
            </div>
            <h3 className="font-serif text-lg font-medium text-clay-800 group-hover:text-clay-600 transition-colors">{t.title}</h3>
            {showAuthor && (
              <div className="flex items-center gap-2 mt-3">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-xs bg-clay-200 text-clay-600">{t.author.nickname[0]}</AvatarFallback></Avatar>
                <span className="text-sm text-clay-500">{t.author.nickname}</span>
              </div>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-clay-400">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration_minutes}分钟</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{t.favorites_count}</span>
              {t.steps && <span>{t.steps}个步骤</span>}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // grid (default)
  return (
    <Link href={`/tutorials/${t.id}`} className={cn('block group', className)}>
      <div className="rounded-2xl bg-white overflow-hidden card-hover">
        {/* Cover */}
        <div className={cn('aspect-[4/3] flex items-center justify-center text-5xl', catGradients[t.category])}>
          <span className="opacity-40">{catEmoji[t.category]}</span>
        </div>
        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <DifficultyBadge difficulty={t.difficulty} />
            <CategoryBadge category={t.category} className="hidden lg:inline-flex" />
          </div>
          <h3 className="font-serif font-medium text-clay-800 group-hover:text-clay-600 transition-colors line-clamp-1">{t.title}</h3>
          <div className="flex items-center justify-between mt-3">
            {showAuthor ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-xs bg-clay-200 text-clay-600">{t.author.nickname[0]}</AvatarFallback></Avatar>
                <span className="text-xs text-clay-500">{t.author.nickname}</span>
              </div>
            ) : (
              <span className="text-xs text-clay-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />{t.duration_minutes}分钟
              </span>
            )}
            <span className="text-xs text-clay-400 flex items-center gap-1">
              <Heart className="h-3 w-3" />{t.favorites_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
