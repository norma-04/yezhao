// ─── 野造 · GET /api/search?q=&type= ───
import { NextRequest, NextResponse } from 'next/server'
import { searchTutorials } from '@/data/tutorials'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? 'all'

  if (!query.trim()) {
    return NextResponse.json({ tutorials: [], materials: [], posts: [] })
  }

  const tutorials = type === 'all' || type === 'tutorial'
    ? searchTutorials(query).slice(0, 12)
    : []

  // Materials & posts would be searched here when those modules exist
  return NextResponse.json({
    tutorials,
    materials: [],
    posts: [],
  })
}
