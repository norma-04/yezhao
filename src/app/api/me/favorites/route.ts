// ─── 野造 · GET/DELETE /api/me/favorites ───
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import { CommunityService } from '@/lib/supabase/services'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || undefined
  const items = await CommunityService.getUserFavorites(user.id, type)
  return NextResponse.json({ items, total: items.length })
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemType, itemId } = await request.json()
  await CommunityService.toggleFavorite(user.id, itemType, itemId)
  return NextResponse.json({ success: true })
}
