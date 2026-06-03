import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import { NotificationService } from '@/lib/supabase/services'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.id

  const [challenges, allBadges, userBadges, checkIns, leaderboard] = await Promise.all([
    NotificationService.getChallenges(),
    NotificationService.getAllBadges(),
    NotificationService.getUserBadges(userId),
    NotificationService.getCheckins(userId),
    NotificationService.getLeaderboard(),
  ])

  return NextResponse.json({
    challenges,
    badges: { all: allBadges, earned: userBadges },
    checkIns,
    leaderboard,
  })
}
