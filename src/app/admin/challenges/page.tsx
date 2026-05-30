// ─── 野造 · 挑战管理 ───
'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SectionHeader } from '@/components/shared/section-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/shared/loading-skeleton'
import type { ChallengeData } from '@/data/user-center'

export default function ChallengeManage() {
  const [items, setItems] = useState<ChallengeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/challenges').then((r) => r.json()).then((d) => setItems(d.items)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 lg:p-8 max-w-7xl">
      <SectionHeader title="🎪 挑战管理" description={`共 ${items.length} 个挑战`} size="sm"
        action={<Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1" />创建挑战</Button>} />

      <div className="bg-white rounded-2xl border border-clay-100 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>挑战名称</TableHead><TableHead>目标天数</TableHead><TableHead>进度</TableHead><TableHead>连续天数</TableHead><TableHead>截止日期</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6}><Skeleton className="h-12 w-full rounded" /></TableCell></TableRow> :
              items.length === 0 ? <TableRow><TableCell colSpan={6}><EmptyState title="暂无挑战" size="sm" /></TableCell></TableRow> :
                items.map((ch) => (
                  <TableRow key={ch.id}>
                    <TableCell className="font-medium text-clay-800"><span className="mr-2">{ch.icon}</span>{ch.title}</TableCell>
                    <TableCell>{ch.target_days} 天</TableCell>
                    <TableCell><div className="flex items-center gap-2"><div className="w-20 h-1.5 bg-clay-100 rounded-full overflow-hidden"><div className="h-full bg-clay-500 rounded-full" style={{ width: `${(ch.completed_days / ch.target_days) * 100}%` }} /></div><span className="text-xs text-clay-500">{ch.completed_days}/{ch.target_days}</span></div></TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><Flame className="h-3.5 w-3.5 text-warm-500" /> {ch.current_streak} 天</span></TableCell>
                    <TableCell className="text-clay-400 text-sm">{ch.end_date}</TableCell>
                    <TableCell className="text-right"><div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div></TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
