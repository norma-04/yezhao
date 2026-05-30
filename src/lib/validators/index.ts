// ─── 野造 · Zod 校验 ───
import { z } from 'zod'

// ─── Auth ───
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
})

export const registerSchema = z.object({
  nickname: z.string().min(2, '昵称至少2个字符').max(20, '昵称最多20个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位').regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '密码需包含字母和数字'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, '密码至少6位').regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '密码需包含字母和数字'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
})

// ─── Profile ───
export const profileSchema = z.object({
  nickname: z.string().min(2, '昵称至少2个字符').max(20),
  bio: z.string().max(200, '简介最多200个字符').optional(),
  website: z.string().url('请输入有效的网址').optional().or(z.literal('')),
  location: z.string().max(100).optional(),
})

export const passwordSchema = z.object({
  oldPassword: z.string().min(6, '请输入原密码'),
  newPassword: z.string().min(6, '新密码至少6位'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
})

// ─── Tutorial ───
export const tutorialSchema = z.object({
  title: z.string().min(2, '标题至少2个字符'),
  slug: z.string().min(2, 'Slug 至少2个字符').regex(/^[a-z0-9-]+$/, '仅支持小写字母、数字和连字符'),
  category: z.enum(['weaving', 'leather', 'woodwork', 'clay', 'embroidery', 'other']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  description: z.string().min(20, '简介至少20个字符'),
  duration_minutes: z.number().min(1),
  status: z.enum(['draft', 'published', 'archived']),
})

// ─── Material ───
export const materialSchema = z.object({
  name: z.string().min(2, '材料名称至少2个字符'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, '仅支持小写字母、数字和连字符'),
  category: z.enum(['weaving', 'leather', 'woodwork', 'clay', 'embroidery', 'other']),
  description: z.string().min(10, '描述至少10个字符'),
})

// ─── Community ───
export const postSchema = z.object({
  title: z.string().min(2, '标题至少2个字符').max(50, '标题最多50个字符'),
  content: z.string().min(10, '内容至少10个字符'),
  topic: z.enum(['showcase', 'newbie', 'review', 'activity']),
  tags: z.array(z.string()).optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, '评论不能为空').max(1000, '评论最多1000个字符'),
})

// ─── File Upload ───
export const uploadSchema = z.object({
  bucket: z.enum(['avatars', 'tutorials', 'materials', 'community']),
  file: z.instanceof(File, { message: '请选择文件' }),
})

// ─── Type exports ───
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type PasswordInput = z.infer<typeof passwordSchema>
export type TutorialInput = z.infer<typeof tutorialSchema>
export type MaterialInput = z.infer<typeof materialSchema>
export type PostInput = z.infer<typeof postSchema>
export type CommentInput = z.infer<typeof commentSchema>
