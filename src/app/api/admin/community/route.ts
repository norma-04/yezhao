import { NextRequest, NextResponse } from 'next/server'
import { pendingReviews } from '@/data/admin'
import { communityPosts } from '@/data/community'
import { communityComments } from '@/data/community'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tab = searchParams.get('tab') ?? 'reviews'
  if (tab === 'reviews') return NextResponse.json({ items: pendingReviews })
  if (tab === 'posts') return NextResponse.json({ items: communityPosts.map((p) => ({ ...p, review_status: 'approved' })) })
  if (tab === 'comments') return NextResponse.json({ items: communityComments })
  return NextResponse.json({ items: [] })
}
