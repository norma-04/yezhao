// ─── 野造 · Post Card 组件 ───
// 用途: 社区帖子卡片
// Props: post, showContent
// 使用场景: 社区首页、话题列表、我的作品

import Link from 'next/link'
import { Heart, MessageCircle, Image as ImageIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Author } from '@/lib/types'

interface PostCardData {
  id: string
  title: string
  content: string
  images: string[]
  topic: string
  author: Author
  likes_count: number
  comments_count: number
  created_at: string
}

interface PostCardProps {
  post: PostCardData
  showContent?: boolean
  className?: string
}

const topicLabels: Record<string, string> = {
  newbie: '新手避坑', showcase: '成品展示', review: '材料测评', activity: '活动专区', all: '全部',
}

const topicColors: Record<string, string> = {
  newbie: 'bg-green-50 text-green-600', showcase: 'bg-amber-50 text-amber-600',
  review: 'bg-blue-50 text-blue-600', activity: 'bg-rose-50 text-rose-600',
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}分钟前`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}小时前`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}

export function PostCard({ post: p, showContent = false, className }: PostCardProps) {
  return (
    <Link href={`/community/post/${p.id}`} className={cn('block group', className)}>
      <div className="rounded-2xl bg-white overflow-hidden card-hover">
        {/* Image or placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-clay-100 to-clay-50 flex items-center justify-center">
          {p.images.length > 0 ? (
            <div className="w-full h-full bg-clay-200" />
          ) : (
            <ImageIcon className="h-10 w-10 text-clay-300" />
          )}
        </div>

        <div className="p-4 lg:p-5">
          {/* Topic tag */}
          {p.topic !== 'all' && (
            <span className={cn('inline-block px-2 py-0.5 text-xs rounded-full mb-2', topicColors[p.topic] || 'bg-clay-100 text-clay-600')}>
              {topicLabels[p.topic] || p.topic}
            </span>
          )}

          <h3 className="font-serif font-medium text-clay-800 group-hover:text-clay-600 transition-colors line-clamp-1">
            {p.title}
          </h3>

          {showContent && (
            <p className="text-sm text-clay-500 mt-1.5 line-clamp-2 leading-relaxed">{p.content}</p>
          )}

          {/* Meta row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-clay-50">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-clay-200 text-clay-600">{p.author.nickname[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-clay-500">{p.author.nickname}</span>
              <span className="text-xs text-clay-300">{formatTime(p.created_at)}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-clay-400">
              <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{p.likes_count}</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{p.comments_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
