// ─── 野造 · 材料详情页 (SSG) ───
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Tutorial } from '@/lib/types'
import { getMaterialBySlug, allMaterials } from '@/data/materials'
import { getTutorialBySlug } from '@/data/tutorials'
import { MaterialDetailClient } from './client'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return allMaterials.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const m = getMaterialBySlug(slug)
  if (!m) return { title: '材料未找到' }
  return {
    title: `${m.name} · 野造材料指南`,
    description: m.summary,
    openGraph: { title: m.name, description: m.summary, type: 'article' },
  }
}

export default async function MaterialDetailPage({ params }: Props) {
  const { slug } = await params
  const material = getMaterialBySlug(slug)
  if (!material) notFound()

  const relatedTutorials = material.related_tutorial_slugs
    .map((s) => getTutorialBySlug(s))
    .filter((t): t is Tutorial => t !== undefined)

  return <MaterialDetailClient material={material} relatedTutorials={relatedTutorials} />
}
