// ─── 野造 · 首页 ───
import type { Metadata } from 'next'
import {
  HeroSection,
  FeaturedTutorialsSection,
  MaterialsSection,
  CommunitySection,
  LearningPathSection,
  FeaturesSection,
  CTASection,
} from '@/components/home'

export const metadata: Metadata = {
  title: '野造 · 指尖造物，心生温暖',
  description: '野造是一个专注于手作DIY学习、材料指导与作品分享的专业化平台。从编织到木工，从皮具到刺绣，让每一双热爱生活的手都能创造独一无二的温暖。',
  keywords: ['手作', 'DIY', '编织', '皮具', '木工', '黏土', '刺绣', '手工教程', '材料选购', '手作社区'],
  openGraph: {
    title: '野造 · 指尖造物，心生温暖',
    description: '从零开始学手作，找到适合你的材料，记录属于你的作品。加入12,000+创作者的温暖社区。',
    type: 'website',
    locale: 'zh_CN',
    siteName: '野造',
  },
  twitter: {
    card: 'summary_large_image',
    title: '野造 · 指尖造物，心生温暖',
    description: '从零开始学手作，找到适合你的材料，记录属于你的作品。',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedTutorialsSection />
      <MaterialsSection />
      <CommunitySection />
      <LearningPathSection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
