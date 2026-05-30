// ─── 野造 · GET /api/materials ───
import { NextRequest, NextResponse } from 'next/server'
import { allMaterials } from '@/data/materials'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? 'all'
  const sort = searchParams.get('sort') ?? 'rating'
  const limit = parseInt(searchParams.get('limit') ?? '12')

  let result = [...allMaterials]
  if (category !== 'all') result = result.filter((m) => m.category === category)
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
  else if (sort === 'price_asc') result.sort((a, b) => a.price_level.length - b.price_level.length)
  else if (sort === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return NextResponse.json({ items: result.slice(0, limit), total: result.length })
}
