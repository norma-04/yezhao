// ─── 野造 · 发布作品页 ───
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X, Plus, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SectionHeader } from '@/components/shared/section-header'
import { FadeUp } from '@/components/shared/animated-container'
import { getSupabaseClient } from '@/lib/supabase/client'
import { generateFilePath, compressImage } from '@/lib/supabase/storage'
import { cn } from '@/lib/utils'

const topics = [
  { slug: 'showcase', name: '成品展示', icon: '🎨', description: '展示你的手作作品，让更多人看到' },
  { slug: 'newbie', name: '新手避坑', icon: '🔰', description: '新手经验分享，一起成长' },
  { slug: 'review', name: '材料测评', icon: '📊', description: '工具和材料的真实使用体验' },
  { slug: 'activity', name: '活动专区', icon: '🎪', description: '线上活动和挑战赛事' },
]

const MAX_IMAGES = 20

export default function CreatePostPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('showcase')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [processSteps, setProcessSteps] = useState<{ title: string; description: string }[]>([])
  const [materials, setMaterials] = useState<{ name: string; slug: string | null }[]>([])
  const [materialInput, setMaterialInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ─── Real image upload to Supabase Storage ───
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadError('')
    setUploading(true)

    const supabase = getSupabaseClient()

    // Get current user for file path
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setUploadError('请先登录后再上传图片')
      setUploading(false)
      return
    }

    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      // Validate
      if (!file.type.startsWith('image/')) {
        setUploadError(`"${file.name}" 不是图片文件`)
        continue
      }
      if (file.size > 50 * 1024 * 1024) {
        setUploadError(`"${file.name}" 超过 50MB 限制`)
        continue
      }

      try {
        // Compress to WebP
        const compressed = await compressImage(file, 1920, 1920, 0.85)
        const compressedFile = new File([compressed], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })

        // Generate path and upload
        const path = generateFilePath(user.id, 'community', file.name)
        const { error } = await supabase.storage
          .from('community')
          .upload(path, compressedFile, { upsert: false, contentType: 'image/webp' })

        if (error) {
          setUploadError(`上传失败: ${error.message}`)
          continue
        }

        const { data: urlData } = supabase.storage.from('community').getPublicUrl(path)
        newUrls.push(urlData.publicUrl)
      } catch (err) {
        setUploadError(`上传 "${file.name}" 时出错`)
        console.error('Upload error:', err)
      }
    }

    if (newUrls.length > 0) {
      setImages((prev) => [...prev, ...newUrls].slice(0, MAX_IMAGES))
    }
    setUploading(false)

    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
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
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            {uploadError && (
              <p className="text-red-500 text-sm mb-3">{uploadError}</p>
            )}
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
              {images.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl relative overflow-hidden bg-clay-100 group">
                  <Image src={url} alt={`作品图片 ${i + 1}`} fill className="object-cover" sizes="150px" />
                  <button onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3 text-clay-500" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-xl border-2 border-dashed border-clay-300 flex flex-col items-center justify-center text-clay-400 hover:border-clay-400 hover:text-clay-500 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-xs mt-1">上传中...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6" />
                      <span className="text-xs mt-1">添加图片</span>
                    </>
                  )}
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
            <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim() || submitting || uploading} className="rounded-full px-8" size="lg">
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
