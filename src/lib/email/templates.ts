// ─── 野造 · Email Templates Registry ───
// Centralized template management for transactional emails

export const EMAIL_TEMPLATES = {
  welcome: {
    id: 'welcome',
    subject: '欢迎加入野造 🌿',
    description: '新用户注册欢迎邮件',
    variables: ['nickname', 'email'],
  },
  verification: {
    id: 'verification',
    subject: '验证你的野造邮箱',
    description: '邮箱验证邮件',
    variables: ['token', 'email'],
  },
  password_reset: {
    id: 'password_reset',
    subject: '重置你的野造密码',
    description: '密码重置确认邮件',
    variables: ['email'],
  },
  password_changed: {
    id: 'password_changed',
    subject: '你的野造密码已重置',
    description: '密码修改成功通知',
    variables: ['email'],
  },
  notification_comment: {
    id: 'notification_comment',
    subject: '有人评论了你的作品 💬',
    description: '评论通知邮件',
    variables: ['nickname', 'post_title', 'comment_preview', 'post_url'],
  },
  notification_like: {
    id: 'notification_like',
    subject: '有人赞了你的内容 ❤️',
    description: '点赞通知邮件',
    variables: ['nickname', 'content_preview', 'content_url'],
  },
  notification_follow: {
    id: 'notification_follow',
    subject: '有新的关注者 👋',
    description: '关注通知邮件',
    variables: ['follower_nickname', 'follower_url'],
  },
  weekly_digest: {
    id: 'weekly_digest',
    subject: '野造周报 · 本周手作灵感',
    description: '每周精选内容汇总',
    variables: ['nickname', 'top_tutorials', 'top_posts', 'challenge_progress'],
  },
} as const

export type EmailTemplateId = keyof typeof EMAIL_TEMPLATES
