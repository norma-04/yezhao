// ─── 野造 · 教程详情页 ───
import type { Metadata } from 'next'
import * as TutorialService from '@/lib/supabase/services/tutorial.service'
import { notFound } from 'next/navigation'
import { TutorialDetailClient } from './client'
import type { Tutorial, Author } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

const FALLBACK_AUTHOR: Author = { id: '', nickname: '未知作者', avatar_url: null }

export async function generateStaticParams() {
  const { items } = await TutorialService.getTutorials({ limit: 100 })
  return items.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tutorial = await TutorialService.getTutorialBySlug(slug)
  if (!tutorial) return { title: '教程未找到' }

  return {
    title: `${tutorial.title} · 野造教程`,
    description: tutorial.description,
    openGraph: {
      title: tutorial.title,
      description: tutorial.description,
      type: 'article',
    },
  }
}

export default async function TutorialDetailPage({ params }: Props) {
  const { slug } = await params
  const tutorial = await TutorialService.getTutorialBySlug(slug)

  if (!tutorial) notFound()

  const { items: relatedRows } = await TutorialService.getTutorials({ category: tutorial.category, limit: 4 })

  // ── Adapt Supabase types → Tutorial types ──

  // getTutorialBySlug returns author | null; Tutorial expects non-null Author
  const adaptedTutorial: Tutorial = {
    ...tutorial,
    author: tutorial.author ?? FALLBACK_AUTHOR,
  } as unknown as Tutorial

  // getTutorials returns TutorialRow[] (with runtime author from join);
  // Tutorial expects author: Author (non-null), steps, materials, notes
  const adaptedRelated: Tutorial[] = relatedRows
    .filter((r) => r.slug !== slug)
    .slice(0, 3)
    .map((r) => ({
      ...r,
      author: ((r as unknown as Record<string, unknown>).author as Author | null) ?? FALLBACK_AUTHOR,
      steps: [],
      materials: [],
      notes: [],
    })) as unknown as Tutorial[]

  return <TutorialDetailClient tutorial={adaptedTutorial} related={adaptedRelated} />
}
