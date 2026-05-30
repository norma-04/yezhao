# 野造 · 上线检查清单

## 🔐 安全

- [ ] RLS 策略全部启用并验证
- [ ] 管理员路由受 Proxy 保护
- [ ] API 端点权限校验正常
- [ ] Service Role Key 仅服务端使用
- [ ] CSP Headers 已配置
- [ ] XSS 防护（React + Zod）
- [ ] CSRF 防护（Supabase SSR）
- [ ] Rate Limiting（Vercel WAF）
- [ ] Storage Bucket 权限正确
- [ ] 密码强度要求 ≥ 6位 + 字母数字组合

## 🚀 性能

- [ ] Lighthouse Performance ≥ 95
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] TTFB < 800ms
- [ ] 图片使用 next/image + AVIF/WebP
- [ ] Bundle Size 合理（无意外大包）
- [ ] CSS 关键路径已优化
- [ ] ISR/SSG 策略正确

## 🔍 SEO

- [ ] 全站 Metadata API 正确
- [ ] Open Graph / Twitter Cards 测试通过
- [ ] Canonical URLs 正确
- [ ] sitemap.xml 可访问
- [ ] robots.txt 正确配置
- [ ] Schema.org 结构化数据验证通过
- [ ] Google Search Console 已提交 sitemap
- [ ] 核心页面标题 + 描述有针对性
- [ ] 无 noindex 页面（除 admin/auth）

## 📡 功能

- [ ] 首页正常加载
- [ ] 教程列表 + 详情正常
- [ ] 材料列表 + 详情正常
- [ ] 社区列表 + 详情正常
- [ ] 搜索功能正常
- [ ] 登录 + 注册 + OAuth 正常
- [ ] 密码重置流程正常
- [ ] 用户中心各页面正常
- [ ] 后台管理全部功能正常
- [ ] 响应式：Mobile / Tablet / Desktop

## 📊 监控 & 分析

- [ ] GA4 数据流入正常
- [ ] PostHog 事件捕获正常
- [ ] Clarity 录屏正常
- [ ] Sentry 错误上报正常
- [ ] Web Vitals 数据上报
- [ ] 邮件发送正常

## 🌐 基础设施

- [ ] 域名 DNS 配置正确
- [ ] HTTPS/SSL 证书有效
- [ ] www → apex 重定向生效
- [ ] Supabase 生产项目运行中
- [ ] Vercel 自动部署正常
- [ ] CI/CD Pipeline 通过
- [ ] 每日自动备份启用
- [ ] 环境变量全部设置并验证

## 📋 内容

- [ ] 教程数据质量检查
- [ ] 材料数据准确性
- [ ] 占位图片替换为真实图片
- [ ] 文案无错别字
- [ ] 404 页面友好
- [ ] Footer 链接正确
- [ ] 隐私政策 + 服务条款页面

## 🧪 测试

- [ ] 跨浏览器测试（Chrome, Safari, Firefox, Edge）
- [ ] 移动端 iOS Safari + Android Chrome
- [ ] 登录 → 收藏 → 评论 流程
- [ ] 注册 → 验证 → 完善资料 流程
- [ ] 管理审核流程
- [ ] 文件上传正常
- [ ] 通知实时推送

---

## 上线步骤

1. 确认所有复选框 ✅
2. 合并 `main` 分支
3. 等待 CI 通过 + Vercel 部署完成
4. DNS 切换到生产域名
5. Google Search Console 提交 sitemap
6. GA4 实时报告确认流量
7. Sentry 确认无异常错误
8. 宣告上线 🎉
