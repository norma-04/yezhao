import { NextRequest, NextResponse } from 'next/server'
import { allMaterials } from '@/data/materials'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase() ?? ''
  const category = searchParams.get('category') ?? 'all'
  let items = [...allMaterials]
  if (q) items = items.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
  if (category !== 'all') items = items.filter((m) => m.category === category)
  return NextResponse.json({ items, total: items.length })
}
