import { NextRequest, NextResponse } from 'next/server'
import { CommunityService } from '@/lib/supabase/services'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tab = searchParams.get('tab') ?? 'reviews'
  if (tab === 'reviews') {
    const data = await CommunityService.getPendingReviews()
    return NextResponse.json(data)
  }
  if (tab === 'posts') {
    const data = await CommunityService.getPosts()
    return NextResponse.json(data)
  }
  if (tab === 'comments') {
    const postId = searchParams.get('postId') || ''
    const data = await CommunityService.getComments(postId)
    return NextResponse.json({ items: data })
  }
  return NextResponse.json({ items: [] })
}
