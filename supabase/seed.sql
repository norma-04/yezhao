-- ─── 野造 · 种子数据 ───
-- Sample data for development and testing
-- Run: supabase db seed (or psql -f seed.sql)

-- ============================================================
-- Sample Profiles (password: "password123" for all test users)
-- Note: Create via Supabase Auth API or dashboard, then this
--       seed updates profiles with additional data.
-- ============================================================

-- Update profiles for users created via Auth (run after creating auth users)
-- INSERT INTO public.profiles (id, email, nickname, bio, role, avatar_url) VALUES
-- ...

-- ============================================================
-- Sample Tutorials
-- ============================================================
INSERT INTO public.tutorials (id, title, slug, cover_url, category, difficulty, duration_minutes, description, author_id, status, learners_count, favorites_count) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Macrame 编织挂毯入门', 'macrame-wall-hanging', '/images/tutorials/macrame.jpg', 'weaving', 'beginner', 45, '从零开始学习 Macrame 编织技艺，制作一幅美丽的波西米亚风格挂毯。适合完全零基础的新手。', NULL, 'published', 2341, 567),
  ('a0000000-0000-0000-0000-000000000002', '手工皮革卡包制作', 'leather-card-holder', '/images/tutorials/leather.jpg', 'leather', 'intermediate', 120, '学习基础皮革工艺，亲手制作一个可以陪伴多年的植鞣革卡包。包含裁皮、打孔、缝线全部流程。', NULL, 'published', 1856, 423),
  ('a0000000-0000-0000-0000-000000000003', '木勺雕刻入门', 'wooden-spoon-carving', '/images/tutorials/woodwork.jpg', 'woodwork', 'beginner', 90, '用一把 carving knife 完成你的第一把木勺。学习基础刀法和木材选择。', NULL, 'published', 1623, 389),
  ('a0000000-0000-0000-0000-000000000004', '石塑黏土首饰盘', 'clay-jewelry-tray', '/images/tutorials/clay.jpg', 'clay', 'beginner', 60, '用石塑黏土制作一个独一无二的几何首饰盘，包含塑形、打磨、上色完整教程。', NULL, 'published', 2100, 498),
  ('a0000000-0000-0000-0000-000000000005', '法式刺绣胸针', 'french-embroidery-brooch', '/images/tutorials/embroidery.jpg', 'embroidery', 'advanced', 180, '学习法式刺绣的高级技法——反面钩针绣和立体珠绣，完成一枚精致的花卉胸针。', NULL, 'published', 890, 321)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Sample Tutorial Steps (for Macrame tutorial)
-- ============================================================
INSERT INTO public.tutorial_steps (tutorial_id, "order", title, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 1, '准备材料', '准备好棉绳、木棍、剪刀、卷尺等工具。推荐使用 4mm 三股棉绳。'),
  ('a0000000-0000-0000-0000-000000000001', 2, '固定木棍', '用雀头结将棉绳固定在木棍上。每根绳子对折后挂在木棍上。'),
  ('a0000000-0000-0000-0000-000000000001', 3, '编织主体', '使用平结和斜卷结编织主体图案。保持每个结的力度均匀。'),
  ('a0000000-0000-0000-0000-000000000001', 4, '修剪流苏', '挂毯底部留出流苏长度，修剪整齐。可以梳开棉绳做出蓬松效果。'),
  ('a0000000-0000-0000-0000-000000000001', 5, '成品展示与保养', '挂毯完成！日常用软毛刷清理灰尘，避免暴晒。')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Sample Materials (Knowledge Base)
-- ============================================================
INSERT INTO public.materials (id, name, slug, category, image_url, description, texture, size_info, scenarios) VALUES
  ('b0000000-0000-0000-0000-000000000001', '棉绳', 'cotton-rope', 'weaving', '/images/materials/cotton-rope.jpg', 'Macrame 编织的主要材料，通常使用三股或单股棉绳。质地柔软，打结后线条清晰，适合制作挂毯、花盆吊篮等。', '柔软、有弹性、易打结', '常用规格：3mm / 4mm / 5mm 直径', ARRAY['挂毯', '吊篮', '杯垫', '包包']),
  ('b0000000-0000-0000-0000-000000000002', '植鞣革', 'vegetable-tanned-leather', 'leather', '/images/materials/veg-tan.jpg', '采用植物鞣剂鞣制的天然皮革，具有独特的皮香和使用变色效果。随着使用时间推移会形成独特包浆。', '坚实、挺括、可塑性好', '常用厚度：1.0mm / 1.5mm / 2.0mm', ARRAY['皮包', '卡包', '钱包', '皮带']),
  ('b0000000-0000-0000-0000-000000000003', '椴木块', 'basswood-block', 'woodwork', '/images/materials/basswood.jpg', '椴木质地细腻均匀，软硬适中，是木雕和木勺入门的最佳选择。纹理直且少节疤。', '细腻、均匀、易切削', '常用尺寸：5×5×20cm / 10×10×5cm', ARRAY['木勺', '木雕', '小摆件'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- Sample Badges (additional)
-- ============================================================
INSERT INTO public.badges (name, icon, description, condition_json) VALUES
  ('手作之星', '🌟', '累计学习100小时', '{"type": "hours", "total": 100}'),
  ('人气王', '👑', '获得100个赞', '{"type": "likes_received", "count": 100}')
ON CONFLICT DO NOTHING;
