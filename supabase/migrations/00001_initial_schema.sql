-- ─── 野造 · 数据库初始化迁移 ───
-- Version: 1.0.0
-- Description: Complete schema for Yezhao handcraft learning platform

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'banned');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE tutorial_category AS ENUM ('weaving', 'leather', 'woodwork', 'clay', 'embroidery', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE tutorial_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE tutorial_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE post_topic AS ENUM ('showcase', 'newbie', 'review', 'activity');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'like', 'comment', 'favorite', 'follow',
    'challenge_complete', 'badge_earned', 'system'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE challenge_status AS ENUM ('active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: profiles (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  nickname TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  phone TEXT,
  role user_role DEFAULT 'user',
  status user_status DEFAULT 'active',
  website TEXT,
  location TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Trigger
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: tutorials
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tutorials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_url TEXT,
  video_url TEXT,
  category tutorial_category NOT NULL DEFAULT 'other',
  difficulty tutorial_difficulty NOT NULL DEFAULT 'beginner',
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  favorites_count INTEGER DEFAULT 0,
  learners_count INTEGER DEFAULT 0,
  status tutorial_status DEFAULT 'draft',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutorials_slug ON public.tutorials(slug);
CREATE INDEX IF NOT EXISTS idx_tutorials_category ON public.tutorials(category);
CREATE INDEX IF NOT EXISTS idx_tutorials_difficulty ON public.tutorials(difficulty);
CREATE INDEX IF NOT EXISTS idx_tutorials_status ON public.tutorials(status);
CREATE INDEX IF NOT EXISTS idx_tutorials_author ON public.tutorials(author_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_created ON public.tutorials(created_at DESC);

CREATE TRIGGER set_updated_at_tutorials
  BEFORE UPDATE ON public.tutorials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: tutorial_steps
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tutorial_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutorial_id UUID NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutorial_steps_tutorial ON public.tutorial_steps(tutorial_id, "order");

-- ============================================================
-- TABLE: tutorial_materials
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tutorial_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutorial_id UUID NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount TEXT DEFAULT '',
  note TEXT DEFAULT '',
  purchase_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutorial_materials_tutorial ON public.tutorial_materials(tutorial_id);

-- ============================================================
-- TABLE: tutorial_notes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tutorial_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutorial_id UUID NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutorial_notes_tutorial ON public.tutorial_notes(tutorial_id);

-- ============================================================
-- TABLE: materials
-- ============================================================
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category tutorial_category NOT NULL DEFAULT 'other',
  image_url TEXT,
  description TEXT DEFAULT '',
  texture TEXT DEFAULT '',
  size_info TEXT DEFAULT '',
  scenarios TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_slug ON public.materials(slug);
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category);

CREATE TRIGGER set_updated_at_materials
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: material_comparisons
-- ============================================================
CREATE TABLE IF NOT EXISTS public.material_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  grade TEXT NOT NULL,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  price_range TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_material_comparisons_material ON public.material_comparisons(material_id);

-- ============================================================
-- TABLE: material_alternatives
-- ============================================================
CREATE TABLE IF NOT EXISTS public.material_alternatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_material_alternatives_material ON public.material_alternatives(material_id);

-- ============================================================
-- TABLE: material_purchase_links
-- ============================================================
CREATE TABLE IF NOT EXISTS public.material_purchase_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  platform TEXT DEFAULT '',
  price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_material_purchase_links_material ON public.material_purchase_links(material_id);

-- ============================================================
-- TABLE: material_buying_tips
-- ============================================================
CREATE TABLE IF NOT EXISTS public.material_buying_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  tip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_material_buying_tips_material ON public.material_buying_tips(material_id);

-- ============================================================
-- TABLE: material_faqs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.material_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_material_faqs_material ON public.material_faqs(material_id);

-- ============================================================
-- TABLE: posts (community)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  topic post_topic NOT NULL DEFAULT 'showcase',
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  status content_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_topic ON public.posts(topic);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes ON public.posts(likes_count DESC);

CREATE TRIGGER set_updated_at_posts
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: comments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  status content_status DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON public.comments(author_id);

CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: favorites
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('tutorial', 'material', 'post')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_item ON public.favorites(item_type, item_id);

-- ============================================================
-- TABLE: likes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_target ON public.likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);

-- ============================================================
-- TABLE: follows
-- ============================================================
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- ============================================================
-- TABLE: learning_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutorial_id UUID NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  completed_step_ids UUID[] DEFAULT '{}',
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_learned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tutorial_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON public.learning_progress(user_id);

-- ============================================================
-- TABLE: checkins
-- ============================================================
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_date DATE NOT NULL DEFAULT CURRENT_DATE,
  hours_spent NUMERIC(4,1) DEFAULT 0,
  tutorials_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, check_date)
);

CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON public.checkins(user_id, check_date DESC);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON public.checkins(check_date);

-- ============================================================
-- TABLE: badges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏅',
  description TEXT DEFAULT '',
  condition_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: user_badges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);

-- ============================================================
-- TABLE: challenges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  icon TEXT DEFAULT '🎯',
  description TEXT DEFAULT '',
  target_days INTEGER NOT NULL DEFAULT 21,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status challenge_status DEFAULT 'active',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_challenges
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: challenge_participants
-- ============================================================
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_days INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id);

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- ============================================================
-- TABLE: admin_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT DEFAULT '',
  target_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON public.admin_logs(created_at DESC);

-- ============================================================
-- TABLE: site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STORAGE BUCKETS (created via SQL)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('tutorials', 'tutorials', true, 104857600, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
  ('materials', 'materials', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('community', 'community', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS: ENABLE ON ALL TABLES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_purchase_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_buying_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS: PROFILES
-- ============================================================
-- Everyone can read profiles
CREATE POLICY "profiles_read_all" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin can update any profile
CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- ============================================================
-- RLS: TUTORIALS
-- ============================================================
-- Everyone can read published tutorials
CREATE POLICY "tutorials_read_published" ON public.tutorials
  FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

-- Authors can manage their own tutorials
CREATE POLICY "tutorials_manage_own" ON public.tutorials
  FOR ALL USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Admin can manage all tutorials
CREATE POLICY "tutorials_admin_manage" ON public.tutorials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- ============================================================
-- RLS: TUTORIAL STEPS / MATERIALS / NOTES
-- ============================================================
CREATE POLICY "tutorial_steps_read_all" ON public.tutorial_steps FOR SELECT USING (true);
CREATE POLICY "tutorial_steps_manage" ON public.tutorial_steps FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tutorials WHERE id = tutorial_id AND author_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "tutorial_materials_read_all" ON public.tutorial_materials FOR SELECT USING (true);
CREATE POLICY "tutorial_materials_manage" ON public.tutorial_materials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tutorials WHERE id = tutorial_id AND author_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "tutorial_notes_read_all" ON public.tutorial_notes FOR SELECT USING (true);
CREATE POLICY "tutorial_notes_manage" ON public.tutorial_notes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tutorials WHERE id = tutorial_id AND author_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================================
-- RLS: MATERIALS
-- ============================================================
-- Everyone can read materials
CREATE POLICY "materials_read_all" ON public.materials FOR SELECT USING (true);
CREATE POLICY "materials_manage_admin" ON public.materials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Material sub-tables: read all, manage admin
CREATE POLICY "material_sub_read_all" ON public.material_comparisons FOR SELECT USING (true);
CREATE POLICY "material_sub_manage_admin" ON public.material_comparisons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "material_alt_read_all" ON public.material_alternatives FOR SELECT USING (true);
CREATE POLICY "material_alt_manage_admin" ON public.material_alternatives FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "material_pl_read_all" ON public.material_purchase_links FOR SELECT USING (true);
CREATE POLICY "material_pl_manage_admin" ON public.material_purchase_links FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "material_bt_read_all" ON public.material_buying_tips FOR SELECT USING (true);
CREATE POLICY "material_bt_manage_admin" ON public.material_buying_tips FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "material_faq_read_all" ON public.material_faqs FOR SELECT USING (true);
CREATE POLICY "material_faq_manage_admin" ON public.material_faqs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================================
-- RLS: POSTS
-- ============================================================
-- Everyone can read approved posts
CREATE POLICY "posts_read_approved" ON public.posts
  FOR SELECT USING (status = 'approved' OR auth.uid() = author_id);

-- Users can create posts (goes to pending)
CREATE POLICY "posts_insert_own" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update/delete their own posts
CREATE POLICY "posts_update_own" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- Admin can manage all posts
CREATE POLICY "posts_admin_manage" ON public.posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- ============================================================
-- RLS: COMMENTS
-- ============================================================
CREATE POLICY "comments_read_all" ON public.comments FOR SELECT USING (true);

CREATE POLICY "comments_insert_auth" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "comments_update_own" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "comments_delete_own" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "comments_admin_manage" ON public.comments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- ============================================================
-- RLS: FAVORITES & LIKES & FOLLOWS
-- ============================================================
CREATE POLICY "favorites_manage_own" ON public.favorites
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_read_own" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "likes_manage_own" ON public.likes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_read_all" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "follows_read_all" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "follows_manage_own" ON public.follows
  FOR ALL USING (auth.uid() = follower_id)
  WITH CHECK (auth.uid() = follower_id);

-- ============================================================
-- RLS: LEARNING PROGRESS
-- ============================================================
CREATE POLICY "learning_read_own" ON public.learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "learning_manage_own" ON public.learning_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS: CHECKINS
-- ============================================================
CREATE POLICY "checkins_read_own" ON public.checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "checkins_manage_own" ON public.checkins
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard needs public read
CREATE POLICY "checkins_read_all" ON public.checkins
  FOR SELECT USING (true);

-- ============================================================
-- RLS: BADGES & USER BADGES
-- ============================================================
CREATE POLICY "badges_read_all" ON public.badges FOR SELECT USING (true);
CREATE POLICY "badges_manage_admin" ON public.badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "user_badges_read_all" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "user_badges_manage_admin" ON public.user_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================================
-- RLS: CHALLENGES
-- ============================================================
CREATE POLICY "challenges_read_all" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "challenges_manage_admin" ON public.challenges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "challenge_participants_read_all" ON public.challenge_participants FOR SELECT USING (true);
CREATE POLICY "challenge_participants_manage_own" ON public.challenge_participants
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS: NOTIFICATIONS
-- ============================================================
CREATE POLICY "notifications_read_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can insert notifications for anyone (via trigger or service_role)
CREATE POLICY "notifications_insert_system" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- RLS: ADMIN LOGS & SITE SETTINGS
-- ============================================================
CREATE POLICY "admin_logs_read_admin" ON public.admin_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "admin_logs_insert_admin" ON public.admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "site_settings_read_all" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_manage_admin" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================================
-- STORAGE RLS
-- ============================================================
-- Avatars: anyone can view, authenticated can upload own
CREATE POLICY "storage_avatars_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "storage_avatars_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "storage_avatars_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "storage_avatars_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Community: anyone can view, authenticated can manage own
CREATE POLICY "storage_community_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'community');

CREATE POLICY "storage_community_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'community' AND auth.role() = 'authenticated');

CREATE POLICY "storage_community_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'community' AND auth.uid() = owner);

-- Tutorials & Materials: anyone can view, only admin can insert
CREATE POLICY "storage_tutorials_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'tutorials');

CREATE POLICY "storage_tutorials_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tutorials' AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  ));

CREATE POLICY "storage_materials_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'materials');

CREATE POLICY "storage_materials_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'materials' AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  ));

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Update counters on like
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_like_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'post' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
  ELSIF NEW.target_type = 'comment' THEN
    UPDATE public.comments SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_like_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.target_type = 'post' THEN
    UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.target_id;
  ELSIF OLD.target_type = 'comment' THEN
    UPDATE public.comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.target_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_like_inserted ON public.likes;
CREATE TRIGGER on_like_inserted
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_insert();

DROP TRIGGER IF EXISTS on_like_deleted ON public.likes;
CREATE TRIGGER on_like_deleted
  AFTER DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_delete();

-- ============================================================
-- TRIGGER: Update comments_count on post
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_comment_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_inserted ON public.comments;
CREATE TRIGGER on_comment_inserted
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_change();

DROP TRIGGER IF EXISTS on_comment_deleted ON public.comments;
CREATE TRIGGER on_comment_deleted
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_change();

-- ============================================================
-- TRIGGER: Create notification on like
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_like_notification()
RETURNS TRIGGER AS $$
DECLARE
  target_owner_id UUID;
  target_title TEXT;
BEGIN
  IF NEW.target_type = 'post' THEN
    SELECT author_id, title INTO target_owner_id, target_title
    FROM public.posts WHERE id = NEW.target_id;
  ELSIF NEW.target_type = 'comment' THEN
    SELECT author_id, substring(content, 1, 50) INTO target_owner_id, target_title
    FROM public.comments WHERE id = NEW.target_id;
  END IF;

  IF target_owner_id IS NOT NULL AND target_owner_id <> NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, data, actor_id)
    VALUES (
      target_owner_id,
      'like',
      '有人赞了你',
      COALESCE(target_title, '你的内容'),
      jsonb_build_object('target_type', NEW.target_type, 'target_id', NEW.target_id),
      NEW.user_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_like_notification ON public.likes;
CREATE TRIGGER on_like_notification
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_notification();

-- ============================================================
-- TRIGGER: Create notification on comment
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_owner_id UUID;
  post_title TEXT;
BEGIN
  SELECT author_id, title INTO post_owner_id, post_title
  FROM public.posts WHERE id = NEW.post_id;

  IF post_owner_id IS NOT NULL AND post_owner_id <> NEW.author_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, data, actor_id)
    VALUES (
      post_owner_id,
      'comment',
      '有人评论了你的作品',
      substring(NEW.content, 1, 100),
      jsonb_build_object('post_id', NEW.post_id, 'comment_id', NEW.id),
      NEW.author_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_notification ON public.comments;
CREATE TRIGGER on_comment_notification
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_notification();

-- ============================================================
-- FUNCTION: Get user stats
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_stats(user_id UUID)
RETURNS JSONB AS $$
DECLARE
  works_count INTEGER;
  favorites_count INTEGER;
  followers_count INTEGER;
  following_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO works_count FROM public.posts WHERE author_id = user_id AND status = 'approved';
  SELECT COUNT(*) INTO favorites_count FROM public.favorites WHERE user_id = user_id;
  SELECT COUNT(*) INTO followers_count FROM public.follows WHERE following_id = user_id;
  SELECT COUNT(*) INTO following_count FROM public.follows WHERE follower_id = user_id;

  RETURN jsonb_build_object(
    'works_count', works_count,
    'favorites_count', favorites_count,
    'followers_count', followers_count,
    'following_count', following_count
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- SEED: Default badges
-- ============================================================
INSERT INTO public.badges (name, icon, description, condition_json) VALUES
  ('初来乍到', '🌱', '完成第一次打卡', '{"type": "checkins", "count": 1}'),
  ('连续7天', '🔥', '连续打卡7天', '{"type": "streak", "days": 7}'),
  ('连续30天', '💎', '连续打卡30天', '{"type": "streak", "days": 30}'),
  ('手工新手', '✋', '完成第一个教程', '{"type": "tutorials_completed", "count": 1}'),
  ('手工达人', '🎨', '完成10个教程', '{"type": "tutorials_completed", "count": 10}'),
  ('社交达人', '💬', '发布10篇帖子', '{"type": "posts", "count": 10}'),
  ('收藏家', '⭐', '收藏50个内容', '{"type": "favorites", "count": 50}'),
  ('挑战者', '🏆', '完成一次挑战', '{"type": "challenges_completed", "count": 1}')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: Default site settings
-- ============================================================
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', '"野造"'),
  ('site_description', '"指尖造物，心生温暖"'),
  ('allow_registration', 'true'),
  ('maintenance_mode', 'false'),
  ('featured_tutorials_count', '6'),
  ('max_upload_size_mb', '50')
ON CONFLICT (key) DO NOTHING;
