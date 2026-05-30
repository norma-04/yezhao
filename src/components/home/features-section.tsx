// ─── 野造 · Features Section ───
// 布局: 4个 Feature Card · 平台优势展示

'use client'

import { BookOpen, Lightbulb, Users, TrendingUp } from 'lucide-react'
import { SectionHeader } from '@/components/shared/section-header'
import { FeatureCard } from '@/components/shared/feature-card'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'

const features = [
  {
    icon: BookOpen,
    title: '教程拆解细致',
    description: '每一步都有详细文字说明和图片，就像老师在身边手把手教你。从材料准备到成品完成，不会遗漏任何一个细节。',
    color: 'clay' as const,
  },
  {
    icon: Lightbulb,
    title: '材料指导专业',
    description: '每种材料都有全面的选购指南。从入门级到专业级，价格对比、优劣分析、替代方案一目了然，让你少走弯路。',
    color: 'warm' as const,
  },
  {
    icon: Users,
    title: '社区氛围友好',
    description: '温暖治愈的创作社区。分享你的作品、交流心得、互帮互助。这里有和你一样热爱手作的伙伴。',
    color: 'sage' as const,
  },
  {
    icon: TrendingUp,
    title: '持续成长体系',
    description: '从零基础到创作者，有清晰的成长路径。每日打卡、勋章激励、排行榜挑战，让坚持变得有趣。',
    color: 'clay' as const,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeUp>
          <SectionHeader
            title="为什么选择野造"
            description="不只是教程平台，更是你的手作成长伙伴"
            align="center"
            size="lg"
          />
        </FadeUp>

        <StaggerContainer>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <FeatureCard
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  colorScheme={f.color}
                  size="md"
                />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}
