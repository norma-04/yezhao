// ─── 野造 · GET /api/me ───
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import { ProfileService } from '@/lib/supabase/services'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [profile, stats] = await Promise.all([
    ProfileService.getProfile(user.id),
    ProfileService.getUserStats(user.id),
  ])

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json({ ...profile, stats })
}
