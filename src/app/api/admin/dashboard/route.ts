import { NextResponse } from 'next/server'
import { NotificationService } from '@/lib/supabase/services'

export async function GET() {
  const stats = await NotificationService.getAdminStats()
  return NextResponse.json({ stats, userGrowth: [], categoryDistribution: [], communityActivity: [], logs: [] })
}
