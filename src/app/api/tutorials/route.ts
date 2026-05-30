// ─── 野造 · GET /api/tutorials ───
import { NextRequest, NextResponse } from 'next/server'
import { allTutorials } from '@/data/tutorials'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? 'all'
  const difficulty = searchParams.get('difficulty') ?? 'all'
  const sort = searchParams.get('sort') ?? 'latest'
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  const query = searchParams.get('q') ?? ''

  let result = [...allTutorials]

  if (query) {
    const q = query.toLowerCase()
    result = result.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  }
  if (category !== 'all') result = result.filter((t) => t.category === category)
  if (difficulty !== 'all') result = result.filter((t) => t.difficulty === difficulty)

  if (sort === 'popular') result.sort((a, b) => b.learners_count - a.learners_count)
  else if (sort === 'favorites') result.sort((a, b) => b.favorites_count - a.favorites_count)
  else result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const total = result.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const items = result.slice(start, start + limit)

  return NextResponse.json({ items, total, totalPages, page, limit })
}
