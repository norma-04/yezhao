// ─── 野造 · 单条教程 API ───
import { NextRequest, NextResponse } from 'next/server'
import { createServerClientWithCookies } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createServerClientWithCookies()
    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.cover_url !== undefined) updateData.cover_url = body.cover_url || null
    if (body.video_url !== undefined) updateData.video_url = body.video_url || null
    if (body.category !== undefined) updateData.category = body.category
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty
    if (body.duration_minutes !== undefined) updateData.duration_minutes = body.duration_minutes
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status

    const { data, error } = await supabase
      .from('tutorials')
      .update(updateData as never)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(error.message)
    if (!data) return NextResponse.json({ error: '教程不存在' }, { status: 404 })

    return NextResponse.json({ item: data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '更新教程失败' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createServerClientWithCookies()
    const { id } = await params

    const { error } = await supabase.from('tutorials').delete().eq('id', id)

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '删除教程失败' },
      { status: 500 },
    )
  }
}
