// ─── 野造 · Materials Gateway Section ───
// 布局: 6品类卡片网格 · hover 展示材料知识

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Lightbulb } from 'lucide-react'
import { SectionHeader } from '@/components/shared/section-header'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/animated-container'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'
import { cn } from '@/lib/utils'

const categories = [
  { key: 'weaving' as const, tips: ['藤条选3mm最通用', '纸藤适合初学者练习', '浸泡30分钟柔软度最佳'], color: 'from-amber-100 to-orange-100', border: 'border-amber-200' },
  { key: 'leather' as const, tips: ['植鞣皮适合手工制作', '新手从1.5mm厚度开始', '必备工具：菱斩+手缝线'], color: 'from-stone-200 to-amber-100', border: 'border-stone-200' },
  { key: 'woodwork' as const, tips: ['椴木是最易雕刻的入门木料', '樱桃木纹理最美观', '砂纸从粗到细逐级打磨'], color: 'from-amber-100 to-yellow-100', border: 'border-amber-200' },
  { key: 'clay' as const, tips: ['石塑黏土干燥后可打磨雕刻', '软陶需烘烤定型', '树脂黏土适合花卉和食品造型'], color: 'from-rose-100 to-pink-100', border: 'border-rose-200' },
  { key: 'embroidery' as const, tips: ['DMC绣线色牢度最佳', '新手从法式刺绣入门最快', '绣绷保持布料平整'], color: 'from-green-50 to-emerald-100', border: 'border-emerald-200' },
  { key: 'other' as const, tips: ['蜡烛DIY适合零基础', '手工皂需注意安全', '纸艺材料成本最低'], color: 'from-purple-50 to-violet-100', border: 'border-violet-200' },
]

export function MaterialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-clay-50/40">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeUp>
          <SectionHeader
            title="选对材料，成功一半"
            description="每个品类都为你准备了专业选购指南"
            action={
              <Link href="/materials" className="inline-flex items-center gap-1 text-sm font-medium text-clay-600 hover:text-clay-700 transition-colors">
                全部指南 <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </FadeUp>

        <StaggerContainer>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {categories.map((cat) => (
              <StaggerItem key={cat.key}>
                <Link href={`/materials?category=${cat.key}`}>
                  <motion.div
                    className={cn(
                      'group relative rounded-2xl p-4 lg:p-6 h-full',
                      'bg-gradient-to-br bg-white border',
                      cat.color, cat.border,
                      'transition-colors duration-300',
                    )}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  >
                    {/* Icon */}
                    <div className="text-3xl lg:text-4xl mb-3">
                      {CATEGORY_ICONS[cat.key]}
                    </div>

                    {/* Label */}
                    <h3 className="font-serif font-medium text-clay-800 text-sm lg:text-base">
                      {CATEGORY_LABELS[cat.key]}
                    </h3>

                    {/* Hover tips - desktop only */}
                    <div className="hidden lg:block absolute inset-0 rounded-2xl bg-white/95 backdrop-blur p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-clay-600 mb-3">
                        <Lightbulb className="h-4 w-4" />
                        <span className="text-xs font-medium">选购小贴士</span>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-clay-500 flex items-start gap-1.5">
                            <span className="text-clay-300 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-1 mt-3 text-xs font-medium text-clay-600">
                        查看详情 <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Simple arrow on mobile */}
                    <div className="lg:hidden flex items-center gap-1 mt-2 text-xs text-clay-400">
                      选购指南 <ArrowRight className="h-3 w-3" />
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}
