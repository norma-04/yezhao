// ─── 野造 · Supabase 数据库类型 ───
// Generated schema matching the initial migration
// Run `supabase gen types typescript` after connecting to regenerate

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      tutorials: {
        Row: TutorialRow
        Insert: TutorialInsert
        Update: TutorialUpdate
      }
      tutorial_steps: {
        Row: TutorialStepRow
        Insert: TutorialStepInsert
        Update: TutorialStepUpdate
      }
      tutorial_materials: {
        Row: TutorialMaterialRow
        Insert: TutorialMaterialInsert
        Update: TutorialMaterialUpdate
      }
      tutorial_notes: {
        Row: TutorialNoteRow
        Insert: TutorialNoteInsert
        Update: TutorialNoteUpdate
      }
      materials: {
        Row: MaterialRow
        Insert: MaterialInsert
        Update: MaterialUpdate
      }
      material_comparisons: {
        Row: MaterialComparisonRow
        Insert: MaterialComparisonInsert
        Update: MaterialComparisonUpdate
      }
      material_alternatives: {
        Row: MaterialAlternativeRow
        Insert: MaterialAlternativeInsert
        Update: MaterialAlternativeUpdate
      }
      material_purchase_links: {
        Row: MaterialPurchaseLinkRow
        Insert: MaterialPurchaseLinkInsert
        Update: MaterialPurchaseLinkUpdate
      }
      material_buying_tips: {
        Row: MaterialBuyingTipRow
        Insert: MaterialBuyingTipInsert
        Update: MaterialBuyingTipUpdate
      }
      material_faqs: {
        Row: MaterialFaqRow
        Insert: MaterialFaqInsert
        Update: MaterialFaqUpdate
      }
      posts: {
        Row: PostRow
        Insert: PostInsert
        Update: PostUpdate
      }
      comments: {
        Row: CommentRow
        Insert: CommentInsert
        Update: CommentUpdate
      }
      favorites: {
        Row: FavoriteRow
        Insert: FavoriteInsert
        Update: FavoriteUpdate
      }
      likes: {
        Row: LikeRow
        Insert: LikeInsert
        Update: LikeUpdate
      }
      follows: {
        Row: FollowRow
        Insert: FollowInsert
        Update: FollowUpdate
      }
      learning_progress: {
        Row: LearningProgressRow
        Insert: LearningProgressInsert
        Update: LearningProgressUpdate
      }
      checkins: {
        Row: CheckinRow
        Insert: CheckinInsert
        Update: CheckinUpdate
      }
      badges: {
        Row: BadgeRow
        Insert: BadgeInsert
        Update: BadgeUpdate
      }
      user_badges: {
        Row: UserBadgeRow
        Insert: UserBadgeInsert
        Update: UserBadgeUpdate
      }
      challenges: {
        Row: ChallengeRow
        Insert: ChallengeInsert
        Update: ChallengeUpdate
      }
      challenge_participants: {
        Row: ChallengeParticipantRow
        Insert: ChallengeParticipantInsert
        Update: ChallengeParticipantUpdate
      }
      notifications: {
        Row: NotificationRow
        Insert: NotificationInsert
        Update: NotificationUpdate
      }
      admin_logs: {
        Row: AdminLogRow
        Insert: AdminLogInsert
        Update: AdminLogUpdate
      }
      site_settings: {
        Row: SiteSettingRow
        Insert: SiteSettingInsert
        Update: SiteSettingUpdate
      }
    }
    Views: Record<string, never>
    Functions: {
      get_user_stats: {
        Args: { user_id: string }
        Returns: {
          works_count: number
          favorites_count: number
          followers_count: number
          following_count: number
        }
      }
    }
    Enums: {
      user_role: 'user' | 'admin' | 'super_admin'
      user_status: 'active' | 'banned'
      tutorial_category: 'weaving' | 'leather' | 'woodwork' | 'clay' | 'embroidery' | 'other'
      tutorial_difficulty: 'beginner' | 'intermediate' | 'advanced'
      tutorial_status: 'draft' | 'published' | 'archived'
      post_topic: 'showcase' | 'newbie' | 'review' | 'activity'
      content_status: 'pending' | 'approved' | 'rejected'
      notification_type: 'like' | 'comment' | 'favorite' | 'follow' | 'challenge_complete' | 'badge_earned' | 'system'
      challenge_status: 'active' | 'completed' | 'cancelled'
    }
  }
}

// ─── Profile Types ───
export interface ProfileRow {
  id: string
  email: string
  username: string | null
  nickname: string
  avatar_url: string | null
  bio: string
  phone: string | null
  role: 'user' | 'admin' | 'super_admin'
  status: 'active' | 'banned'
  website: string | null
  location: string | null
  social_links: Record<string, string>
  preferences: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  email: string
  username?: string | null
  nickname?: string
  avatar_url?: string | null
  bio?: string
  phone?: string | null
  role?: 'user' | 'admin' | 'super_admin'
  website?: string | null
  location?: string | null
}

export interface ProfileUpdate {
  username?: string | null
  nickname?: string
  avatar_url?: string | null
  bio?: string
  phone?: string | null
  website?: string | null
  location?: string | null
  social_links?: Record<string, string>
  preferences?: Record<string, unknown>
}

// ─── Tutorial Types ───
export interface TutorialRow {
  id: string
  title: string
  slug: string
  cover_url: string | null
  video_url: string | null
  category: 'weaving' | 'leather' | 'woodwork' | 'clay' | 'embroidery' | 'other'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number
  description: string
  author_id: string | null
  favorites_count: number
  learners_count: number
  status: 'draft' | 'published' | 'archived'
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TutorialInsert {
  title: string
  slug: string
  cover_url?: string | null
  video_url?: string | null
  category?: 'weaving' | 'leather' | 'woodwork' | 'clay' | 'embroidery' | 'other'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes?: number
  description?: string
  author_id?: string | null
  status?: 'draft' | 'published' | 'archived'
}

export interface TutorialUpdate {
  title?: string
  slug?: string
  cover_url?: string | null
  video_url?: string | null
  category?: 'weaving' | 'leather' | 'woodwork' | 'clay' | 'embroidery' | 'other'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes?: number
  description?: string
  status?: 'draft' | 'published' | 'archived'
}

export interface TutorialStepRow {
  id: string
  tutorial_id: string
  order: number
  title: string
  description: string
  image_url: string | null
  created_at: string
}

export interface TutorialStepInsert {
  tutorial_id: string
  order?: number
  title: string
  description?: string
  image_url?: string | null
}

export type TutorialStepUpdate = Partial<TutorialStepInsert>

export interface TutorialMaterialRow {
  id: string
  tutorial_id: string
  name: string
  amount: string
  note: string
  purchase_url: string | null
  created_at: string
}

export interface TutorialMaterialInsert {
  tutorial_id: string
  name: string
  amount?: string
  note?: string
  purchase_url?: string | null
}

export type TutorialMaterialUpdate = Partial<TutorialMaterialInsert>

export interface TutorialNoteRow {
  id: string
  tutorial_id: string
  content: string
  created_at: string
}

export interface TutorialNoteInsert {
  tutorial_id: string
  content: string
}

export type TutorialNoteUpdate = Partial<TutorialNoteInsert>

// ─── Material Types ───
export interface MaterialRow {
  id: string
  name: string
  slug: string
  category: 'weaving' | 'leather' | 'woodwork' | 'clay' | 'embroidery' | 'other'
  image_url: string | null
  description: string
  texture: string
  size_info: string
  scenarios: string[]
  created_at: string
  updated_at: string
}

export interface MaterialInsert {
  name: string
  slug: string
  category?: 'weaving' | 'leather' | 'woodwork' | 'clay' | 'embroidery' | 'other'
  image_url?: string | null
  description?: string
  texture?: string
  size_info?: string
  scenarios?: string[]
}

export type MaterialUpdate = Partial<MaterialInsert>

export interface MaterialComparisonRow {
  id: string
  material_id: string
  grade: string
  pros: string[]
  cons: string[]
  price_range: string
  created_at: string
}

export interface MaterialComparisonInsert {
  material_id: string
  grade: string
  pros?: string[]
  cons?: string[]
  price_range?: string
}

export type MaterialComparisonUpdate = Partial<MaterialComparisonInsert>

export interface MaterialAlternativeRow {
  id: string
  material_id: string
  name: string
  image_url: string | null
  description: string
  created_at: string
}

export interface MaterialAlternativeInsert {
  material_id: string
  name: string
  image_url?: string | null
  description?: string
}

export type MaterialAlternativeUpdate = Partial<MaterialAlternativeInsert>

export interface MaterialPurchaseLinkRow {
  id: string
  material_id: string
  name: string
  url: string
  platform: string
  price: string | null
  created_at: string
}

export interface MaterialPurchaseLinkInsert {
  material_id: string
  name: string
  url: string
  platform?: string
  price?: string | null
}

export type MaterialPurchaseLinkUpdate = Partial<MaterialPurchaseLinkInsert>

export interface MaterialBuyingTipRow {
  id: string
  material_id: string
  tip: string
  created_at: string
}

export interface MaterialBuyingTipInsert {
  material_id: string
  tip: string
}

export type MaterialBuyingTipUpdate = Partial<MaterialBuyingTipInsert>

export interface MaterialFaqRow {
  id: string
  material_id: string
  question: string
  answer: string
  created_at: string
}

export interface MaterialFaqInsert {
  material_id: string
  question: string
  answer: string
}

export type MaterialFaqUpdate = Partial<MaterialFaqInsert>

// ─── Post Types ───
export interface PostRow {
  id: string
  title: string
  slug: string
  content: string
  images: string[]
  video_url: string | null
  topic: 'showcase' | 'newbie' | 'review' | 'activity'
  tags: string[]
  author_id: string | null
  likes_count: number
  comments_count: number
  favorites_count: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface PostInsert {
  title: string
  slug: string
  content?: string
  images?: string[]
  video_url?: string | null
  topic?: 'showcase' | 'newbie' | 'review' | 'activity'
  tags?: string[]
  author_id?: string | null
  status?: 'pending' | 'approved' | 'rejected'
}

export interface PostUpdate {
  title?: string
  content?: string
  images?: string[]
  video_url?: string | null
  topic?: 'showcase' | 'newbie' | 'review' | 'activity'
  tags?: string[]
  status?: 'pending' | 'approved' | 'rejected'
}

// ─── Comment Types ───
export interface CommentRow {
  id: string
  post_id: string
  parent_id: string | null
  author_id: string | null
  content: string
  likes_count: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface CommentInsert {
  post_id: string
  parent_id?: string | null
  author_id?: string | null
  content: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface CommentUpdate {
  content?: string
  status?: 'pending' | 'approved' | 'rejected'
}

// ─── Favorite Types ───
export interface FavoriteRow {
  id: string
  user_id: string
  item_type: 'tutorial' | 'material' | 'post'
  item_id: string
  created_at: string
}

export interface FavoriteInsert {
  user_id: string
  item_type: 'tutorial' | 'material' | 'post'
  item_id: string
}

export type FavoriteUpdate = Partial<FavoriteInsert>

// ─── Like Types ───
export interface LikeRow {
  id: string
  user_id: string
  target_type: 'post' | 'comment'
  target_id: string
  created_at: string
}

export interface LikeInsert {
  user_id: string
  target_type: 'post' | 'comment'
  target_id: string
}

export type LikeUpdate = Partial<LikeInsert>

// ─── Follow Types ───
export interface FollowRow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface FollowInsert {
  follower_id: string
  following_id: string
}

export type FollowUpdate = Partial<FollowInsert>

// ─── Learning Progress Types ───
export interface LearningProgressRow {
  id: string
  user_id: string
  tutorial_id: string
  completed_step_ids: string[]
  progress_percent: number
  last_learned_at: string
  created_at: string
}

export interface LearningProgressInsert {
  user_id: string
  tutorial_id: string
  completed_step_ids?: string[]
  progress_percent?: number
  last_learned_at?: string
}

export type LearningProgressUpdate = Partial<LearningProgressInsert>

// ─── Checkin Types ───
export interface CheckinRow {
  id: string
  user_id: string
  check_date: string
  hours_spent: number
  tutorials_completed: number
  created_at: string
}

export interface CheckinInsert {
  user_id: string
  check_date?: string
  hours_spent?: number
  tutorials_completed?: number
}

export type CheckinUpdate = Partial<CheckinInsert>

// ─── Badge Types ───
export interface BadgeRow {
  id: string
  name: string
  icon: string
  description: string
  condition_json: Record<string, unknown>
  created_at: string
}

export interface BadgeInsert {
  name: string
  icon?: string
  description?: string
  condition_json?: Record<string, unknown>
}

export type BadgeUpdate = Partial<BadgeInsert>

export interface UserBadgeRow {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
}

export interface UserBadgeInsert {
  user_id: string
  badge_id: string
  earned_at?: string
}

export type UserBadgeUpdate = Partial<UserBadgeInsert>

// ─── Challenge Types ───
export interface ChallengeRow {
  id: string
  title: string
  icon: string
  description: string
  target_days: number
  start_date: string
  end_date: string | null
  status: 'active' | 'completed' | 'cancelled'
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ChallengeInsert {
  title: string
  icon?: string
  description?: string
  target_days?: number
  start_date?: string
  end_date?: string | null
  status?: 'active' | 'completed' | 'cancelled'
  created_by?: string | null
}

export type ChallengeUpdate = Partial<ChallengeInsert>

export interface ChallengeParticipantRow {
  id: string
  challenge_id: string
  user_id: string
  completed_days: number
  current_streak: number
  joined_at: string
}

export interface ChallengeParticipantInsert {
  challenge_id: string
  user_id: string
  completed_days?: number
  current_streak?: number
}

export type ChallengeParticipantUpdate = Partial<ChallengeParticipantInsert>

// ─── Notification Types ───
export interface NotificationRow {
  id: string
  user_id: string
  type: 'like' | 'comment' | 'favorite' | 'follow' | 'challenge_complete' | 'badge_earned' | 'system'
  title: string
  message: string
  data: Record<string, unknown>
  is_read: boolean
  actor_id: string | null
  created_at: string
}

export interface NotificationInsert {
  user_id: string
  type: 'like' | 'comment' | 'favorite' | 'follow' | 'challenge_complete' | 'badge_earned' | 'system'
  title: string
  message?: string
  data?: Record<string, unknown>
  actor_id?: string | null
}

export type NotificationUpdate = Partial<Pick<NotificationRow, 'is_read'>>

// ─── Admin Types ───
export interface AdminLogRow {
  id: string
  admin_id: string | null
  action: string
  target_type: string
  target_id: string | null
  details: Record<string, unknown>
  created_at: string
}

export interface AdminLogInsert {
  admin_id?: string | null
  action: string
  target_type?: string
  target_id?: string | null
  details?: Record<string, unknown>
}

export type AdminLogUpdate = Partial<AdminLogInsert>

export interface SiteSettingRow {
  key: string
  value: unknown
  updated_at: string
}

export interface SiteSettingInsert {
  key: string
  value: unknown
}

export type SiteSettingUpdate = Partial<SiteSettingInsert>
