// ─── 野造 · 用户中心数据 ───
export interface UserProfile {
  id: string; nickname: string; avatar_url: string | null; bio: string
  level: number; level_name: string; joined_at: string
  stats: UserDashboardStats
}

export interface UserDashboardStats {
  completed_tutorials: number; total_hours: number; favorites_count: number
  works_count: number; streak_days: number; total_likes: number
}

export interface FavoriteItem {
  id: string; type: 'tutorial' | 'material' | 'post'
  title: string; cover_url: string | null; category: string
  created_at: string; slug: string
}

export interface LearningItem {
  id: string; tutorial_slug: string; tutorial_title: string
  cover_url: string | null; completed_steps: number; total_steps: number
  progress_percent: number; last_learned_at: string; completed_at: string | null
}

export interface ChallengeData {
  id: string; title: string; description: string; icon: string
  target_days: number; completed_days: number; current_streak: number
  is_active: boolean; end_date: string
}

export interface BadgeData {
  id: string; name: string; icon: string; description: string
  earned: boolean; earned_at: string | null
}

export interface CheckInRecord {
  date: string; hours: number; tutorials: number
}

export interface LeaderboardUser {
  rank: number; nickname: string; avatar_url: string | null; days: number; hours: number
}

export const mockProfile: UserProfile = {
  id: 'u10', nickname: '手工小白', avatar_url: null, bio: '入坑手作三个月，热爱藤编和黏土，每周至少做3小时手工。最近迷上了Macrame挂毯！',
  level: 5, level_name: '匠心初现', joined_at: '2026-02-15',
  stats: { completed_tutorials: 8, total_hours: 42, favorites_count: 23, works_count: 5, streak_days: 7, total_likes: 456 },
}

export const mockFavorites: FavoriteItem[] = [
  { id: 'f1', type: 'tutorial', title: '初学者藤编收纳篮', cover_url: null, category: 'weaving', created_at: '2026-05-20', slug: 'beginner-weaving-basket' },
  { id: 'f2', type: 'tutorial', title: '入门木勺雕刻', cover_url: null, category: 'woodwork', created_at: '2026-05-15', slug: 'wooden-spoon-carving' },
  { id: 'f3', type: 'tutorial', title: '法式刺绣入门：叶片胸针', cover_url: null, category: 'embroidery', created_at: '2026-05-10', slug: 'french-embroidery-brooch' },
  { id: 'f4', type: 'material', title: '天然印尼藤条(3mm)', cover_url: null, category: 'weaving', created_at: '2026-05-20', slug: 'natural-rattan' },
  { id: 'f5', type: 'material', title: 'DMC法国刺绣线', cover_url: null, category: 'embroidery', created_at: '2026-05-10', slug: 'dmc-embroidery-thread' },
  { id: 'f6', type: 'material', title: '石塑黏土 LaDoll', cover_url: null, category: 'clay', created_at: '2026-05-05', slug: 'stone-clay-ladoll' },
  { id: 'f7', type: 'post', title: '植鞣皮钱包使用一年养色记录', cover_url: null, category: 'leather', created_at: '2026-05-20', slug: 'vegetable-leather-patina' },
  { id: 'f8', type: 'post', title: '编织用藤条全面对比', cover_url: null, category: 'weaving', created_at: '2026-05-15', slug: 'weaving-material-compare' },
]

export const mockLearning: LearningItem[] = [
  { id: 'l1', tutorial_slug: 'beginner-weaving-basket', tutorial_title: '初学者藤编收纳篮', cover_url: null, completed_steps: 6, total_steps: 8, progress_percent: 75, last_learned_at: '2026-05-29', completed_at: null },
  { id: 'l2', tutorial_slug: 'french-embroidery-brooch', tutorial_title: '法式刺绣入门：叶片胸针', cover_url: null, completed_steps: 3, total_steps: 6, progress_percent: 50, last_learned_at: '2026-05-25', completed_at: null },
  { id: 'l3', tutorial_slug: 'mini-leather-cardholder', tutorial_title: '新手皮具：极简卡包', cover_url: null, completed_steps: 4, total_steps: 4, progress_percent: 100, last_learned_at: '2026-05-20', completed_at: '2026-05-20' },
  { id: 'l4', tutorial_slug: 'wooden-spoon-carving', tutorial_title: '入门木勺雕刻', cover_url: null, completed_steps: 6, total_steps: 6, progress_percent: 100, last_learned_at: '2026-05-10', completed_at: '2026-05-10' },
]

export const mockChallenges: ChallengeData[] = [
  { id: 'ch1', title: '7天入门挑战', description: '连续7天每天完成至少30分钟手作', icon: '🌱', target_days: 7, completed_days: 7, current_streak: 7, is_active: true, end_date: '2026-06-07' },
  { id: 'ch2', title: '30天坚持挑战', description: '坚持30天每日手作打卡', icon: '🔥', target_days: 30, completed_days: 12, current_streak: 7, is_active: true, end_date: '2026-06-30' },
]

export const mockBadges: BadgeData[] = [
  { id: 'b1', name: '初入匠门', icon: '🌱', description: '完成第一个教程', earned: true, earned_at: '2026-02-20' },
  { id: 'b2', name: '匠心初现', icon: '⭐', description: '完成5个教程', earned: true, earned_at: '2026-03-15' },
  { id: 'b3', name: '坚持之星', icon: '🌟', description: '连续打卡7天', earned: true, earned_at: '2026-03-28' },
  { id: 'b4', name: '打卡达人', icon: '🔥', description: '累计打卡30天', earned: true, earned_at: '2026-04-20' },
  { id: 'b5', name: '多面手', icon: '🎯', description: '完成3个不同品类教程', earned: true, earned_at: '2026-05-01' },
  { id: 'b6', name: '人气之星', icon: '👑', description: '作品获得100个赞', earned: true, earned_at: '2026-05-10' },
  { id: 'b7', name: '高阶玩家', icon: '💎', description: '完成一个挑战级教程', earned: false, earned_at: null },
  { id: 'b8', name: '社交达人', icon: '🦋', description: '发布10篇作品', earned: false, earned_at: null },
  { id: 'b9', name: '全勤王者', icon: '🏆', description: '累计打卡100天', earned: false, earned_at: null },
  { id: 'b10', name: '百科全书', icon: '📚', description: '收藏50个教程', earned: false, earned_at: null },
]

export const mockCheckIns: CheckInRecord[] = [
  { date: '2026-05-29', hours: 1.5, tutorials: 1 },
  { date: '2026-05-28', hours: 0.5, tutorials: 0 },
  { date: '2026-05-27', hours: 2, tutorials: 1 },
  { date: '2026-05-26', hours: 0, tutorials: 0 },
  { date: '2026-05-25', hours: 1, tutorials: 1 },
  { date: '2026-05-24', hours: 0.5, tutorials: 0 },
  { date: '2026-05-23', hours: 3, tutorials: 2 },
]

export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, nickname: '泥巴匠', avatar_url: null, days: 28, hours: 56 },
  { rank: 2, nickname: '绣绣子', avatar_url: null, days: 27, hours: 48 },
  { rank: 3, nickname: '小藤匠', avatar_url: null, days: 26, hours: 62 },
  { rank: 4, nickname: '木语人', avatar_url: null, days: 25, hours: 45 },
  { rank: 5, nickname: '养皮人', avatar_url: null, days: 24, hours: 40 },
  { rank: 6, nickname: '皮皮虾', avatar_url: null, days: 23, hours: 35 },
  { rank: 7, nickname: '绣花娘', avatar_url: null, days: 22, hours: 38 },
  { rank: 8, nickname: '手工小白', avatar_url: null, days: 21, hours: 28 },
]
