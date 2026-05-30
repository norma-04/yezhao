// ─── 野造 · GET/DELETE /api/me/favorites ───
import { NextRequest, NextResponse } from 'next/server'
import { mockFavorites } from '@/data/user-center'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const items = type ? mockFavorites.filter((f) => f.type === type) : mockFavorites
  return NextResponse.json({ items, total: items.length })
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  // In real app: delete from DB
  return NextResponse.json({ success: true, id })
}
