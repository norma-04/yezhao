// ─── 野造 · GET/POST /api/comments ───
import { NextRequest, NextResponse } from 'next/server'

interface Comment {
  id: string; tutorialSlug: string; author: { name: string; avatar: string | null }
  content: string; createdAt: string; parentId: string | null
}
const comments: Comment[] = [
  { id: 'c1', tutorialSlug: 'beginner-weaving-basket', author: { name: '编织控', avatar: null }, content: '藤条在哪里买呀？', createdAt: '2026-05-26', parentId: null },
  { id: 'c2', tutorialSlug: 'beginner-weaving-basket', author: { name: '小藤匠', avatar: null }, content: '在淘宝手作材料行买印尼藤条就行~', createdAt: '2026-05-26', parentId: 'c1' },
  { id: 'c3', tutorialSlug: 'handmade-leather-wallet', author: { name: '皮皮虾', avatar: null }, content: '第一次做皮具就是跟着这个教程，非常详细！', createdAt: '2026-05-20', parentId: null },
  { id: 'c4', tutorialSlug: 'wooden-spoon-carving', author: { name: '木木夕', avatar: null }, content: '用椴木真的很好刻，推荐新手用椴木', createdAt: '2026-05-18', parentId: null },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tutorialSlug = searchParams.get('tutorial')
  const result = tutorialSlug ? comments.filter((c) => c.tutorialSlug === tutorialSlug) : comments
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const comment: Comment = {
    id: `c${Date.now()}`,
    tutorialSlug: body.tutorialSlug,
    author: { name: body.authorName ?? '手工小白', avatar: null },
    content: body.content,
    createdAt: new Date().toISOString().split('T')[0],
    parentId: body.parentId ?? null,
  }
  comments.push(comment)
  return NextResponse.json(comment, { status: 201 })
}
