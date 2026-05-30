# 野造 · 系统架构文档

## 总体架构

```
┌──────────────────────────────────────────────────────┐
│                     Client Layer                      │
│  ┌──────────────────────────────────────────────────┐│
│  │  Next.js App Router (React 19 + TypeScript)      ││
│  │  ┌────────┐ ┌────────┐ ┌─────────┐ ┌─────────┐  ││
│  │  │ Server │ │ Client │ │  Auth   │ │ Dynamic │  ││
│  │  │ Comps  │ │ Comps  │ │  Pages  │ │ Imports │  ││
│  │  └────────┘ └────────┘ └─────────┘ └─────────┘  ││
│  └──────────────────────────────────────────────────┘│
│                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐  │
│  │ Zustand  │ │  React   │ │  Framer Motion       │  │
│  │  Stores  │ │  Query   │ │  + CSS Modules       │  │
│  └──────────┘ └──────────┘ └──────────────────────┘  │
├──────────────────────────────────────────────────────┤
│                   Service Layer                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐  │
│  │  Auth    │ │ Profile  │ │ Tutorial / Material  │  │
│  │  Service │ │ Service  │ │ / Community / Notif  │  │
│  └────┬─────┘ └────┬─────┘ └──────────┬───────────┘  │
├───────┴─────────────┴─────────────────┴──────────────┤
│               Supabase Client Layer                    │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  Browser Client  │  │  Server Client (SSR)     │  │
│  └────────┬─────────┘  └────────────┬─────────────┘  │
├───────────┴──────────────────────────┴───────────────┤
│                 Proxy (Middleware)                     │
│  Session Refresh · Route Guard · RBAC                │
├──────────────────────────────────────────────────────┤
│              Supabase Backend (Cloud)                  │
│  ┌────────┐ ┌────────┐ ┌─────────┐ ┌────────────┐   │
│  │  Auth  │ │   DB   │ │ Storage │ │  Realtime  │   │
│  │(GoTrue)│ │  (PG)  │ │  (S3)   │ │    (WS)    │   │
│  └────────┘ └────────┘ └─────────┘ └────────────┘   │
├──────────────────────────────────────────────────────┤
│                  DevOps Layer                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐  │
│  │  Vercel  │ │  GitHub  │ │  Monitoring          │  │
│  │  (Host)  │ │  Actions │ │  Sentry + GA4 + PH   │  │
│  └──────────┘ └──────────┘ └──────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## 设计系统

### 色彩
- **Clay**: #8B5E3C（陶土棕）— 品牌主色
- **Warm**: #D4A76A（温暖金）— 强调色
- **Sage**: #8B9E7C（鼠尾草绿）— 辅助色
- **Cream**: #FEF8F2（奶油白）— 背景色
- 全部使用 OKLCH 色彩空间

### 字体
- **Noto Serif SC** — 标题（衬线，温暖人文感）
- **Noto Sans SC** — 正文（无衬线，清晰易读）
- **Geist Mono** — 代码

### 组件
- 基于 shadcn/ui (Base UI 变体)
- 21 个基础 UI 组件
- 15+ 个共享业务组件
- 7 个首页 Section 组件

## 路由架构

| Route Group | Pages | Auth Required |
|-------------|-------|---------------|
| (front)/ | 首页 · 教程 · 材料 · 社区 · 搜索 | No |
| auth/ | 登录 · 注册 · 密码重置 · 回调 | No (redirect if authed) |
| me/ | 个人中心 · 收藏 · 学习 · 作品 · 挑战 · 设置 | Yes |
| community/create | 发布作品 | Yes |
| admin/ | 看板 · 教程 · 材料 · 社区 · 用户 · 设置 | Admin only |

## 数据流

```
User Action → Client Component → Service Layer → Supabase Client
                                                   ↓
                                            Supabase Backend
                                            (Auth → RLS → DB)
                                                   ↓
                                            Response → Service
                                                   ↓
Client Update ← Zustand Store ← React Query Cache ←─┘
```

## 状态管理策略

| 状态类型 | 工具 |
|----------|------|
| 认证状态 | Zustand (auth-store) |
| UI 状态 | Zustand (ui-store) |
| 服务端数据 | React Query (cache + sync) |
| 表单状态 | React Hook Form (local) |
| 动画状态 | Framer Motion (local) |
| URL 状态 | Next.js Router (searchParams) |

## 渲染策略

| 路由类型 | 策略 | 示例 |
|----------|------|------|
| 首页 | SSG (Static) | `/` |
| 列表页 | SSG (ISR) | `/tutorials` |
| 详情页 | SSG (generateStaticParams) | `/tutorials/[slug]` |
| 搜索 | SSR (Dynamic) | `/search?q=xxx` |
| 用户页 | CSR (Client) | `/me/settings` |
| 管理页 | CSR (Client) | `/admin/dashboard` |
| API | Server (Route Handlers) | `/api/*` |
