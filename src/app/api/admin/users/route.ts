import { NextRequest, NextResponse } from 'next/server'
const users = [
  { id: 'u1', nickname: '小藤匠', phone: '139****1111', status: 'normal', created_at: '2025-06-01', works: 45 },
  { id: 'u2', nickname: '皮匠老李', phone: '139****2222', status: 'normal', created_at: '2025-07-15', works: 32 },
  { id: 'u3', nickname: '木语人', phone: '139****3333', status: 'normal', created_at: '2025-08-20', works: 28 },
  { id: 'u4', nickname: '泥巴匠', phone: '139****4444', status: 'normal', created_at: '2025-09-10', works: 56 },
  { id: 'u5', nickname: '绣绣子', phone: '139****5555', status: 'normal', created_at: '2025-10-05', works: 38 },
  { id: 'u10', nickname: '手工小白', phone: '138****8888', status: 'normal', created_at: '2026-02-15', works: 5 },
  { id: 'u99', nickname: '广告账号001', phone: '136****0000', status: 'banned', created_at: '2026-05-25', works: 0 },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase() ?? ''
  const status = searchParams.get('status') ?? 'all'
  let items = [...users]
  if (q) items = items.filter((u) => u.nickname.toLowerCase().includes(q) || u.phone.includes(q))
  if (status !== 'all') items = items.filter((u) => u.status === status)
  return NextResponse.json({ items, total: items.length })
}
