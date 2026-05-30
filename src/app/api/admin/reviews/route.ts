import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { id, action } = await request.json()
  // In real app: update review status in DB
  return NextResponse.json({ success: true, id, status: action === 'approve' ? 'approved' : 'rejected' })
}
