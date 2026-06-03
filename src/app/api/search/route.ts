// ─── 野造 · GET /api/search?q=&type= ───
import { NextRequest, NextResponse } from 'next/server'
import * as TutorialService from '@/lib/supabase/services/tutorial.service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? 'all'

  if (!query.trim()) {
    return NextResponse.json({ tutorials: [], materials: [], posts: [] })
  }

  const tutorials = type === 'all' || type === 'tutorial'
    ? (await TutorialService.getTutorials({ search: query, limit: 12 })).items
    : []

  // Materials & posts would be searched here when those modules exist
  return NextResponse.json({
    tutorials,
    materials: [],
    posts: [],
  })
}
