// ─── 野造 · 系统设置 ───
'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Image, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { SectionHeader } from '@/components/shared/section-header'
import { Skeleton } from '@/components/shared/loading-skeleton'
import type { SystemConfig } from '@/data/admin'

export default function AdminSettings() {
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then(setConfig).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!config) return
    await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) })
  }

  if (loading) return <div className="p-6 lg:p-8 space-y-4"><Skeleton className="h-32 w-full rounded-2xl" /></div>
  if (!config) return null

  return (
    <div className="p-4 lg:p-8 max-w-3xl">
      <SectionHeader title="⚙️ 系统设置" size="sm" />

      <div className="space-y-6">
        {/* Site Config */}
        <section className="rounded-2xl bg-white border border-clay-100 p-6">
          <h3 className="font-serif font-medium text-clay-800 mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-clay-500" />站点配置</h3>
          <div className="space-y-4">
            <div><Label className="text-sm text-clay-600">站点名称</Label><Input value={config.site_name} onChange={(e) => setConfig({ ...config, site_name: e.target.value })} className="mt-1 rounded-xl" /></div>
            <div><Label className="text-sm text-clay-600">站点描述</Label><textarea value={config.site_description} onChange={(e) => setConfig({ ...config, site_description: e.target.value })} className="mt-1 w-full h-24 rounded-xl border border-clay-200 p-3 text-sm resize-none focus:border-clay-400 focus:outline-none" /></div>
          </div>
        </section>

        {/* Registration */}
        <section className="rounded-2xl bg-white border border-clay-100 p-6">
          <h3 className="font-serif font-medium text-clay-800 mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-clay-500" />功能开关</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="text-sm text-clay-700">允许注册</p><p className="text-xs text-clay-400">关闭后新用户无法注册</p></div><Switch checked={config.allow_registration} onCheckedChange={(v) => setConfig({ ...config, allow_registration: v })} /></div>
            <div className="flex items-center justify-between"><div><p className="text-sm text-clay-700">维护模式</p><p className="text-xs text-clay-400">开启后仅管理员可访问</p></div><Switch checked={config.maintenance_mode} onCheckedChange={(v) => setConfig({ ...config, maintenance_mode: v })} /></div>
          </div>
        </section>

        <Button onClick={handleSave} className="rounded-full"><Save className="h-4 w-4 mr-1.5" />保存配置</Button>
      </div>
    </div>
  )
}
