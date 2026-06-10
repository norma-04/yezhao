// ─── 野造 · 注册页 ───
'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import * as AuthService from '@/lib/supabase/services/auth.service'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  nickname: z.string().min(2, '昵称至少2个字符').max(20, '昵称最多20个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位').regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '密码需包含字母和数字'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <RegisterContent />
    </Suspense>
  )
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setServerError('')

    // Step 1: Create user via API (service_role, email pre-confirmed)
    const signupRes = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password, nickname: data.nickname }),
    })

    if (!signupRes.ok) {
      const errData = await signupRes.json().catch(() => ({ error: '注册失败' }))
      setServerError(errData.error || '注册失败，请重试')
      setIsLoading(false)
      return
    }

    // Step 2: Auto sign-in
    const signInResult = await AuthService.signIn({ email: data.email, password: data.password })

    if (!signInResult.success) {
      setServerError('注册成功但自动登录失败，请手动登录')
      setIsLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-clay-800">加入野造</h2>
        <p className="text-clay-400 text-sm mt-1">开启你的手作创作之旅</p>
      </div>

      {/* Error banner */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {serverError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nickname */}
        <div>
          <Label htmlFor="nickname" className="text-clay-600">昵称</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="你在野造的名字"
            className={cn('mt-1.5 rounded-xl', errors.nickname && 'border-red-300')}
            {...register('nickname')}
          />
          {errors.nickname && (
            <p className="text-red-500 text-xs mt-1">{errors.nickname.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-clay-600">邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="你的邮箱地址"
            className={cn('mt-1.5 rounded-xl', errors.email && 'border-red-300')}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-clay-600">密码</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="至少6位，包含字母和数字"
              className={cn('pr-10 rounded-xl', errors.password && 'border-red-300')}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-clay-400 hover:text-clay-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword" className="text-clay-600">确认密码</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="再次输入密码"
            className={cn('mt-1.5 rounded-xl', errors.confirmPassword && 'border-red-300')}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-clay-600 hover:bg-clay-700 text-white font-medium h-11"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              注册中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              注册
            </span>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-clay-300">
          或使用第三方登录
        </span>
      </div>

      {/* OAuth */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => AuthService.signInWithGoogle(`${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`)}
          className="w-full rounded-xl border-clay-200 hover:bg-clay-50 text-clay-700 font-normal"
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          使用 Google 注册
        </Button>
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-clay-400 mt-6">
        已有账户？{' '}
        <Link
          href={`/auth/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
          className="text-clay-600 hover:text-clay-800 font-medium transition-colors"
        >
          立即登录
        </Link>
      </p>
    </motion.div>
  )
}

function AuthSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-clay-100 rounded w-1/2 mx-auto" />
      <div className="h-4 bg-clay-100 rounded w-2/3 mx-auto" />
      <div className="space-y-3 pt-4">
        <div className="h-10 bg-clay-100 rounded-xl" />
        <div className="h-10 bg-clay-100 rounded-xl" />
        <div className="h-10 bg-clay-100 rounded-xl" />
        <div className="h-10 bg-clay-100 rounded-xl" />
        <div className="h-11 bg-clay-100 rounded-xl" />
      </div>
    </div>
  )
}
