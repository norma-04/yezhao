import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import * as ProfileService from '@/lib/supabase/services/profile.service'

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const updated = await ProfileService.updateProfile(user.id, body)
  return NextResponse.json({ success: true, ...updated })
}
