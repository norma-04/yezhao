// ─── 野造 · GET /api/materials/category?slug= ───
import { NextRequest, NextResponse } from 'next/server'
import * as MaterialService from '@/lib/supabase/services/material.service'
import { CATEGORY_LABELS } from '@/lib/types'

const labelMap: Record<string, string> = CATEGORY_LABELS

function labelFromName(name: string): string {
  return labelMap[name] || name
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (slug) {
    const categories = await MaterialService.getMaterialCategories()
    const found = categories.find((c) => c === slug)
    if (!found) return NextResponse.json({ error: '类别未找到' }, { status: 404 })
    const category = { slug, name: labelFromName(slug) }
    const { items } = await MaterialService.getMaterials({ category: slug })
    return NextResponse.json({ category, materials: items })
  }
  const categories = await MaterialService.getMaterialCategories()
  return NextResponse.json(categories.map((c) => ({ slug: c, name: labelFromName(c) })))
}
