import { NextResponse } from 'next/server'
import { mockChallenges, mockBadges, mockCheckIns, mockLeaderboard } from '@/data/user-center'

export async function GET() {
  return NextResponse.json({ challenges: mockChallenges, badges: mockBadges, checkIns: mockCheckIns, leaderboard: mockLeaderboard })
}
