import { NextRequest, NextResponse } from 'next/server'
import * as MaterialService from '@/lib/supabase/services/material.service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase() ?? ''
  const category = searchParams.get('category') ?? 'all'
  const result = await MaterialService.listAllMaterials({ search: q, category })
  return NextResponse.json(result)
}
