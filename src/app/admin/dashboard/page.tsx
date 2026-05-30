// ─── 野造 · Admin Dashboard ───
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, Package, MessageSquare, TrendingUp, UserPlus, Activity, Clock } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/shared/section-header'
import { Skeleton } from '@/components/shared/loading-skeleton'
import type { AdminStats, ChartDataPoint, AdminLog } from '@/data/admin'

const PIE_COLORS = ['#C67B5C', '#D4956B', '#E8A87C', '#8FA98B', '#6E8C6A', '#B8CDB0']
const statIcons = [Users, UserPlus, BookOpen, Package, MessageSquare, Activity]

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [userGrowth, setUserGrowth] = useState<ChartDataPoint[]>([])
  const [categoryData, setCategoryData] = useState<ChartDataPoint[]>([])
  const [communityActivity, setCommunityActivity] = useState<ChartDataPoint[]>([])
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard').then((r) => r.json()).then((d) => {
      setStats(d.stats); setUserGrowth(d.userGrowth); setCategoryData(d.categoryDistribution)
      setCommunityActivity(d.communityActivity); setLogs(d.logs)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 lg:p-8 space-y-6"><Skeleton className="h-32 w-full rounded-2xl" /><Skeleton className="h-64 w-full rounded-2xl" /></div>

  const statCards = stats ? [
    { label: '总用户', value: stats.total_users.toLocaleString(), sub: `+${stats.new_users_today} 今日` },
    { label: '活跃用户', value: stats.active_users.toLocaleString(), sub: '今日' },
    { label: '教程数', value: stats.total_tutorials, sub: '已发布' },
    { label: '材料数', value: stats.total_materials, sub: '条指南' },
    { label: '帖子数', value: stats.total_posts, sub: '社区' },
    { label: '评论数', value: stats.total_comments, sub: '互动' },
  ] : []

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-clay-800">数据看板</h1>
        <p className="text-sm text-clay-500 mt-1">平台运营概览</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {statCards.map((s, i) => {
          const Icon = statIcons[i]
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4 lg:p-5 border-clay-200/60">
                <div className="flex items-center gap-2 mb-3"><Icon className="h-4 w-4 text-clay-400" /><span className="text-xs text-clay-500">{s.label}</span></div>
                <p className="font-serif text-2xl font-semibold text-clay-800">{s.value}</p>
                <p className="text-xs text-clay-400 mt-0.5">{s.sub}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5 lg:p-6 border-clay-200/60">
          <h3 className="font-serif font-medium text-clay-700 mb-4">📈 用户增长趋势 (近7日)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={userGrowth}><CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" /><XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a89b90' }} /><YAxis tick={{ fontSize: 12, fill: '#a89b90' }} /><Tooltip /><Bar dataKey="value" fill="#C67B5C" radius={[6, 6, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 lg:p-6 border-clay-200/60">
          <h3 className="font-serif font-medium text-clay-700 mb-4">🎯 教程分类占比</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}`}><Cell fill="#C67B5C" /><Cell fill="#D4956B" /><Cell fill="#E8A87C" /><Cell fill="#8FA98B" /><Cell fill="#6E8C6A" /><Cell fill="#B8CDB0" /></Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 lg:p-6 border-clay-200/60">
          <h3 className="font-serif font-medium text-clay-700 mb-4">💬 社区活跃趋势 (本周)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={communityActivity}><CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" /><XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a89b90' }} /><YAxis tick={{ fontSize: 12, fill: '#a89b90' }} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#C67B5C" strokeWidth={2} dot={{ fill: '#C67B5C' }} /></LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Logs */}
        <Card className="p-5 lg:p-6 border-clay-200/60">
          <h3 className="font-serif font-medium text-clay-700 mb-3">📋 最近操作</h3>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-clay-50 last:border-0">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">{log.user}</Badge>
                  <span className="text-clay-700">{log.action}</span>
                  <span className="text-clay-500">— {log.target}</span>
                </div>
                <span className="text-xs text-clay-400">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
