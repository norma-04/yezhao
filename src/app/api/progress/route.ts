// ─── 野造 · POST/GET /api/progress ───
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/server'
import { TutorialService } from '@/lib/supabase/services'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const tutorialSlug = searchParams.get('tutorial')

  if (tutorialSlug) {
    const tutorial = await TutorialService.getTutorialBySlug(tutorialSlug)
    if (!tutorial) return NextResponse.json({ completedSteps: 0, completedStepIds: [] })
    const progress = await TutorialService.getLearningProgress(user.id, tutorial.id)
    return NextResponse.json(progress ?? { completedSteps: 0, completedStepIds: [] })
  }

  const list = await TutorialService.getUserLearningList(user.id)
  return NextResponse.json(list)
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { tutorialSlug, tutorialTitle, stepId, totalSteps } = body

  const tutorial = await TutorialService.getTutorialBySlug(tutorialSlug)
  if (!tutorial) return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 })

  let completedStepIds: string[] = []
  const existing = await TutorialService.getLearningProgress(user.id, tutorial.id)
  if (existing) {
    completedStepIds = (existing as any).completed_step_ids || []
  }

  if (stepId && !completedStepIds.includes(stepId)) {
    completedStepIds.push(stepId)
  }

  const data = await TutorialService.updateLearningProgress(user.id, tutorial.id, completedStepIds, totalSteps)
  return NextResponse.json(data)
}
