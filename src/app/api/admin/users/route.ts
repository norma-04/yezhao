import { NextRequest, NextResponse } from 'next/server'
import { ProfileService } from '@/lib/supabase/services'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const status = searchParams.get('status') ?? 'all'
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)
  const result = await ProfileService.listUsers({ search: q, status, page, limit })
  return NextResponse.json(result)
}
