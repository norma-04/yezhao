import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ success: true, ...body })
}
