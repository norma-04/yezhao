# 野造 · Yezhao

> 指尖造物，心生温暖 — 手作DIY学习与分享平台

[![CI](https://github.com/yezao/yezhao/actions/workflows/ci.yml/badge.svg)](https://github.com/yezao/yezhao/actions/workflows/ci.yml)

## 🌿 关于野造

野造是一个专注于手作DIY学习、材料指导与作品分享的专业化平台，面向18-60岁的手工爱好者。

**核心价值：**
- 📖 **学得会** — 从零基础到精通的系统化教程体系
- 🧵 **选得对** — 专业的材料知识库与选购指南
- 🎨 **晒得出** — Pinterest × 小红书风格的作品社区

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 + shadcn/ui (Base UI) |
| 动画 | Framer Motion |
| 状态管理 | Zustand + React Query |
| 后端 | Supabase (Auth, DB, Storage, Realtime) |
| 图表 | Recharts |
| 表单 | React Hook Form + Zod |
| 部署 | Vercel |
| 监控 | Sentry + PostHog + GA4 + Clarity |
| CI/CD | GitHub Actions |

## 📁 项目结构

```
yezhao/
├── src/
│   ├── app/                    # Next.js App Router (80 routes)
│   │   ├── (front)/           # 前台页面
│   │   ├── admin/             # 后台管理
│   │   ├── auth/              # 认证系统
│   │   └── api/               # API Routes (30 endpoints)
│   ├── components/            # UI 组件 (~45 components)
│   ├── lib/                   # 核心库
│   │   ├── supabase/          # DB Client + 6 Services
│   │   ├── analytics/         # GA4/PostHog/Clarity
│   │   ├── seo/               # Metadata/Schema.org
│   │   ├── email/             # Resend Email
│   │   ├── monitoring/        # Sentry/Logger
│   │   └── stores/            # Zustand Stores
│   ├── data/                  # Mock Data
│   └── styles/                # Design System
├── supabase/
│   ├── migrations/            # Database Migrations
│   └── seed.sql               # Seed Data
├── docs/                      # Documentation
├── .github/workflows/         # CI/CD
└── public/                    # Static Assets
```

## 🚀 快速开始

### 前置条件
- Node.js 20+, npm 10+
- Supabase 项目（[免费创建](https://supabase.com)）

### 安装

```bash
git clone https://github.com/yezao/yezhao.git
cd yezhao
npm install
cp .env.local.example .env.local   # 编辑并填入你的密钥
npm run dev                         # http://localhost:3000
```

## 🔐 认证系统

- 邮箱/密码登录 + 注册 + 密码重置
- Google OAuth · GitHub OAuth
- 邮箱验证 · 会话管理 · 角色权限

## 📊 数据库 (25 tables)

核心表：`profiles` · `tutorials` · `materials` · `posts` · `comments` · `favorites` · `likes` · `learning_progress` · `checkins` · `badges` · `challenges` · `notifications` · `admin_logs`

所有表已启用 RLS 策略。详见 [docs/database.md](docs/database.md)

## 📡 API (30 endpoints)

前台 23 endpoints + 后台 7 endpoints。详见 [docs/api.md](docs/api.md)

## 🚢 部署

详见 [docs/deployment.md](docs/deployment.md)

```bash
npm run build     # 构建
vercel --prod     # 部署到 Vercel
```

## ✅ 上线检查清单

- [ ] Supabase 迁移 + Storage Buckets
- [ ] Auth Providers (Google, GitHub)
- [ ] 环境变量全部设置
- [ ] GA4 · PostHog · Sentry 配置
- [ ] Google Search Console 验证
- [ ] 自定义域名 + SSL
- [ ] sitemap.xml 提交
- [ ] Lighthouse ≥ 95

## 📄 许可证

MIT © 2024 野造

---

**指尖造物，心生温暖。**
