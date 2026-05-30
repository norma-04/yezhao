// ─── 野造 · Email Service (Resend) ───
// Transactional email: welcome, verification, notification, password reset

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'hello@yezao.art'
const APP_NAME = '野造'
const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

/**
 * Send email via Resend API
 */
async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured — skipping send:', subject)
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${APP_NAME} <${RESEND_FROM}>`,
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[Email] Send failed:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Email] Send error:', error)
    return false
  }
}

// ─── Email Templates ───

function wrapTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #FEF8F2; }
        .container { max-width: 480px; margin: 0 auto; padding: 32px 16px; }
        .card { background: #ffffff; border-radius: 16px; padding: 40px 32px; border: 1px solid #F0E4D8; }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo span { font-family: serif; font-size: 28px; color: #8B5E3C; }
        .content { color: #5C4B3A; font-size: 15px; line-height: 1.7; }
        .button { display: inline-block; background: #A67B5B; color: white !important; text-decoration: none; padding: 12px 32px; border-radius: 12px; font-size: 15px; font-weight: 500; margin: 16px 0; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #F0E4D8; color: #C4B5A5; font-size: 12px; text-align: center; }
        .footer a { color: #A67B5B; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo"><span>野造</span></div>
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} 野造 · 指尖造物，心生温暖</p>
          <p>
            <a href="${APP_URL}/terms">服务条款</a> ·
            <a href="${APP_URL}/privacy">隐私政策</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// ─── Welcome Email ───
export async function sendWelcomeEmail(to: string, nickname: string): Promise<boolean> {
  const content = `
    <div class="content">
      <p>你好，<strong>${nickname}</strong> 👋</p>
      <p>欢迎加入<strong>野造</strong>！我们是一个专注于手作DIY学习、材料指导与作品分享的温暖社区。</p>
      <p>在野造，你可以：</p>
      <ul>
        <li>📖 学习编织、皮具、木工、黏土、刺绣等手工教程</li>
        <li>🧵 了解各种材料的选购技巧和避坑指南</li>
        <li>🎨 分享你的手作作品，收获同好点赞</li>
        <li>🔥 参与打卡挑战，培养手作习惯</li>
      </ul>
      <p style="text-align: center;">
        <a href="${APP_URL}/tutorials" class="button">开始学习</a>
      </p>
      <p>愿你指尖造物，心生温暖。</p>
    </div>
  `
  return sendEmail({ to, subject: '欢迎加入野造 🌿', html: wrapTemplate(content) })
}

// ─── Email Verification ───
// Note: Supabase handles this natively via auth settings; use this for custom flows
export async function sendVerificationEmail(to: string, token: string): Promise<boolean> {
  const verifyUrl = `${APP_URL}/auth/verify?token=${token}`
  const content = `
    <div class="content">
      <p>你好，</p>
      <p>感谢注册野造！请点击下方按钮验证你的邮箱地址：</p>
      <p style="text-align: center;">
        <a href="${verifyUrl}" class="button">验证邮箱</a>
      </p>
      <p style="color: #999; font-size: 13px;">此链接24小时内有效。如果按钮无法点击，请复制以下链接到浏览器：</p>
      <p style="color: #999; font-size: 13px; word-break: break-all;">${verifyUrl}</p>
    </div>
  `
  return sendEmail({ to, subject: '验证你的野造邮箱', html: wrapTemplate(content) })
}

// ─── Password Reset (custom, beyond Supabase) ───
export async function sendPasswordChangedEmail(to: string): Promise<boolean> {
  const content = `
    <div class="content">
      <p>你好，</p>
      <p>你的野造账户密码已成功重置。</p>
      <p>如果这不是你本人的操作，请立即联系我们的支持团队：<a href="mailto:${RESEND_FROM}">${RESEND_FROM}</a></p>
      <p style="text-align: center;">
        <a href="${APP_URL}/auth/login" class="button">登录野造</a>
      </p>
    </div>
  `
  return sendEmail({ to, subject: '你的野造密码已重置', html: wrapTemplate(content) })
}

// ─── Notification Email ───
export async function sendNotificationEmail(
  to: string,
  type: string,
  message: string,
  actionUrl?: string
): Promise<boolean> {
  const content = `
    <div class="content">
      <p>${message}</p>
      ${actionUrl ? `<p style="text-align: center;"><a href="${actionUrl}" class="button">查看详情</a></p>` : ''}
    </div>
  `
  const subject =
    type === 'comment' ? '有人评论了你的作品 💬' :
    type === 'like' ? '有人赞了你的内容 ❤️' :
    type === 'follow' ? '有新的关注者 👋' :
    '你有新的通知'

  return sendEmail({ to, subject, html: wrapTemplate(content) })
}

// ─── Admin Notification ───
export async function sendAdminNotification(subject: string, body: string): Promise<boolean> {
  const content = `<div class="content"><p>${body}</p></div>`
  return sendEmail({ to: RESEND_FROM, subject: `[管理] ${subject}`, html: wrapTemplate(content) })
}
