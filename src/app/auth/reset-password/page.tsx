// ─── 野造 · 重置密码页 ───
'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, Key, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as AuthService from '@/lib/supabase/services/auth.service'
import { cn } from '@/lib/utils'

const resetSchema = z.object({
  password: z.string().min(6, '密码至少6位').regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '密码需包含字母和数字'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
})

type ResetForm = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ResetContent />
    </Suspense>
  )
}

function ResetContent() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true)
    setServerError('')

    const result = await AuthService.updatePassword({ password: data.password })

    if (!result.success) {
      setServerError(result.error || '重置失败，请重新发送重置邮件')
      setIsLoading(false)
      return
    }

    setIsSuccess(true)
    setIsLoading(false)

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/auth/login?message=password_reset')
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-clay-800">重置密码</h2>
        <p className="text-clay-400 text-sm mt-1">
          {isSuccess ? '密码重置成功！' : '设置你的新密码'}
        </p>
      </div>

      {/* Success */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-50 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-sage-500" />
          </div>
          <p className="text-clay-600 text-sm">
            密码已更新，即将跳转到登录页...
          </p>
        </motion.div>
      )}

      {/* Error */}
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

      {/* Form */}
      {!isSuccess && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-clay-600">新密码</Label>
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

          <div>
            <Label htmlFor="confirmPassword" className="text-clay-600">确认密码</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="再次输入新密码"
              className={cn('mt-1.5 rounded-xl', errors.confirmPassword && 'border-red-300')}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-clay-600 hover:bg-clay-700 text-white font-medium h-11"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                重置中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                重置密码
              </span>
            )}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-clay-400 mt-6">
        <Link href="/auth/login" className="text-clay-600 hover:text-clay-800 font-medium transition-colors">
          返回登录
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
        <div className="h-11 bg-clay-100 rounded-xl" />
      </div>
    </div>
  )
}
