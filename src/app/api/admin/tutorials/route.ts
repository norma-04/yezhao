// ─── 野造 · 教程管理 API ───
import { NextRequest, NextResponse } from 'next/server'
import { createServerClientWithCookies } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClientWithCookies()
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.toLowerCase() ?? ''
    const category = searchParams.get('category') ?? 'all'
    const status = searchParams.get('status') ?? 'all'
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const offset = (page - 1) * limit

    let query = supabase.from('tutorials').select('*', { count: 'exact' })

    if (q) query = query.ilike('title', `%${q}%`)
    if (category !== 'all') query = query.eq('category', category)
    if (status !== 'all') query = query.eq('status', status)

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw new Error(error.message)

    return NextResponse.json({ items: data || [], total: count || 0 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '获取教程失败' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClientWithCookies()
    const body = await request.json()

    const { data, error } = await supabase
      .from('tutorials')
      .insert({
        title: body.title,
        slug: body.slug,
        cover_url: body.cover_url || null,
        video_url: body.video_url || null,
        category: body.category || 'other',
        difficulty: body.difficulty || 'beginner',
        duration_minutes: body.duration_minutes || 0,
        description: body.description || '',
        author_id: body.author_id || null,
        status: body.status || 'draft',
      } as never)
      .select('*')
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '创建教程失败' },
      { status: 500 },
    )
  }
}
