import { NextRequest, NextResponse } from 'next/server'
import { systemConfig } from '@/data/admin'

export async function GET() { return NextResponse.json(systemConfig) }

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ ...systemConfig, ...body })
}
