// ─── 野造 · Robots.txt ───
import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/me/',
          '/search?',
          '/_next/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/api/', '/admin/', '/auth/', '/me/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  }
}
