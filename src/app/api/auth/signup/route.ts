// ─── 野造 · POST /api/auth/signup ───
// Uses service_role to create confirmed users (bypasses email verification)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

export async function POST(request: NextRequest) {
  const { email, password, nickname } = await request.json()

  if (!email || !password || !nickname) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Create user with email already confirmed (no verification needed)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nickname },
  })

  if (error) {
    // Translate common errors
    if (error.message.includes('already been registered') || error.message.includes('already exists')) {
      return NextResponse.json({ error: '该邮箱已注册，请直接登录' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

