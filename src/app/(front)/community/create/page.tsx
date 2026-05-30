// ─── 野造 · 发布作品页 ───
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X, Plus, Image as ImageIcon, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SectionHeader } from '@/components/shared/section-header'
import { FadeUp } from '@/components/shared/animated-container'
import { topics } from '@/data/community'
import { cn } from '@/lib/utils'

const MAX_IMAGES = 20

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('showcase')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [processSteps, setProcessSteps] = useState<{ title: string; description: string }[]>([])
  const [materials, setMaterials] = useState<{ name: string; slug: string | null }[]>([])
  const [materialInput, setMaterialInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Simulate image "upload" - just add colored placeholders
  const addImage = () => {
    if (images.length >= MAX_IMAGES) return
    const colors = ['from-amber-100 to-orange-100', 'from-stone-200 to-amber-100', 'from-green-50 to-emerald-100', 'from-rose-100 to-pink-100', 'from-blue-50 to-sky-100', 'from-purple-50 to-violet-100']
    setImages([...images, colors[images.length % colors.length]])
  }

  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i))

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags([...tags, t])
      setTagInput('')
    }
  }

  const addMaterial = () => {
    const m = materialInput.trim()
    if (m) {
      setMaterials([...materials, { name: m, slug: null }])
      setMaterialInput('')
    }
  }

  const addProcessStep = () => {
    setProcessSteps([...processSteps, { title: '', description: '' }])
  }

  const updateProcessStep = (i: number, field: 'title' | 'description', value: string) => {
    const updated = [...processSteps]
    updated[i] = { ...updated[i], [field]: value }
    setProcessSteps(updated)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)
    const slug = title.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 50) + '-' + Date.now()
    await fetch('/api/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), content: content.trim(), topic: selectedTopic, tags, images, process_steps: processSteps, materials_used: materials, slug }),
    })
    setSubmitting(false)
    router.push(`/community/post/${slug}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-3xl px-4 lg:px-8 py-4">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-clay-500 hover:text-clay-700">
          <ArrowLeft className="h-4 w-4" /> 取消
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 lg:px-8 pb-20">
        <FadeUp>
          <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-clay-800">发布你的作品</h1>
          <p className="mt-2 text-clay-500">分享创作过程，记录你的手作时光</p>
        </FadeUp>

        <div className="mt-8 space-y-8">
          {/* Image Upload */}
          <section>
            <h3 className="font-serif font-medium text-clay-700 mb-3">📸 作品图片 <span className="text-clay-400 text-sm font-normal">({images.length}/{MAX_IMAGES})</span></h3>
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
              {images.map((color, i) => (
                <div key={i} className={cn('aspect-square rounded-xl bg-gradient-to-br relative group', color)}>
                  <button onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3 text-clay-500" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button onClick={addImage} className="aspect-square rounded-xl border-2 border-dashed border-clay-300 flex flex-col items-center justify-center text-clay-400 hover:border-clay-400 hover:text-clay-500 transition-colors">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs mt-1">添加图片</span>
                </button>
              )}
            </div>
          </section>

          {/* Title */}
          <section>
            <h3 className="font-serif font-medium text-clay-700 mb-3">✏️ 作品标题</h3>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的作品起个名字..."
              className="h-12 rounded-xl text-base"
              maxLength={50}
            />
          </section>

          {/* Content */}
          <section>
            <h3 className="font-serif font-medium text-clay-700 mb-3">📝 作品内容</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的创作心得、制作技巧、踩坑经验..."
              className="w-full h-40 rounded-xl border border-clay-200 p-4 text-sm text-clay-700 placeholder:text-clay-400 focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/20 resize-none"
              minLength={10}
            />
          </section>

          {/* Topic Select */}
          <section>
            <h3 className="font-serif font-medium text-clay-700 mb-3">🏷️ 选择话题</h3>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => setSelectedTopic(t.slug)}
                  className={cn('px-4 py-2 rounded-full text-sm transition-all', selectedTopic === t.slug ? 'bg-clay-600 text-white' : 'bg-white border border-clay-200 text-clay-600 hover:bg-clay-50')}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </section>

          {/* Tags */}
          <section>
            <h3 className="font-serif font-medium text-clay-700 mb-3">🔖 标签</h3>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((t) => (
                <Badge key={t} className="px-3 py-1 gap-1 cursor-pointer" onClick={() => setTags(tags.filter((x) => x !== t))}>
                  {t} <X className="h-3 w-3" />
                </Badge>
              ))}
              <div className="flex items-center gap-1">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="添加标签..."
                  className="h-8 w-24 rounded-full border border-clay-200 px-3 text-xs focus:outline-none"
                />
                <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0" onClick={addTag}><Plus className="h-3 w-3" /></Button>
              </div>
            </div>
          </section>

          {/* Materials Used */}
          <section>
            <h3 className="font-serif font-medium text-clay-700 mb-3">🧵 使用材料</h3>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {materials.map((m) => (
                <Badge key={m.name} variant="secondary" className="px-3 py-1 gap-1 cursor-pointer" onClick={() => setMaterials(materials.filter((x) => x.name !== m.name))}>
                  {m.name} <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input value={materialInput} onChange={(e) => setMaterialInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMaterial() } }} placeholder="添加材料名称..." className="h-9 rounded-full border border-clay-200 px-4 text-sm focus:outline-none flex-1" />
              <Button size="sm" variant="outline" className="rounded-full" onClick={addMaterial}>添加</Button>
            </div>
          </section>

          {/* Process Steps */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-medium text-clay-700">📋 制作过程 <span className="text-clay-400 text-sm font-normal">(可选)</span></h3>
              <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={addProcessStep}><Plus className="h-3 w-3 mr-1" /> 添加步骤</Button>
            </div>
            <div className="space-y-3">
              {processSteps.map((step, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white border border-clay-100">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-clay-100 text-clay-500 text-xs shrink-0 mt-1">{i + 1}</span>
                  <div className="flex-1 space-y-2">
                    <input value={step.title} onChange={(e) => updateProcessStep(i, 'title', e.target.value)} placeholder="步骤名称" className="w-full text-sm font-medium border-none p-0 focus:outline-none" />
                    <textarea value={step.description} onChange={(e) => updateProcessStep(i, 'description', e.target.value)} placeholder="步骤描述..." className="w-full text-xs text-clay-500 border-none p-0 focus:outline-none resize-none" rows={2} />
                  </div>
                  <button onClick={() => setProcessSteps(processSteps.filter((_, idx) => idx !== i))} className="shrink-0 text-clay-300 hover:text-red-400"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim() || submitting} className="rounded-full px-8" size="lg">
              {submitting ? '发布中...' : '发布作品'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" className="rounded-full" onClick={() => router.push('/community')}>取消</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
