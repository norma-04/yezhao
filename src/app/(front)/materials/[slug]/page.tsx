// ─── 野造 · 材料详情页 (SSG) ───
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Tutorial } from '@/lib/types'
import type { MaterialData } from '@/data/materials'
import * as MaterialService from '@/lib/supabase/services/material.service'
import { getTutorialBySlug } from '@/data/tutorials'
import { MaterialDetailClient } from './client'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const { items: materials } = await MaterialService.getMaterials({ limit: 1000 })
  return materials.map((m) => ({ slug: m.slug }))
}

function adaptMaterial(raw: Awaited<ReturnType<typeof MaterialService.getMaterialBySlug>> & {}): MaterialData {
  const ALTERNATIVE_TYPES = ['budget', 'beginner', 'premium', 'eco'] as const

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    category: raw.category,
    image_url: raw.image_url,
    rating: 4.0,
    price_level: '¥¥' as MaterialData['price_level'],
    difficulty_level: 'beginner' as MaterialData['difficulty_level'],
    summary: raw.description?.slice(0, 200) ?? '',
    description: raw.description ?? '',
    characteristics: [
      { label: '质感', value: raw.texture ?? '' },
      { label: '规格', value: raw.size_info ?? '' },
      { label: '适用场景', value: (raw.scenarios ?? []).join('、') },
    ].filter((c) => c.value),
    pros: raw.comparisons?.[0]?.pros ?? [],
    cons: raw.comparisons?.[0]?.cons ?? [],
    buying_guide: (raw.buying_tips ?? []).map((tip) => ({
      title: tip.slice(0, 20),
      content: tip,
    })),
    pitfalls: [],
    alternatives: (raw.alternatives ?? []).map((alt, i) => ({
      type: ALTERNATIVE_TYPES[i % 4],
      name: alt.name,
      description: alt.description ?? '',
      price: '',
      pros: [] as string[],
      cons: [] as string[],
    })),
    faqs: (raw.faqs ?? []).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    related_tutorial_slugs: [],
    specs: [
      raw.texture && `质感: ${raw.texture}`,
      raw.size_info && `规格: ${raw.size_info}`,
      ...(raw.scenarios ?? []).map((s) => `适用: ${s}`),
    ].filter(Boolean) as string[],
    created_at: raw.created_at ?? '',
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const m = await MaterialService.getMaterialBySlug(slug)
  if (!m) return { title: '材料未找到' }
  const description = m.description?.slice(0, 200) ?? ''
  return {
    title: `${m.name} · 野造材料指南`,
    description,
    openGraph: { title: m.name, description, type: 'article' },
  }
}

export default async function MaterialDetailPage({ params }: Props) {
  const { slug } = await params
  const raw = await MaterialService.getMaterialBySlug(slug)
  if (!raw) notFound()

  const material = adaptMaterial(raw)

  const relatedTutorials = material.related_tutorial_slugs
    .map((s) => getTutorialBySlug(s))
    .filter((t): t is Tutorial => t !== undefined)

  return <MaterialDetailClient material={material} relatedTutorials={relatedTutorials} />
}
