// ─── 野造 · Material Card 组件 ───
// 用途: 材料指导卡片
// Props: material, variant
// 使用场景: 材料列表、材料详情推荐、首页材料精选

import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { CategoryBadge } from './category-badge'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

interface MaterialCardData {
  id: string
  name: string
  category: Category
  image_url: string | null
  description: string
  purchase_links?: { platform: string; price: string | null }[]
}

interface MaterialCardProps {
  material: MaterialCardData
  variant?: 'grid' | 'horizontal' | 'compact'
  className?: string
}

const catGradients: Record<Category, string> = {
  weaving: 'bg-gradient-to-br from-amber-50 to-orange-50',
  leather: 'bg-gradient-to-br from-stone-100 to-amber-50',
  woodwork: 'bg-gradient-to-br from-orange-50 to-yellow-50',
  clay: 'bg-gradient-to-br from-rose-50 to-pink-50',
  embroidery: 'bg-gradient-to-br from-green-50 to-emerald-50',
  other: 'bg-gradient-to-br from-purple-50 to-violet-50',
}

export function MaterialCard({ material: m, variant = 'grid', className }: MaterialCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/materials/${m.id}`} className={cn('block group', className)}>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white card-hover">
          <div className={cn('h-14 w-14 rounded-xl shrink-0 flex items-center justify-center text-xl', catGradients[m.category])}>
            <ShoppingBag className="h-5 w-5 text-clay-500" />
          </div>
          <div className="flex-1 min-w-0">
            <CategoryBadge category={m.category} className="mb-1" />
            <h4 className="font-medium text-clay-800 text-sm truncate">{m.name}</h4>
            {m.purchase_links?.[0]?.price && (
              <p className="text-xs text-clay-400 mt-0.5">{m.purchase_links[0].platform} · {m.purchase_links[0].price}</p>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-clay-300 group-hover:text-clay-500 transition-colors shrink-0" />
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/materials/${m.id}`} className={cn('block group', className)}>
        <div className="flex gap-5 p-5 rounded-2xl bg-white card-hover">
          <div className={cn('w-36 h-36 rounded-xl shrink-0 flex items-center justify-center', catGradients[m.category])}>
            <ShoppingBag className="h-8 w-8 text-clay-400" />
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <CategoryBadge category={m.category} className="mb-2 w-fit" />
            <h3 className="font-serif text-lg font-medium text-clay-800">{m.name}</h3>
            <p className="text-sm text-clay-500 mt-1 line-clamp-2">{m.description}</p>
            <div className="flex items-center gap-1 mt-3 text-sm font-medium text-clay-600 group-hover:text-clay-500 transition-colors">
              查看详情 <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // grid
  return (
    <Link href={`/materials/${m.id}`} className={cn('block group', className)}>
      <div className="rounded-2xl bg-white overflow-hidden card-hover">
        <div className={cn('aspect-square flex items-center justify-center', catGradients[m.category])}>
          <ShoppingBag className="h-12 w-12 text-clay-300" />
        </div>
        <div className="p-5">
          <CategoryBadge category={m.category} className="mb-2" />
          <h3 className="font-serif font-medium text-clay-800 group-hover:text-clay-600 transition-colors">{m.name}</h3>
          <p className="text-sm text-clay-500 mt-1 line-clamp-2">{m.description}</p>
          {m.purchase_links?.[0] && (
            <div className="mt-3 pt-3 border-t border-clay-100 flex items-center gap-2 text-xs text-clay-400">
              <span>{m.purchase_links[0].platform}</span>
              {m.purchase_links[0].price && <span className="text-clay-600 font-medium">{m.purchase_links[0].price}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
