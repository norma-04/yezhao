import { NextRequest, NextResponse } from 'next/server'
import { createServerClientWithCookies, getCurrentUser } from '@/lib/supabase/server'
import { ProfileService } from '@/lib/supabase/services'

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const updatedProfile = await ProfileService.updateProfile(user.id, body)
  const stats = await ProfileService.getUserStats(user.id)

  return NextResponse.json({ ...updatedProfile, stats })
}
