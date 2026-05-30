// ─── 野造 · Tutorial Service ───
import { getSupabaseClient } from '../client'
import type {
  TutorialRow, TutorialInsert, TutorialUpdate,
  TutorialStepRow, TutorialMaterialRow, TutorialNoteRow,
} from '../database.types'

// ─── Tutorials ───

export async function getTutorials(params?: {
  category?: string; difficulty?: string; sort?: string; search?: string; page?: number; limit?: number
}) {
  const supabase = getSupabaseClient()
  const page = params?.page || 1
  const limit = params?.limit || 12
  const offset = (page - 1) * limit

  let query = supabase
    .from('tutorials')
    .select('*, author:profiles!tutorials_author_id_fkey(id, nickname, avatar_url)', { count: 'exact' })
    .eq('status', 'published')

  if (params?.category && params.category !== 'all') query = query.eq('category', params.category)
  if (params?.difficulty && params.difficulty !== 'all') query = query.eq('difficulty', params.difficulty)
  if (params?.search) query = query.ilike('title', `%${params.search}%`)

  switch (params?.sort) {
    case 'popular': query = query.order('learners_count', { ascending: false }) as never; break
    case 'favorites': query = query.order('favorites_count', { ascending: false }) as never; break
    default: query = query.order('created_at', { ascending: false }) as never
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)
  return { items: (data || []) as TutorialRow[], total: count || 0 }
}

export async function getTutorialBySlug(slug: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('tutorials')
    .select('*, author:profiles!tutorials_author_id_fkey(id, nickname, avatar_url)')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  const tutorial = data as TutorialRow & { author: { id: string; nickname: string; avatar_url: string | null } | null }

  const [stepsRes, materialsRes, notesRes] = await Promise.all([
    supabase.from('tutorial_steps').select('*').eq('tutorial_id', tutorial.id).order('order'),
    supabase.from('tutorial_materials').select('*').eq('tutorial_id', tutorial.id),
    supabase.from('tutorial_notes').select('*').eq('tutorial_id', tutorial.id),
  ])

  return {
    ...tutorial,
    steps: (stepsRes.data || []) as TutorialStepRow[],
    materials: (materialsRes.data || []) as TutorialMaterialRow[],
    notes: ((notesRes.data || []) as TutorialNoteRow[]).map((n) => n.content),
  }
}

export async function getFeaturedTutorials(limit = 6) {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from('tutorials')
    .select('*, author:profiles!tutorials_author_id_fkey(id, nickname, avatar_url)')
    .eq('status', 'published')
    .order('learners_count', { ascending: false })
    .limit(limit)
  return (data || []) as TutorialRow[]
}

// ─── Learning Progress ───

export async function getLearningProgress(userId: string, tutorialId: string) {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId).eq('tutorial_id', tutorialId)
    .single()
  return data
}

export async function updateLearningProgress(userId: string, tutorialId: string, completedStepIds: string[], totalSteps: number) {
  const supabase = getSupabaseClient()
  const progressPercent = totalSteps > 0 ? Math.round((completedStepIds.length / totalSteps) * 100) : 0
  const { data, error } = await supabase
    .from('learning_progress')
    .upsert({
      user_id: userId,
      tutorial_id: tutorialId,
      completed_step_ids: completedStepIds,
      progress_percent: progressPercent,
      last_learned_at: new Date().toISOString(),
    } as never, { onConflict: 'user_id,tutorial_id' })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getUserLearningList(userId: string) {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from('learning_progress')
    .select('*, tutorial:tutorials!learning_progress_tutorial_id_fkey(*)')
    .eq('user_id', userId)
    .order('last_learned_at', { ascending: false })
  return (data || []) as never[]
}

// ─── Admin ───

export async function listAllTutorials(params?: { search?: string; category?: string; status?: string; page?: number; limit?: number }) {
  const supabase = getSupabaseClient()
  const page = params?.page || 1
  const limit = params?.limit || 20
  const offset = (page - 1) * limit

  let query = supabase.from('tutorials').select('*', { count: 'exact' })
  if (params?.search) query = query.ilike('title', `%${params.search}%`)
  if (params?.category && params.category !== 'all') query = query.eq('category', params.category)
  if (params?.status && params.status !== 'all') query = query.eq('status', params.status)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)
  return { items: (data || []) as TutorialRow[], total: count || 0 }
}

export async function createTutorial(input: TutorialInsert): Promise<TutorialRow> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('tutorials').insert(input as never).select('*').single()
  if (error) throw new Error(error.message)
  return data as TutorialRow
}

export async function updateTutorial(id: string, input: TutorialUpdate): Promise<TutorialRow> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('tutorials').update(input as never).eq('id' as never, id).select('*').single()
  if (error) throw new Error(error.message)
  return data as TutorialRow
}

export async function deleteTutorial(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('tutorials').delete().eq('id' as never, id)
  if (error) throw new Error(error.message)
}
