// ─── 野造 · GET /api/tutorials/[slug] ───
import { NextRequest, NextResponse } from 'next/server'
import * as TutorialService from '@/lib/supabase/services/tutorial.service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const tutorial = await TutorialService.getTutorialBySlug(slug)

  if (!tutorial) {
    return NextResponse.json({ error: '教程未找到' }, { status: 404 })
  }

  return NextResponse.json(tutorial)
}
