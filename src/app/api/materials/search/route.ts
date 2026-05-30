// ─── 野造 · GET /api/materials/search?q= ───
import { NextRequest, NextResponse } from 'next/server'
import { searchMaterials } from '@/data/materials'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json({ items: [], total: 0 })
  const items = searchMaterials(q)
  return NextResponse.json({ items, total: items.length })
}
