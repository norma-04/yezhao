// ─── 野造 · GET /api/materials ───
import { NextRequest, NextResponse } from 'next/server'
import * as MaterialService from '@/lib/supabase/services/material.service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? 'all'
  const sort = searchParams.get('sort') ?? 'rating'
  const limit = parseInt(searchParams.get('limit') ?? '12')

  const params: Record<string, string> = {}
  if (category !== 'all') params.category = category
  const { items, total } = await MaterialService.getMaterials(params)
  if (sort === 'rating') items.sort((a: any, b: any) => b.rating - a.rating)
  else if (sort === 'price_asc') items.sort((a: any, b: any) => a.price_level.length - b.price_level.length)
  else if (sort === 'newest') items.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return NextResponse.json({ items: items.slice(0, limit), total })
}
