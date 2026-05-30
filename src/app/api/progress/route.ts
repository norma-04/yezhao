// ─── 野造 · POST/GET /api/progress ───
import { NextRequest, NextResponse } from 'next/server'

interface Progress {
  userId: string; tutorialSlug: string; tutorialTitle: string
  completedSteps: number; totalSteps: number; completedStepIds: string[]
  lastLearnedAt: string
}
const progressStore: Progress[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') ?? 'u10'
  const tutorialSlug = searchParams.get('tutorial')
  if (tutorialSlug) {
    const p = progressStore.find((x) => x.userId === userId && x.tutorialSlug === tutorialSlug)
    return NextResponse.json(p ?? { completedSteps: 0, completedStepIds: [] })
  }
  return NextResponse.json(progressStore.filter((x) => x.userId === userId))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId = 'u10', tutorialSlug, tutorialTitle, stepId, totalSteps } = body
  let p = progressStore.find((x) => x.userId === userId && x.tutorialSlug === tutorialSlug)
  if (!p) {
    p = { userId, tutorialSlug, tutorialTitle, completedSteps: 0, totalSteps, completedStepIds: [], lastLearnedAt: '' }
    progressStore.push(p)
  }
  if (stepId && !p.completedStepIds.includes(stepId)) {
    p.completedStepIds.push(stepId)
    p.completedSteps = p.completedStepIds.length
  }
  p.lastLearnedAt = new Date().toISOString()
  return NextResponse.json(p)
}
