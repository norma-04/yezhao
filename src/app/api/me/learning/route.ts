import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import { ProfileService, TutorialService } from '@/lib/supabase/services'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.id
  const [items, stats] = await Promise.all([
    TutorialService.getUserLearningList(userId),
    ProfileService.getUserStats(userId),
  ])

  return NextResponse.json({ items, stats })
}
