// ─── 野造 · GET /api/me ───
import { NextResponse } from 'next/server'
import { mockProfile } from '@/data/user-center'

export async function GET() {
  return NextResponse.json(mockProfile)
}
