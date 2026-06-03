import { NextRequest, NextResponse } from 'next/server'
import { TutorialService } from '@/lib/supabase/services'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase() ?? ''
  const category = searchParams.get('category') ?? 'all'
  const status = searchParams.get('status') ?? 'all'
  const { items, total } = await TutorialService.listAllTutorials({ search: q || undefined, category, status })
  return NextResponse.json({ items, total })
}
