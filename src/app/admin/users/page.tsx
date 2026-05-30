// ─── 野造 · 用户管理 ───
'use client'

import { useState, useEffect } from 'react'
import { Search, Ban, CheckCircle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FilterPanel } from '@/components/shared/filter-panel'
import { SectionHeader } from '@/components/shared/section-header'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

interface UserItem { id: string; nickname: string; phone: string; status: string; created_at: string; works: number }

export default function UserManage() {
  const [items, setItems] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ status })
    if (q) params.set('q', q)
    fetch(`/api/admin/users?${params}`).then((r) => r.json()).then((d) => setItems(d.items)).finally(() => setLoading(false))
  }, [q, status])

  return (
    <div className="p-4 lg:p-8 max-w-7xl">
      <SectionHeader title="👥 用户管理" description={`共 ${items.length} 人`} size="sm" />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clay-400" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索昵称或手机号..." className="pl-10 rounded-xl" /></div>
        <FilterPanel options={[{ key: 'all', label: '全部' }, { key: 'normal', label: '正常' }, { key: 'banned', label: '已封禁' }]} selected={status} onSelect={setStatus} variant="chip" />
      </div>

      <div className="bg-white rounded-2xl border border-clay-100 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>昵称</TableHead><TableHead>手机号</TableHead><TableHead>作品</TableHead><TableHead>注册时间</TableHead><TableHead>状态</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.length === 0 ? <TableRow><TableCell colSpan={6}><EmptyState title="没有找到用户" size="sm" /></TableCell></TableRow> :
              items.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-clay-800">{u.nickname}</TableCell>
                  <TableCell className="text-clay-500">{u.phone}</TableCell>
                  <TableCell>{u.works}</TableCell>
                  <TableCell className="text-clay-400 text-sm">{u.created_at}</TableCell>
                  <TableCell><Badge className={cn('text-xs', u.status === 'normal' ? 'bg-sage-100 text-sage-700' : 'bg-red-100 text-red-600')}>{u.status === 'normal' ? '正常' : '已封禁'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">{u.status === 'normal' ? <><Ban className="h-3 w-3 mr-0.5" />封禁</> : <><CheckCircle className="h-3 w-3 mr-0.5" />解封</>}</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
