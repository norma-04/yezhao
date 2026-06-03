import { NextRequest, NextResponse } from 'next/server'
import { createServerClientWithCookies } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerClientWithCookies()
  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const supabase = await createServerClientWithCookies()

  for (const [key, value] of Object.entries(body)) {
    await supabase.from('site_settings').upsert({ key, value } as never, { onConflict: 'key' })
  }

  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
