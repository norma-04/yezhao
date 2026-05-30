// ─── 野造 · 材料管理 ───
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FilterPanel } from '@/components/shared/filter-panel'
import { SectionHeader } from '@/components/shared/section-header'
import { EmptyState } from '@/components/shared/empty-state'
import type { MaterialData } from '@/data/materials'

const CAT_OPTIONS = [{ key: 'all', label: '全部' }, { key: 'weaving', label: '编织' }, { key: 'leather', label: '皮具' }, { key: 'woodwork', label: '木工' }, { key: 'clay', label: '黏土' }, { key: 'embroidery', label: '刺绣' }]
const catLabels = { weaving: '编织', leather: '皮具', woodwork: '木工', clay: '黏土', embroidery: '刺绣', other: '其他' }

export default function MaterialManage() {
  const [items, setItems] = useState<MaterialData[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ category })
    if (q) params.set('q', q)
    fetch(`/api/admin/materials?${params}`).then((r) => r.json()).then((d) => setItems(d.items)).finally(() => setLoading(false))
  }, [q, category])

  return (
    <div className="p-4 lg:p-8 max-w-7xl">
      <SectionHeader title="📦 材料管理" description={`共 ${items.length} 条`} size="sm"
        action={<Link href="/admin/materials/new"><Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1" />新增材料</Button></Link>} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clay-400" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索材料..." className="pl-10 rounded-xl" /></div>
        <FilterPanel options={CAT_OPTIONS} selected={category} onSelect={setCategory} variant="chip" />
      </div>

      <div className="bg-white rounded-2xl border border-clay-100 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>名称</TableHead><TableHead>品类</TableHead><TableHead>评分</TableHead><TableHead>价格</TableHead><TableHead>创建时间</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={6}><EmptyState title="没有找到材料" size="sm" /></TableCell></TableRow>
            ) : items.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium text-clay-800 max-w-[200px] truncate">{m.name}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{catLabels[m.category] || m.category}</Badge></TableCell>
                <TableCell>⭐ {m.rating}</TableCell>
                <TableCell>{m.price_level}</TableCell>
                <TableCell className="text-clay-400 text-sm">{m.created_at}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/materials/${m.slug}/edit`}><Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Edit className="h-3.5 w-3.5" /></Button></Link>
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
