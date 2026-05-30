import { NextResponse } from 'next/server'
import { mockLearning, mockProfile } from '@/data/user-center'

export async function GET() {
  return NextResponse.json({ items: mockLearning, stats: mockProfile.stats })
}
