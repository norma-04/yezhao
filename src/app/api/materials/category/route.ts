// ─── 野造 · GET /api/materials/category?slug= ───
import { NextRequest, NextResponse } from 'next/server'
import { getMaterialsByCategory, materialCategories } from '@/data/materials'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (slug) {
    const category = materialCategories.find((c) => c.slug === slug)
    const materials = getMaterialsByCategory(slug)
    return NextResponse.json({ category, materials })
  }
  return NextResponse.json(materialCategories)
}
