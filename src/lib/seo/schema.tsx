// ─── 野造 · Schema.org JSON-LD 组件 ───
// Structured data for rich search results

import { SITE_CONFIG } from '@/lib/constants'

// ─── Types ───

interface ArticleSchema {
  title: string
  description: string
  image: string
  url: string
  datePublished: string
  dateModified?: string
  authorName: string
  authorUrl?: string
}

interface FAQSchema {
  questions: { question: string; answer: string }[]
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface PersonSchema {
  name: string
  image?: string
  url?: string
  sameAs?: string[]
  jobTitle?: string
}

// ─── Schema Builders ───

/**
 * Organization Schema — includes on every page
 */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    sameAs: [
      'https://weibo.com/u/yezao_official',
      // Add more social profiles
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.links.email,
      contactType: 'customer service',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * WebSite Schema — search action for sitelinks searchbox
 */
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Article Schema — for tutorials and material guides
 */
export function ArticleSchema({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
}: ArticleSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url,
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * FAQ Schema — for material FAQ sections
 */
export function FAQSchema({ questions }: FAQSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * BreadcrumbList Schema
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Person Schema — for user profiles
 */
export function PersonSchema({ name, image, url, sameAs, jobTitle }: PersonSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(image && { image }),
    ...(url && { url }),
    ...(sameAs && { sameAs }),
    ...(jobTitle && { jobTitle }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
