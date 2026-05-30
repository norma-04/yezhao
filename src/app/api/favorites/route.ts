// ─── 野造 · POST/GET /api/favorites ───
import { NextRequest, NextResponse } from 'next/server'

let favorites: { id: string; userId: string; itemType: string; itemId: string; itemTitle: string; createdAt: string }[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') ?? 'u10'
  const type = searchParams.get('type')
  const userFavorites = type
    ? favorites.filter((f) => f.userId === userId && f.itemType === type)
    : favorites.filter((f) => f.userId === userId)
  return NextResponse.json(userFavorites)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const fav = {
    id: `fav_${Date.now()}`,
    userId: body.userId ?? 'u10',
    itemType: body.itemType,
    itemId: body.itemId,
    itemTitle: body.itemTitle,
    createdAt: new Date().toISOString(),
  }
  // Check duplicate
  const exists = favorites.find((f) => f.userId === fav.userId && f.itemId === fav.itemId && f.itemType === fav.itemType)
  if (exists) {
    return NextResponse.json(exists, { status: 200 })
  }
  favorites = [fav, ...favorites]
  return NextResponse.json(fav, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get('itemId')
  const itemType = searchParams.get('itemType')
  const userId = searchParams.get('userId') ?? 'u10'
  favorites = favorites.filter((f) => !(f.userId === userId && f.itemId === itemId && f.itemType === itemType))
  return NextResponse.json({ success: true })
}
