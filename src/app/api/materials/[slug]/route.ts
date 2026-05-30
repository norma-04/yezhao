// ─── 野造 · GET /api/materials/[slug] ───
import { NextRequest, NextResponse } from 'next/server'
import { getMaterialBySlug } from '@/data/materials'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const material = getMaterialBySlug(slug)
  if (!material) return NextResponse.json({ error: '材料未找到' }, { status: 404 })
  return NextResponse.json(material)
}
