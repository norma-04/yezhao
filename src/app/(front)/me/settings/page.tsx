// ─── 野造 · 账号设置 ───
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Eye, LogOut, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { SectionHeader } from '@/components/shared/section-header'
import { FadeUp } from '@/components/shared/animated-container'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function SettingsPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('手工小白')
  const [bio, setBio] = useState('入坑手作三个月，热爱藤编和黏土。')
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState({ tutorial: true, community: true, activity: false, system: true })

  const handleSaveProfile = async () => {
    setSaving(true)
    await fetch('/api/me/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname, bio }) })
    setTimeout(() => setSaving(false), 500)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-2xl px-4 lg:px-8 py-6">
        <FadeUp><SectionHeader title="⚙️ 账号设置" size="sm" /></FadeUp>

        <div className="space-y-6">
          {/* Avatar */}
          <section className="rounded-2xl bg-white border border-clay-100 p-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="h-16 w-16"><AvatarFallback className="bg-clay-200 text-clay-600 text-xl">{nickname[0]}</AvatarFallback></Avatar>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-clay-600 text-white flex items-center justify-center shadow hover:bg-clay-700 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-clay-800">{nickname}</h3>
                <p className="text-sm text-clay-400">点击修改头像</p>
              </div>
            </div>
          </section>

          {/* Profile */}
          <section className="rounded-2xl bg-white border border-clay-100 p-6">
            <h3 className="font-serif font-medium text-clay-800 mb-4 flex items-center gap-2"><User className="h-4 w-4 text-clay-500" />个人资料</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-clay-600">昵称</Label>
                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm text-clay-600">简介</Label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 w-full h-20 rounded-xl border border-clay-200 p-3 text-sm resize-none focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/20" maxLength={200} />
                <p className="text-xs text-clay-400 mt-1 text-right">{bio.length}/200</p>
              </div>
              <Button onClick={handleSaveProfile} disabled={saving} className="rounded-full">{saving ? '保存中...' : '保存修改'}</Button>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl bg-white border border-clay-100 p-6">
            <h3 className="font-serif font-medium text-clay-800 mb-4 flex items-center gap-2"><Lock className="h-4 w-4 text-clay-500" />账号安全</h3>
            <div className="space-y-3">
              <div><Label className="text-sm text-clay-600">原密码</Label><Input type="password" className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm text-clay-600">新密码</Label><Input type="password" className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm text-clay-600">确认新密码</Label><Input type="password" className="mt-1 rounded-xl" /></div>
              <Button variant="outline" className="rounded-full">修改密码</Button>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl bg-white border border-clay-100 p-6">
            <h3 className="font-serif font-medium text-clay-800 mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-clay-500" />通知设置</h3>
            <div className="space-y-4">
              {[
                { key: 'tutorial', label: '教程更新通知', desc: '新教程发布或更新时通知' },
                { key: 'community', label: '社区互动通知', desc: '有人点赞、评论你的作品时通知' },
                { key: 'activity', label: '活动提醒', desc: '新的挑战活动和打卡提醒' },
                { key: 'system', label: '系统消息', desc: '平台重要更新和通知' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between">
                  <div><p className="text-sm text-clay-700">{n.label}</p><p className="text-xs text-clay-400">{n.desc}</p></div>
                  <Switch checked={notifications[n.key as keyof typeof notifications]} onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))} />
                </div>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-2xl bg-white border border-red-200 p-6">
            <h3 className="font-serif font-medium text-red-600 mb-2">危险操作</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-clay-500">退出当前账号</p>
              <Button variant="outline" className="rounded-full border-red-200 text-red-500 hover:bg-red-50" onClick={() => {
                useAuthStore.getState().signOut()
                getSupabaseClient().auth.signOut().finally(() => {
                  window.location.href = '/'
                })
              }}>
                <LogOut className="h-4 w-4 mr-1.5" /> 退出登录
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
