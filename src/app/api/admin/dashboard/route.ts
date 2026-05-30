import { NextResponse } from 'next/server'
import { adminStats, userGrowthData, tutorialCategoryData, communityActivityData, adminLogs } from '@/data/admin'

export async function GET() {
  return NextResponse.json({ stats: adminStats, userGrowth: userGrowthData, categoryDistribution: tutorialCategoryData, communityActivity: communityActivityData, logs: adminLogs.slice(0, 8) })
}
