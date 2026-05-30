// ─── 野造 · Material Service ───
import { getSupabaseClient } from '../client'
import type {
  MaterialRow, MaterialInsert, MaterialUpdate,
  MaterialComparisonRow, MaterialAlternativeRow,
  MaterialPurchaseLinkRow, MaterialBuyingTipRow, MaterialFaqRow,
} from '../database.types'

// ─── Materials ───

export async function getMaterials(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  const supabase = getSupabaseClient()
  const page = params?.page || 1
  const limit = params?.limit || 12
  const offset = (page - 1) * limit

  let query = supabase.from('materials').select('*', { count: 'exact' })
  if (params?.category && params.category !== 'all') query = query.eq('category', params.category)
  if (params?.search) query = query.ilike('name', `%${params.search}%`)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)
  return { items: (data || []) as MaterialRow[], total: count || 0 }
}

export async function getMaterialBySlug(slug: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  const material = data as MaterialRow

  const [comparisonsRes, alternativesRes, linksRes, tipsRes, faqsRes] = await Promise.all([
    supabase.from('material_comparisons').select('*').eq('material_id', material.id),
    supabase.from('material_alternatives').select('*').eq('material_id', material.id),
    supabase.from('material_purchase_links').select('*').eq('material_id', material.id),
    supabase.from('material_buying_tips').select('*').eq('material_id', material.id),
    supabase.from('material_faqs').select('*').eq('material_id', material.id),
  ])

  return {
    ...material,
    comparisons: (comparisonsRes.data || []) as MaterialComparisonRow[],
    alternatives: (alternativesRes.data || []) as MaterialAlternativeRow[],
    purchase_links: (linksRes.data || []) as MaterialPurchaseLinkRow[],
    buying_tips: ((tipsRes.data || []) as MaterialBuyingTipRow[]).map((t) => t.tip),
    faqs: (faqsRes.data || []) as MaterialFaqRow[],
  }
}

export async function getMaterialCategories() {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('materials').select('category')
  if (!data) return []
  const categories = [...new Set((data as { category: string }[]).map((d) => d.category))]
  return categories
}

// ─── Admin ───

export async function listAllMaterials(params?: { search?: string; category?: string; page?: number; limit?: number }) {
  const supabase = getSupabaseClient()
  const page = params?.page || 1
  const limit = params?.limit || 20
  const offset = (page - 1) * limit

  let query = supabase.from('materials').select('*', { count: 'exact' })
  if (params?.search) query = query.ilike('name', `%${params.search}%`)
  if (params?.category && params.category !== 'all') query = query.eq('category', params.category)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)
  return { items: (data || []) as MaterialRow[], total: count || 0 }
}

export async function createMaterial(input: MaterialInsert): Promise<MaterialRow> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('materials').insert(input as never).select('*').single()
  if (error) throw new Error(error.message)
  return data as MaterialRow
}

export async function updateMaterial(id: string, input: MaterialUpdate): Promise<MaterialRow> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('materials').update(input as never).eq('id' as never, id).select('*').single()
  if (error) throw new Error(error.message)
  return data as MaterialRow
}

export async function deleteMaterial(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('materials').delete().eq('id' as never, id)
  if (error) throw new Error(error.message)
}
