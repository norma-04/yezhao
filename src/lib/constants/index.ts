// ─── 野造 · 全局常量 ───

export const SITE_CONFIG = {
  name: '野造',
  tagline: '指尖造物，心生温暖',
  description: '野造是一个专注于手作DIY学习、材料指导与作品分享的专业化平台。从编织到木工，从皮具到刺绣，让每一双热爱生活的手，都能创造独一无二的温暖。',
  url: 'https://yezao.art',
  ogImage: '/images/og-default.jpg',
  links: {
    email: 'hello@yezao.art',
    wechat: 'yezao_official',
    weibo: '@野造官方',
  },
} as const

export const NAV_ITEMS = [
  { label: '首页', href: '/', icon: 'Home' },
  { label: '学教程', href: '/tutorials', icon: 'BookOpen' },
  { label: '选材料', href: '/materials', icon: 'Package' },
  { label: '晒作品', href: '/community', icon: 'Palette' },
] as const

export const CATEGORIES = [
  { key: 'weaving', label: '编织', icon: '🧶', description: '藤编、竹编、Macrame' },
  { key: 'leather', label: '皮具', icon: '👜', description: '皮包、皮夹、皮雕' },
  { key: 'woodwork', label: '木工', icon: '🪵', description: '木雕、榫卯、木艺' },
  { key: 'clay', label: '黏土', icon: '🏺', description: '软陶、石塑、树脂黏土' },
  { key: 'embroidery', label: '刺绣', icon: '🪡', description: '法绣、苏绣、十字绣' },
  { key: 'other', label: '其他', icon: '✨', description: '蜡烛、皂艺、纸艺' },
] as const

export const DIFFICULTIES = [
  { key: 'beginner', label: '入门' },
  { key: 'intermediate', label: '进阶' },
  { key: 'advanced', label: '挑战' },
] as const

export const SORT_OPTIONS = [
  { key: 'latest', label: '最新发布' },
  { key: 'popular', label: '最受欢迎' },
  { key: 'favorites', label: '收藏最多' },
] as const

export const TOPICS = [
  { key: 'all', label: '全部', icon: '🌟' },
  { key: 'newbie', label: '新手避坑', icon: '🔰' },
  { key: 'showcase', label: '成品展示', icon: '🎨' },
  { key: 'review', label: '材料测评', icon: '📊' },
  { key: 'activity', label: '活动专区', icon: '🎪' },
] as const

export const ADMIN_NAV_ITEMS = [
  { label: '数据看板', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: '教程管理', href: '/admin/tutorials', icon: 'BookOpen' },
  { label: '材料管理', href: '/admin/materials', icon: 'Package' },
  { label: '用户管理', href: '/admin/users', icon: 'Users' },
  { label: '社区管理', href: '/admin/community', icon: 'MessageSquare' },
  { label: '系统设置', href: '/admin/settings', icon: 'Settings' },
] as const
