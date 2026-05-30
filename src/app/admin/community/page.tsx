// ─── 野造 · 社区管理 ───
'use client'

import { useState, useEffect } from 'react'
import { Check, X, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FilterPanel } from '@/components/shared/filter-panel'
import { SectionHeader } from '@/components/shared/section-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/shared/loading-skeleton'
import type { PendingReview } from '@/data/admin'
import type { CommunityPost, CommunityComment } from '@/data/community'
import { cn } from '@/lib/utils'

const TABS = [{ key: 'reviews', label: '待审核' }, { key: 'posts', label: '帖子管理' }, { key: 'comments', label: '评论管理' }]

export default function CommunityManage() {
  const [tab, setTab] = useState('reviews')
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/community?tab=${tab}`).then((r) => r.json()).then((d) => {
      if (tab === 'reviews') setReviews(d.items)
      if (tab === 'posts') setPosts(d.items)
      if (tab === 'comments') setComments(d.items)
    }).finally(() => setLoading(false))
  }, [tab])

  const handleReview = (id: string, action: 'approve' | 'reject') => {
    fetch('/api/admin/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) })
      .then(() => setReviews((prev) => prev.filter((r) => r.id !== id)))
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl">
      <SectionHeader title="🛡️ 社区管理" size="sm" />
      <FilterPanel options={TABS} selected={tab} onSelect={setTab} variant="pill" className="mb-6" />

      <div className="bg-white rounded-2xl border border-clay-100 overflow-hidden">
        {loading ? <div className="p-6"><Skeleton className="h-48 w-full rounded-xl" /></div> : (
          <Table>
            <TableHeader><TableRow>
              {tab === 'reviews' && <><TableHead>内容</TableHead><TableHead>作者</TableHead><TableHead>类型</TableHead><TableHead>时间</TableHead><TableHead className="text-right">操作</TableHead></>}
              {tab === 'posts' && <><TableHead>标题</TableHead><TableHead>作者</TableHead><TableHead>话题</TableHead><TableHead>状态</TableHead><TableHead className="text-right">操作</TableHead></>}
              {tab === 'comments' && <><TableHead>内容</TableHead><TableHead>作者</TableHead><TableHead>时间</TableHead><TableHead className="text-right">操作</TableHead></>}
            </TableRow></TableHeader>
            <TableBody>
              {tab === 'reviews' && (reviews.length === 0 ? <TableRow><TableCell colSpan={5}><EmptyState title="没有待审核内容" size="sm" /></TableCell></TableRow> :
                reviews.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-clay-800">{r.title}</TableCell>
                    <TableCell>{r.author}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{r.type === 'post' ? '帖子' : '评论'}</Badge></TableCell>
                    <TableCell className="text-clay-400 text-sm">{r.created_at}</TableCell>
                    <TableCell className="text-right"><div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-sage-500" onClick={() => handleReview(r.id, 'approve')}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => handleReview(r.id, 'reject')}><X className="h-4 w-4" /></Button>
                    </div></TableCell>
                  </TableRow>
                ))
              )}
              {tab === 'posts' && posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-clay-800 max-w-[250px] truncate">{p.title}</TableCell>
                  <TableCell>{p.author.nickname}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{{ showcase: '成品展示', newbie: '新手避坑', review: '材料测评', activity: '活动专区' }[p.topic]}</Badge></TableCell>
                  <TableCell><Badge className="bg-sage-100 text-sage-700 text-xs">已通过</Badge></TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
              {tab === 'comments' && comments.slice(0, 10).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-clay-800 max-w-[300px] truncate">{c.content}</TableCell>
                  <TableCell>{c.author.nickname}</TableCell>
                  <TableCell className="text-clay-400 text-sm">{c.created_at}</TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
