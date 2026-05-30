// ─── 野造 · 核心类型定义 ───

// ── 用户 ──
export interface User {
  id: string
  email: string
  nickname: string
  avatar_url: string | null
  bio: string
  phone: string | null
  role: 'user' | 'admin'
  status: 'active' | 'banned'
  created_at: string
  stats: UserStats
}

export interface UserStats {
  works_count: number
  favorites_count: number
  following_count: number
  followers_count: number
}

export interface Author {
  id: string
  nickname: string
  avatar_url: string | null
}

// ── 教程 ──
export type Category = 'weaving' | 'leather' | 'woodwork' | 'clay' | 'embroidery' | 'other'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type TutorialStatus = 'draft' | 'published' | 'archived'

export interface Tutorial {
  id: string
  title: string
  slug: string
  cover_url: string | null
  video_url: string | null
  category: Category
  difficulty: Difficulty
  duration_minutes: number
  description: string
  author: Author
  favorites_count: number
  learners_count: number
  status: TutorialStatus
  created_at: string
  updated_at: string
  steps: TutorialStep[]
  materials: MaterialItem[]
  notes: string[]
}

export interface TutorialStep {
  id: string
  order: number
  title: string
  description: string
  image_url: string | null
}

export interface MaterialItem {
  id: string
  name: string
  amount: string
  note: string
  purchase_url: string | null
}

// ── 材料 ──
export interface Material {
  id: string
  name: string
  category: Category
  image_url: string | null
  description: string
  specs: MaterialSpec
  buying_tips: string[]
  comparisons: MaterialComparison[]
  alternatives: MaterialAlternative[]
  purchase_links: PurchaseLink[]
  created_at: string
}

export interface MaterialSpec {
  texture: string
  size: string
  scenarios: string[]
}

export interface MaterialComparison {
  grade: string
  pros: string[]
  cons: string[]
  price_range: string
}

export interface MaterialAlternative {
  name: string
  image_url: string | null
  description: string
  material_id: string | null
}

export interface PurchaseLink {
  name: string
  url: string
  platform: string
  price: string | null
}

// ── 社区 ──
export type Topic = 'all' | 'newbie' | 'showcase' | 'review' | 'activity'

export interface Post {
  id: string
  title: string
  content: string
  images: string[]
  video_url: string | null
  topic: Topic
  tags: string[]
  author: Author
  likes_count: number
  comments_count: number
  is_liked: boolean
  is_favorited: boolean
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  comments: Comment[]
}

export interface Comment {
  id: string
  author: Author
  content: string
  created_at: string
  replies: Comment[]
}

// ── 打卡 & 勋章 ──
export interface CheckIn {
  id: string
  user_id: string
  date: string
  hours_spent: number
  tutorials_completed: number
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  condition: string
  is_earned: boolean
  earned_at: string | null
}

export interface LeaderboardEntry {
  rank: number
  user: Author
  checkin_days: number
  total_hours: number
}

// ── 收藏 & 学习进度 ──
export interface Favorite {
  id: string
  user_id: string
  item_type: 'tutorial' | 'material'
  item_id: string
  item_title: string
  item_cover: string | null
  item_category: Category
  created_at: string
}

export interface LearningProgress {
  id: string
  user_id: string
  tutorial_id: string
  tutorial_title: string
  tutorial_cover: string | null
  completed_steps: number
  total_steps: number
  progress_percent: number
  last_learned_at: string
  completed_step_ids: string[]
}

// ── 管理员 ──
export interface AdminUser {
  id: string
  username: string
  role: 'super_admin' | 'editor' | 'moderator'
  created_at: string
}

export interface OperationLog {
  id: string
  admin_username: string
  action: string
  target: string
  created_at: string
}

export interface AdminStats {
  total_users: number
  new_users_today: number
  total_tutorials: number
  total_posts: number
  daily_active_users: number
  daily_new_users: { date: string; count: number }[]
  category_distribution: { name: string; value: number; color: string }[]
}

// ── 通用 ──
export const CATEGORY_LABELS: Record<Category, string> = {
  weaving: '编织',
  leather: '皮具',
  woodwork: '木工',
  clay: '黏土',
  embroidery: '刺绣',
  other: '其他',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  weaving: '🧶',
  leather: '👜',
  woodwork: '🪵',
  clay: '🏺',
  embroidery: '🪡',
  other: '✨',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '挑战',
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'bg-sage-100 text-sage-700',
  intermediate: 'bg-warm-100 text-warm-700',
  advanced: 'bg-clay-100 text-clay-700',
}

export const TOPIC_LABELS: Record<Topic, string> = {
  all: '全部',
  newbie: '新手避坑',
  showcase: '成品展示',
  review: '材料测评',
  activity: '活动专区',
}
