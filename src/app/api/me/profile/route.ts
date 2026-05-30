import { NextRequest, NextResponse } from 'next/server'
import { mockProfile } from '@/data/user-center'

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ ...mockProfile, ...body })
}
