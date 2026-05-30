// ─── 野造 · 教程管理 ───
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FilterPanel } from '@/components/shared/filter-panel'
import { SectionHeader } from '@/components/shared/section-header'
import { Pagination } from '@/components/shared/pagination'
import { EmptyState } from '@/components/shared/empty-state'
import type { Tutorial } from '@/lib/types'
import { cn } from '@/lib/utils'

const CAT_OPTIONS = [{ key: 'all', label: '全部品类' }, { key: 'weaving', label: '编织' }, { key: 'leather', label: '皮具' }, { key: 'woodwork', label: '木工' }, { key: 'clay', label: '黏土' }, { key: 'embroidery', label: '刺绣' }]
const STATUS_OPTIONS = [{ key: 'all', label: '全部状态' }, { key: 'published', label: '已发布' }, { key: 'draft', label: '草稿' }]

export default function TutorialManage() {
  const [items, setItems] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ category, status })
    if (q) params.set('q', q)
    fetch(`/api/admin/tutorials?${params}`).then((r) => r.json()).then((d) => setItems(d.items)).finally(() => setLoading(false))
  }, [q, category, status])

  return (
    <div className="p-4 lg:p-8 max-w-7xl">
      <SectionHeader title="📖 教程管理" description={`共 ${items.length} 条`} size="sm"
        action={<Link href="/admin/tutorials/new"><Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1" />新增教程</Button></Link>} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clay-400" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索教程..." className="pl-10 rounded-xl" /></div>
        <FilterPanel options={CAT_OPTIONS} selected={category} onSelect={setCategory} variant="chip" />
        <FilterPanel options={STATUS_OPTIONS} selected={status} onSelect={setStatus} variant="chip" />
      </div>

      <div className="bg-white rounded-2xl border border-clay-100 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>标题</TableHead><TableHead>品类</TableHead><TableHead>难度</TableHead><TableHead>状态</TableHead><TableHead>创建时间</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={6}><EmptyState title="没有找到教程" size="sm" /></TableCell></TableRow>
            ) : items.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium text-clay-800 max-w-[200px] truncate">{t.title}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{{ weaving: '编织', leather: '皮具', woodwork: '木工', clay: '黏土', embroidery: '刺绣', other: '其他' }[t.category]}</Badge></TableCell>
                <TableCell><Badge className={cn('text-xs', t.difficulty === 'beginner' ? 'bg-sage-100 text-sage-700' : t.difficulty === 'intermediate' ? 'bg-warm-100 text-warm-700' : 'bg-clay-100 text-clay-700')}>{{ beginner: '入门', intermediate: '进阶', advanced: '挑战' }[t.difficulty]}</Badge></TableCell>
                <TableCell><Badge className={t.status === 'published' ? 'bg-sage-100 text-sage-700' : 'bg-clay-100 text-clay-700'}>{t.status === 'published' ? '已发布' : '草稿'}</Badge></TableCell>
                <TableCell className="text-clay-400 text-sm">{t.created_at}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/tutorials/${t.slug}/edit`}><Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Edit className="h-3.5 w-3.5" /></Button></Link>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
