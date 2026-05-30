// ─── 野造 · SEO Metadata 工具 ───
import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

type OGImageSize = { width: number; height: number }

interface BuildMetadataParams {
  title: string
  description: string
  path?: string
  ogImage?: string
  ogImageSize?: OGImageSize
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  type?: 'website' | 'article' | 'profile'
}

/**
 * Build consistent metadata for any page with OG + Twitter Cards
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  ogImage,
  ogImageSize = { width: 1200, height: 630 },
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  type = 'website',
}: BuildMetadataParams): Metadata {
  const url = `${SITE_CONFIG.url}${path}`
  const imageUrl = ogImage || `${SITE_CONFIG.url}/images/og-default.jpg`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' as const, 'max-video-preview': -1 },
    openGraph: {
      type,
      locale: 'zh_CN',
      url,
      siteName: SITE_CONFIG.name,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: ogImageSize.width,
          height: ogImageSize.height,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      // iOS Smart App Banner
      // 'apple-itunes-app': 'app-id=XXXXXXXXXX',
    },
  }
}

/**
 * Build tutorial page metadata
 */
export function buildTutorialMetadata(tutorial: {
  title: string
  description: string
  slug: string
  cover_url?: string | null
  category?: string
  difficulty?: string
  author?: string
  publishedTime?: string
}): Metadata {
  const keywords = [
    '手作教程',
    'DIY教程',
    tutorial.category && `${tutorial.category}手工`,
    tutorial.difficulty && `${tutorial.difficulty}难度`,
    tutorial.title,
  ].filter(Boolean) as string[]

  return buildMetadata({
    title: `${tutorial.title} | 野造教程`,
    description: tutorial.description.slice(0, 160),
    path: `/tutorials/${tutorial.slug}`,
    ogImage: tutorial.cover_url || undefined,
    type: 'article',
    publishedTime: tutorial.publishedTime,
    authors: tutorial.author ? [tutorial.author] : undefined,
    tags: keywords,
  })
}

/**
 * Build material page metadata
 */
export function buildMaterialMetadata(material: {
  name: string
  description: string
  slug: string
  image_url?: string | null
  category?: string
}): Metadata {
  const keywords = [
    '手作材料',
    'DIY材料',
    '材料选购',
    material.name,
    material.category && `${material.category}材料`,
    `${material.name}怎么选`,
    `${material.name}推荐`,
  ].filter(Boolean) as string[]

  return buildMetadata({
    title: `${material.name}选购指南 | 野造材料库`,
    description: material.description.slice(0, 160),
    path: `/materials/${material.slug}`,
    ogImage: material.image_url || undefined,
    type: 'article',
    tags: keywords,
  })
}

/**
 * Build community post metadata
 */
export function buildPostMetadata(post: {
  title: string
  content: string
  slug: string
  images?: string[]
  author?: string
  publishedTime?: string
  tags?: string[]
}): Metadata {
  return buildMetadata({
    title: `${post.title} | 野造社区`,
    description: post.content.replace(/<[^>]*>/g, '').slice(0, 160),
    path: `/community/post/${post.slug}`,
    ogImage: post.images?.[0],
    type: 'article',
    publishedTime: post.publishedTime,
    authors: post.author ? [post.author] : undefined,
    tags: post.tags,
  })
}

/**
 * Build user profile metadata
 */
export function buildProfileMetadata(profile: {
  nickname: string
  bio?: string
  avatar_url?: string | null
  username?: string
}): Metadata {
  return buildMetadata({
    title: `${profile.nickname}的主页 | 野造`,
    description: profile.bio?.slice(0, 160) || `${profile.nickname}的野造个人主页`,
    path: profile.username ? `/user/${profile.username}` : '/me',
    ogImage: profile.avatar_url || undefined,
    type: 'profile',
  })
}
