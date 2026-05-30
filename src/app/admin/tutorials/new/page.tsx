// ─── 野造 · 新建教程 ───
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Globe, Video, Image } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const CATEGORIES = [
  { value: 'weaving', label: '🧶 编织' },
  { value: 'leather', label: '👜 皮具' },
  { value: 'woodwork', label: '🪵 木工' },
  { value: 'clay', label: '🏺 黏土' },
  { value: 'embroidery', label: '🪡 刺绣' },
  { value: 'other', label: '📦 其他' },
]

const DIFFICULTIES = [
  { value: 'beginner', label: '🌱 入门' },
  { value: 'intermediate', label: '🌿 进阶' },
  { value: 'advanced', label: '🌳 挑战' },
]

export default function NewTutorialPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'weaving',
    difficulty: 'beginner',
    duration_minutes: 60,
    description: '',
    cover_url: '',
    video_url: '',
  })

  const handleChange = (field: string, value: string | number | null) => {
    if (value !== null) setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Auto-generate slug from title (pinyin-like, simple slugification)
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: title
        .replace(/[^\w一-鿿\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .slice(0, 80),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.slug) {
      setError('请至少填写标题')
      return
    }
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'draft' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '创建失败')
      router.push('/admin/tutorials')
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/tutorials">
          <Button variant="ghost" size="sm" className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-1" />返回
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-clay-800">📖 新建教程</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">教程标题 *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="例如：Macrame 编织挂毯入门"
            className="rounded-xl"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">URL 标识（自动生成，可手动改）</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="macrame-wall-hanging"
            className="rounded-xl font-mono text-sm"
          />
        </div>

        {/* Category + Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>分类</Label>
            <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>难度</Label>
            <Select value={form.difficulty} onValueChange={(v) => handleChange('difficulty', v)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">预计时长（分钟）</Label>
          <Input
            id="duration"
            type="number"
            value={form.duration_minutes}
            onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value) || 0)}
            className="rounded-xl w-40"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">简介</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="简单介绍这个教程的内容和适合人群..."
            className="rounded-xl min-h-[100px]"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-clay-100 pt-6">
          <p className="text-sm font-medium text-clay-500 mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4" />外部链接（使用 B站 / YouTube 等平台）
          </p>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="video_url" className="flex items-center gap-1">
              <Video className="h-3.5 w-3.5" />视频链接
            </Label>
            <Input
              id="video_url"
              value={form.video_url}
              onChange={(e) => handleChange('video_url', e.target.value)}
              placeholder="https://www.bilibili.com/video/BVxxxxxx 或 YouTube 链接"
              className="rounded-xl font-mono text-sm"
            />
            <p className="text-xs text-clay-400">
              把视频上传到 B站 / YouTube 后，把链接粘贴到这里即可
            </p>
          </div>

          {/* Cover URL */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="cover_url" className="flex items-center gap-1">
              <Image className="h-3.5 w-3.5" />封面图链接
            </Label>
            <Input
              id="cover_url"
              value={form.cover_url}
              onChange={(e) => handleChange('cover_url', e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="rounded-xl font-mono text-sm"
            />
            <p className="text-xs text-clay-400">
              视频封面图直链，可在 Supabase Storage 上传图片后获取链接
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving} className="rounded-full">
            <Save className="h-4 w-4 mr-1" />
            {saving ? '保存中...' : '保存为草稿'}
          </Button>
          <Link href="/admin/tutorials">
            <Button type="button" variant="outline" className="rounded-full">取消</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
