// ─── 野造 · POST/GET /api/favorites ───
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import { CommunityService } from '@/lib/supabase/services'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') ?? undefined
  const userFavorites = await CommunityService.getUserFavorites(user.id, type)
  return NextResponse.json(userFavorites)
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const result = await CommunityService.toggleFavorite(user.id, body.itemType as 'tutorial' | 'material' | 'post', body.itemId)
  return NextResponse.json(result, { status: result.favorited ? 201 : 200 })
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get('itemId')
  const itemType = searchParams.get('itemType')
  if (!itemId || !itemType) {
    return NextResponse.json({ error: 'itemId and itemType are required' }, { status: 400 })
  }
  await CommunityService.toggleFavorite(user.id, itemType as 'tutorial' | 'material' | 'post', itemId)
  return NextResponse.json({ success: true })
}
