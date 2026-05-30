// ─── 野造 · Root Layout ───
import type { Metadata, Viewport } from 'next'
import { Noto_Serif_SC, Noto_Sans_SC, Geist_Mono } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from './providers'
import { AnalyticsScripts } from '@/components/shared/analytics-scripts'
import { OrganizationSchema, WebSiteSchema } from '@/lib/seo/schema'
import { SITE_CONFIG } from '@/lib/constants'
import './globals.css'

const notoSerif = Noto_Serif_SC({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
})

const notoSans = Noto_Sans_SC({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: '#FEF8F2',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: '野造 · 指尖造物，心生温暖',
    template: '%s | 野造',
  },
  description:
    '野造是一个专注于手作DIY学习、材料指导与作品分享的专业化平台。从编织到木工，从皮具到刺绣，让每一双热爱生活的手，都能创造独一无二的温暖。',
  keywords: ['手作', 'DIY', '编织', '皮具', '木工', '黏土', '刺绣', '手工教程', '材料选购', '手工社区'],
  authors: [{ name: '野造', url: SITE_CONFIG.url }],
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '野造',
    url: SITE_CONFIG.url,
    title: '野造 · 指尖造物，心生温暖',
    description: '手作DIY学习交流平台 — 从零基础到精通，从选材料到晒作品',
    images: [
      {
        url: `${SITE_CONFIG.url}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: '野造 · 手作DIY学习平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '野造 · 指尖造物，心生温暖',
    description: '手作DIY学习交流平台',
    images: [`${SITE_CONFIG.url}/images/og-default.jpg`],
  },
  verification: {
    // Google Search Console verification — set via env
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSerif.variable} ${notoSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-cream font-sans text-clay-800 antialiased">
        {/* SEO Structured Data */}
        <OrganizationSchema />
        <WebSiteSchema />

        <TooltipProvider>
          <Providers>{children}</Providers>
        </TooltipProvider>

        {/* Analytics (production only) */}
        <AnalyticsScripts />
      </body>
    </html>
  )
}
