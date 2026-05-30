import { NextResponse } from 'next/server'
import { mockChallenges } from '@/data/user-center'

export async function GET() {
  return NextResponse.json({ items: mockChallenges })
}
