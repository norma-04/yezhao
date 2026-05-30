# 野造 · 数据库文档

## ER 图 (核心关系)

```
auth.users ──1:1── profiles ──1:N── tutorials
                    │                    │
                    │                    ├──1:N── tutorial_steps
                    │                    ├──1:N── tutorial_materials
                    │                    └──1:N── tutorial_notes
                    │
                    ├──1:N── posts ──1:N── comments
                    │
                    ├──1:N── favorites
                    ├──1:N── likes
                    ├──1:N── follows
                    ├──1:N── learning_progress
                    ├──1:N── checkins
                    ├──1:N── notifications
                    ├──1:N── challenge_participants
                    └──1:N── admin_logs

materials ──1:N── material_comparisons
          ├──1:N── material_alternatives
          ├──1:N── material_purchase_links
          ├──1:N── material_buying_tips
          └──1:N── material_faqs

badges ──1:N── user_badges ──N:1── profiles
challenges ──1:N── challenge_participants ──N:1── profiles
```

## 完整表结构

### profiles
用户资料表（extends Supabase auth.users）

| 列 | 类型 | 说明 |
|----|------|------|
| id | UUID PK | 关联 auth.users.id |
| email | TEXT UNIQUE | 邮箱 |
| username | TEXT UNIQUE | 用户名（可选） |
| nickname | TEXT | 昵称 |
| avatar_url | TEXT | 头像 URL |
| bio | TEXT | 个人简介 |
| phone | TEXT | 手机号 |
| role | user_role | user / admin / super_admin |
| status | user_status | active / banned |
| website | TEXT | 个人网站 |
| location | TEXT | 所在地 |
| social_links | JSONB | 社交媒体链接 |
| preferences | JSONB | 用户偏好设置 |
| created_at | TIMESTAMPTZ | 注册时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### tutorials
教程主表

| 列 | 类型 | 说明 |
|----|------|------|
| id | UUID PK | |
| title | TEXT | 教程标题 |
| slug | TEXT UNIQUE | URL 友好标识 |
| cover_url | TEXT | 封面图 |
| video_url | TEXT | 视频 URL |
| category | tutorial_category | 品类枚举 |
| difficulty | tutorial_difficulty | 难度级别 |
| duration_minutes | INTEGER | 预计耗时（分钟） |
| description | TEXT | 简介 |
| author_id | UUID FK → profiles | 作者 |
| favorites_count | INTEGER | 收藏数 |
| learners_count | INTEGER | 学习人数 |
| status | tutorial_status | draft/published/archived |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### tutorial_steps
教程步骤表

| 列 | 类型 | 说明 |
|----|------|------|
| id | UUID PK | |
| tutorial_id | UUID FK | 关联教程 |
| order | INTEGER | 步骤序号 |
| title | TEXT | 步骤标题 |
| description | TEXT | 步骤说明 |
| image_url | TEXT | 步骤配图 |

### posts
社区帖子表

| 列 | 类型 | 说明 |
|----|------|------|
| id | UUID PK | |
| title | TEXT | 帖子标题 |
| slug | TEXT UNIQUE | URL 标识 |
| content | TEXT | 帖子内容 |
| images | TEXT[] | 图片列表 |
| video_url | TEXT | 视频 |
| topic | post_topic | 话题分类 |
| tags | TEXT[] | 标签 |
| author_id | UUID FK → profiles | 作者 |
| likes_count | INTEGER | 点赞数 |
| comments_count | INTEGER | 评论数 |
| favorites_count | INTEGER | 收藏数 |
| status | content_status | pending/approved/rejected |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### notifications
通知表

| 列 | 类型 | 说明 |
|----|------|------|
| id | UUID PK | |
| user_id | UUID FK | 通知接收者 |
| type | notification_type | 通知类型枚举 |
| title | TEXT | 通知标题 |
| message | TEXT | 通知内容 |
| data | JSONB | 关联数据 |
| is_read | BOOLEAN | 是否已读 |
| actor_id | UUID FK → profiles | 触发者 |
| created_at | TIMESTAMPTZ | |

## 枚举类型

| 枚举 | 值 |
|------|-----|
| user_role | user, admin, super_admin |
| user_status | active, banned |
| tutorial_category | weaving, leather, woodwork, clay, embroidery, other |
| tutorial_difficulty | beginner, intermediate, advanced |
| tutorial_status | draft, published, archived |
| post_topic | showcase, newbie, review, activity |
| content_status | pending, approved, rejected |
| notification_type | like, comment, favorite, follow, challenge_complete, badge_earned, system |
| challenge_status | active, completed, cancelled |

## 触发器

| 触发器 | 说明 |
|--------|------|
| on_auth_user_created | 注册时自动创建 profile |
| on_like_inserted | 点赞时更新目标计数器 |
| on_like_deleted | 取消点赞时更新计数器 |
| on_comment_inserted | 评论时更新帖子评论数 |
| on_comment_deleted | 删除评论时更新计数 |
| on_like_notification | 点赞时创建通知 |
| on_comment_notification | 评论时创建通知 |

## 索引策略

所有外键列均创建了索引。高频查询列（slug, status, created_at, category）均有独立索引。通知表有针对未读查询的部分索引。
