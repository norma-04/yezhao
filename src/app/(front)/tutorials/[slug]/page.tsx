// ─── 野造 · 教程详情页 ───
import type { Metadata } from 'next'
import { getTutorialBySlug, getRelatedTutorials, allTutorials } from '@/data/tutorials'
import { notFound } from 'next/navigation'
import { TutorialDetailClient } from './client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allTutorials.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tutorial = getTutorialBySlug(slug)
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
  const tutorial = getTutorialBySlug(slug)

  if (!tutorial) notFound()

  const related = getRelatedTutorials(tutorial, 4)

  return <TutorialDetailClient tutorial={tutorial} related={related} />
}
