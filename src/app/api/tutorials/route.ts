// ─── 野造 · GET /api/tutorials ───
import { NextRequest, NextResponse } from 'next/server'
import * as TutorialService from '@/lib/supabase/services/tutorial.service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? 'all'
  const difficulty = searchParams.get('difficulty') ?? 'all'
  const sort = searchParams.get('sort') ?? 'latest'
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  const query = searchParams.get('q') ?? ''

  const { items, total } = await TutorialService.getTutorials({
    category,
    difficulty,
    sort,
    search: query || undefined,
    page,
    limit,
  })

  const totalPages = Math.ceil(total / limit)

  return NextResponse.json({ items, total, totalPages, page, limit })
}
