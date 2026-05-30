// ─── 野造 · 登录页 ───
'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import * as AuthService from '@/lib/supabase/services/auth.service'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setServerError('')

    const result = await AuthService.signIn(data)

    if (!result.success) {
      setServerError(result.error || '登录失败，请重试')
      setIsLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOauthLoading(provider)
    const fn = provider === 'google' ? AuthService.signInWithGoogle : AuthService.signInWithGitHub
    const result = await fn(`${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`)
    if (!result.success) {
      setServerError(result.error || `${provider} 登录失败`)
    }
    setOauthLoading(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-clay-800">欢迎回来</h2>
        <p className="text-clay-400 text-sm mt-1">登录你的野造账户</p>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-clay-600">密码</Label>
            <Link href="/auth/forgot-password" className="text-xs text-clay-400 hover:text-clay-600 transition-colors">
              忘记密码？
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="你的密码"
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-clay-600 hover:bg-clay-700 text-white font-medium h-11"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              登录中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              登录
            </span>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-clay-300">
          或
        </span>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          disabled={!!oauthLoading}
          onClick={() => handleOAuth('google')}
          className="w-full rounded-xl border-clay-200 hover:bg-clay-50 text-clay-700 font-normal"
        >
          {oauthLoading === 'google' ? (
            <span className="h-4 w-4 border-2 border-clay-300 border-t-clay-600 rounded-full animate-spin mr-2" />
          ) : (
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          使用 Google 登录
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={!!oauthLoading}
          onClick={() => handleOAuth('github')}
          className="w-full rounded-xl border-clay-200 hover:bg-clay-50 text-clay-700 font-normal"
        >
          {oauthLoading === 'github' ? (
            <span className="h-4 w-4 border-2 border-clay-300 border-t-clay-600 rounded-full animate-spin mr-2" />
          ) : (
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          )}
          使用 GitHub 登录
        </Button>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-clay-400 mt-6">
        还没有账户？{' '}
        <Link
          href={`/auth/register${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
          className="text-clay-600 hover:text-clay-800 font-medium transition-colors"
        >
          立即注册
        </Link>
      </p>
    </motion.div>
  )
}

// Skeleton fallback for Suspense
function AuthSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-clay-100 rounded w-1/2 mx-auto" />
      <div className="h-4 bg-clay-100 rounded w-2/3 mx-auto" />
      <div className="space-y-3 pt-4">
        <div className="h-10 bg-clay-100 rounded-xl" />
        <div className="h-10 bg-clay-100 rounded-xl" />
        <div className="h-11 bg-clay-100 rounded-xl" />
      </div>
    </div>
  )
}
