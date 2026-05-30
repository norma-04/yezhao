// ─── 野造 · Sitemap ───
// Auto-generated sitemap for all public content types
import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

// Static route definitions
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: SITE_CONFIG.url,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${SITE_CONFIG.url}/tutorials`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${SITE_CONFIG.url}/materials`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${SITE_CONFIG.url}/community`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  },
  {
    url: `${SITE_CONFIG.url}/search`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // In production, fetch real slugs from Supabase
  // const supabase = await createServerClientWithCookies()
  // const { data: tutorials } = await supabase.from('tutorials').select('slug,updated_at').eq('status', 'published')

  const tutorialSlugs = [
    'beginner-weaving-basket',
    'handmade-leather-wallet',
    'wooden-spoon-carving',
    'clay-jewelry-tray',
    'french-embroidery-brooch',
  ]

  const materialSlugs = [
    'natural-rattan',
    'cotton-rope-macrame',
    'italian-vegetable-leather',
    'basswood-block',
    'embroidery-thread',
  ]

  const tutorialRoutes: MetadataRoute.Sitemap = tutorialSlugs.map((slug) => ({
    url: `${SITE_CONFIG.url}/tutorials/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const materialRoutes: MetadataRoute.Sitemap = materialSlugs.map((slug) => ({
    url: `${SITE_CONFIG.url}/materials/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...STATIC_ROUTES, ...tutorialRoutes, ...materialRoutes]
}
