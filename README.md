# 野造 · Yezhao

> 指尖造物，心生温暖 — 手作DIY学习与分享平台

## 🌿 关于

野造是一个专注于手作DIY的全程式平台：**学教程**、**选材料**、**晒作品**。

面向手工爱好者，覆盖编织、皮具、木工、黏土、刺绣五大品类。所有数据存储在 Supabase，管理员可在后台直接管理内容。

### 三个核心板块

| 板块 | 路由 | 说明 |
|------|------|------|
| 📖 学教程 | `/tutorials` | 分步教学、进度追踪、视频链接 |
| 🧵 选材料 | `/materials` | 材料百科、选购指南、对比推荐 |
| 🎨 社区 | `/community` | 作品展示、话题讨论、挑战活动 |

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + Turbopack) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 + shadcn/ui (Base UI) |
| 动画 | Framer Motion |
| 状态 | Zustand + React Query |
| 后端 | Supabase — Auth, Database (25表), Storage, Realtime, RLS |
| 表单 | React Hook Form + Zod |
| 图表 | Recharts |
| 邮件 | Resend |
| 分析 | GA4 + PostHog + Microsoft Clarity |
| 部署 | Netlify (主) / Vercel (备) |
| CI/CD | GitHub Actions |

## 📁 项目结构

```
yezhao/
├── src/
│   ├── app/
│   │   ├── (front)/           # 前台：首页、教程、材料、社区、用户中心
│   │   ├── admin/             # 后台管理：仪表盘、教程/材料/社区/用户管理
│   │   ├── auth/              # 认证：登录、注册、找回密码、OAuth回调
│   │   └── api/               # 30+ API 路由
│   ├── components/
│   │   ├── ui/                # shadcn/ui 基础组件 (~20)
│   │   ├── shared/            # 业务组件：卡片、筛选器、上传、通知
│   │   ├── layout/            # 布局：Header、Footer、Sidebar
│   │   └── home/              # 首页区块组件
│   ├── lib/
│   │   ├── supabase/          # 客户端 + 服务端 + 6个Service模块
│   │   ├── analytics/         # GA4 / PostHog / Clarity / Web Vitals
│   │   ├── seo/               # Metadata构建器 + Schema.org组件
│   │   ├── email/             # Resend邮件模板
│   │   ├── stores/            # Zustand: auth、ui、tutorial、community
│   │   └── types/             # 共享类型定义
│   └── data/                  # 旧mock数据（已切换Supabase，保留用于类型参考）
├── supabase/
│   └── migrations/            # 数据库迁移SQL（25张表 + RLS + 触发器）
├── scripts/                   # 本地工具脚本
├── docs/                      # 架构、部署、数据库、API文档
├── .github/workflows/         # CI / Deploy / Preview
└── public/                    # 静态资源
```

## 🚀 本地开发

### 前置条件

- Node.js 20+、npm 10+
- Supabase 账号（免费）

### 步骤

```bash
# 1. 克隆
git clone https://github.com/norma-04/yezhao.git
cd yezhao

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 密钥：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=野造
```

```bash
# 4. 初始化数据库（在 Supabase SQL Editor 中执行）
# 复制 supabase/migrations/00001_initial_schema.sql 全部内容并运行

# 5. 导入种子数据（可选）
node scripts/seed-db.mjs

# 6. 启动
npm run dev
# → http://localhost:3000
```

## 📊 数据库

25 张 PostgreSQL 表，全部启用 RLS 行级安全策略。

### 核心业务表

| 表 | 说明 |
|----|------|
| `profiles` | 用户资料（注册自动创建） |
| `tutorials` | 教程（支持 video_url / cover_url） |
| `tutorial_steps` | 教程步骤 |
| `tutorial_materials` | 教程所需材料 |
| `materials` | 材料百科 |
| `material_comparisons` | 材料对比信息 |
| `material_purchase_links` | 购买链接 |
| `material_buying_tips` | 选购贴士 |
| `material_faqs` | 材料常见问题 |
| `posts` | 社区帖子 |
| `comments` | 评论 |
| `favorites` | 收藏 |
| `likes` | 点赞 |
| `follows` | 关注 |
| `learning_progress` | 学习进度 |
| `checkins` | 每日打卡 |
| `badges` | 徽章定义 |
| `user_badges` | 用户徽章 |
| `challenges` | 挑战 |
| `notifications` | 通知 |
| `site_settings` | 站点配置 |

详见 [docs/database.md](docs/database.md)

## 🔐 认证

- 邮箱密码注册/登录
- Google OAuth / GitHub OAuth
- 邮箱验证、密码重置
- 角色系统：user / admin / super_admin
- 路由保护（proxy.ts）

## 🚢 部署

### Netlify（推荐，国内可访问）

1. 连接 GitHub 仓库
2. 设置环境变量（同 `.env.local`，`NEXT_PUBLIC_SITE_URL` 填 Netlify 域名）
3. 自动部署

### Vercel（需VPN）

```bash
vercel --prod
```

详见 [docs/deployment.md](docs/deployment.md)

## ⚠️ 上线检查清单

- [ ] Supabase 数据库迁移完成
- [ ] Storage Buckets 已创建（avatars, tutorials, materials, community）
- [ ] 环境变量全部设置
- [ ] OAuth Provider 已配置（Google, GitHub）
- [ ] 自定义域名 + SSL
- [ ] sitemap.xml 已提交搜索引擎
- [ ] GA4 / PostHog 分析代码已配置

## 📄 许可证

MIT © 2025 野造

---

**指尖造物，心生温暖。**
