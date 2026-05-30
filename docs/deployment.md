# 野造 · 部署文档

## 部署架构

```
GitHub → GitHub Actions → Vercel (Prod + Preview)
                ↓
         Supabase (DB + Auth + Storage)
```

## 环境变量

### 生产环境 (.env.production)

在 Vercel Dashboard 中设置以下环境变量：

```bash
# 必需
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...<anon-key>
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...<service-role-key>
NEXT_PUBLIC_SITE_URL=https://yezao.art

# Analytics (可选)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxx...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_CLARITY_ID=xxxxx

# Google Search Console
NEXT_PUBLIC_GOOGLE_VERIFICATION=xxxxx

# Email (可选)
RESEND_API_KEY=re_xxxx...
RESEND_FROM_EMAIL=hello@yezao.art

# Monitoring (可选)
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
```

### GitHub Secrets

在 GitHub Repo Settings → Secrets and variables → Actions 中设置：

```bash
# Vercel
VERCEL_TOKEN=<vercel-api-token>
VERCEL_ORG_ID=<vercel-org-id>
VERCEL_PROJECT_ID=<vercel-project-id>

# Supabase (for CI migrations)
SUPABASE_ACCESS_TOKEN=<supabase-access-token>
SUPABASE_DB_PASSWORD=<db-password>
SUPABASE_PROJECT_ID=<project-ref>

# Build-time env
NEXT_PUBLIC_SUPABASE_URL=<same-as-above>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same-as-above>
NEXT_PUBLIC_SITE_URL=https://yezao.art
NEXT_PUBLIC_GA4_ID=<ga4-id>
NEXT_PUBLIC_POSTHOG_KEY=<posthog-key>
```

## 部署步骤

### 第一步：Vercel 项目设置

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库 `yezao/yezhao`
4. 框架预设：Next.js
5. 设置环境变量（见上方列表）
6. 点击 "Deploy"

### 第二步：域名配置

1. Vercel Dashboard → Settings → Domains
2. 添加 `yezao.art`
3. 添加 `www.yezao.art` → 重定向到 `yezao.art`
4. DNS 配置（在域名注册商处）：
   ```
   类型   名称    值
   A      @       76.76.21.21
   CNAME  www     cname.vercel-dns.com
   ```

### 第三步：Supabase 生产设置

1. 创建 Supabase 项目（生产环境）
2. 运行迁移：
   ```bash
   supabase link --project-ref <project-ref>
   supabase db push
   ```
3. 配置 Auth Providers（Google, GitHub）
4. 创建 Storage Buckets（avatars, tutorials, materials, community）
5. 验证 RLS 策略

### 第四步：Analytics 设置

1. **GA4**: 创建数据流 → 获取 Measurement ID → 设置环境变量
2. **Google Search Console**: 添加属性 → DNS 验证 → 提交 sitemap
3. **PostHog**: 创建项目 → 获取 API Key → 设置环境变量
4. **Clarity**: 创建项目 → 获取 ID → 设置环境变量

### 第五步：监控设置

1. **Sentry**: 创建 Next.js 项目 → 获取 DSN → 设置环境变量
2. **邮件**: Resend → 验证域名 → 获取 API Key
3. **状态页**: 可选，使用 Vercel Analytics + Sentry 即可

### 第六步：CI/CD 验证

1. Push 到 `main` 分支
2. 观察 GitHub Actions 运行
3. 确认 Vercel 部署成功
4. 访问生产 URL 验证功能

## DNS 记录参考

| 记录 | 类型 | 名称 | 值 |
|------|------|------|-----|
| Apex | A | @ | 76.76.21.21 |
| www | CNAME | www | cname.vercel-dns.com |

## 回滚步骤

1. Vercel Dashboard → Deployments
2. 找到上一个稳定版本
3. 点击 "..." → "Promote to Production"
4. 同时回滚 Supabase 迁移（如有 schema 变更）：
   ```bash
   supabase db reset --version <previous-version>
   ```

## 备份策略

- **数据库**: Supabase 自动每日备份（Pro 计划 7 天保留，Enterprise 30 天）
- **代码**: GitHub 完整历史
- **媒体文件**: Supabase Storage 自动备份
- **手动备份**: `supabase db dump -f backup.sql`

## 常见问题

**Q: 部署后看到 "Missing Supabase environment variables"**
A: 确认 Vercel 环境变量中包含 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Q: OAuth 登录失败**
A: 确认 Supabase Dashboard → Authentication → Providers 中已配置 Google/GitHub OAuth，且回调 URL 包含生产域名

**Q: 图片不显示**
A: 确认 Supabase Storage Buckets 已创建且为 public，CDN 缓存可能需要几分钟生效
