// ─── 野造 · 后台管理数据 ───
export interface AdminStats {
  total_users: number; new_users_today: number; active_users: number
  total_tutorials: number; total_materials: number; total_posts: number; total_comments: number
}
export interface ChartDataPoint { name: string; value: number; value2?: number }
export interface AdminUser { id: string; username: string; role: 'super_admin' | 'admin' | 'editor' | 'moderator'; status: 'active' | 'disabled'; created_at: string }
export interface AdminLog { id: string; user: string; action: string; target: string; time: string }

export const adminStats: AdminStats = {
  total_users: 12850, new_users_today: 47, active_users: 1890,
  total_tutorials: 12, total_materials: 12, total_posts: 11, total_comments: 34,
}

export const userGrowthData: ChartDataPoint[] = [
  { name: '05/23', value: 35 }, { name: '05/24', value: 42 }, { name: '05/25', value: 38 },
  { name: '05/26', value: 55 }, { name: '05/27', value: 41 }, { name: '05/28', value: 49 }, { name: '05/29', value: 47 },
]

export const tutorialCategoryData: ChartDataPoint[] = [
  { name: '编织', value: 3 }, { name: '皮具', value: 2 }, { name: '木工', value: 2 },
  { name: '黏土', value: 2 }, { name: '刺绣', value: 2 }, { name: '其他', value: 1 },
]

export const communityActivityData: ChartDataPoint[] = [
  { name: '周一', value: 12 }, { name: '周二', value: 18 }, { name: '周三', value: 15 },
  { name: '周四', value: 22 }, { name: '周五', value: 28 }, { name: '周六', value: 35 }, { name: '周日', value: 30 },
]

export const adminUsers: AdminUser[] = [
  { id: 'a1', username: 'superadmin', role: 'super_admin', status: 'active', created_at: '2025-01-01' },
  { id: 'a2', username: 'admin_wang', role: 'admin', status: 'active', created_at: '2025-06-15' },
  { id: 'a3', username: 'editor_li', role: 'editor', status: 'active', created_at: '2025-08-20' },
  { id: 'a4', username: 'mod_zhang', role: 'moderator', status: 'active', created_at: '2025-10-01' },
]

export const adminLogs: AdminLog[] = [
  { id: 'l1', user: 'superadmin', action: '新增教程', target: '编织挂毯入门', time: '2026-05-29 14:30' },
  { id: 'l2', user: 'editor_li', action: '编辑教程', target: '初学者藤编收纳篮', time: '2026-05-29 11:20' },
  { id: 'l3', user: 'mod_zhang', action: '通过审核', target: '五月打卡挑战', time: '2026-05-29 09:15' },
  { id: 'l4', user: 'superadmin', action: '禁用用户', target: '广告账号001', time: '2026-05-28 16:45' },
  { id: 'l5', user: 'editor_li', action: '新增材料', target: '苏绣真丝绣线', time: '2026-05-28 14:00' },
  { id: 'l6', user: 'superadmin', action: '修改配置', target: '首页轮播图', time: '2026-05-28 10:30' },
  { id: 'l7', user: 'mod_zhang', action: '删除评论', target: '违规评论#4523', time: '2026-05-27 20:10' },
  { id: 'l8', user: 'admin_wang', action: '下架教程', target: '过时编织教程', time: '2026-05-27 15:30' },
]

export interface PendingReview {
  id: string; type: 'post' | 'comment'; title: string; author: string; created_at: string; status: 'pending' | 'approved' | 'rejected'
}
export const pendingReviews: PendingReview[] = [
  { id: 'r1', type: 'post', title: '新手上路：我的第一个木勺', author: '木头新人', created_at: '2026-05-29', status: 'pending' },
  { id: 'r2', type: 'post', title: '皮具工具二手转让贴', author: '工具达人', created_at: '2026-05-29', status: 'pending' },
  { id: 'r3', type: 'comment', title: '回复：这个材料哪里买', author: '匿名用户', created_at: '2026-05-29', status: 'pending' },
]

export interface SystemConfig {
  site_name: string; site_description: string; logo_url: string | null
  banners: string[]; footer_text: string; allow_registration: boolean; maintenance_mode: boolean
}
export const systemConfig: SystemConfig = {
  site_name: '野造', site_description: '手作DIY学习交流平台', logo_url: null,
  banners: [], footer_text: '© 2026 野造 Yezhao. All rights reserved.',
  allow_registration: true, maintenance_mode: false,
}
