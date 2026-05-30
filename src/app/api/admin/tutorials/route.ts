import { NextRequest, NextResponse } from 'next/server'
import { allTutorials } from '@/data/tutorials'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase() ?? ''
  const category = searchParams.get('category') ?? 'all'
  const status = searchParams.get('status') ?? 'all'
  let items = [...allTutorials]
  if (q) items = items.filter((t) => t.title.toLowerCase().includes(q))
  if (category !== 'all') items = items.filter((t) => t.category === category)
  if (status !== 'all') items = items.filter((t) => t.status === status)
  return NextResponse.json({ items, total: items.length })
}
