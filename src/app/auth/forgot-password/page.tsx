// ─── 野造 · 忘记密码页 ───
'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as AuthService from '@/lib/supabase/services/auth.service'
import { cn } from '@/lib/utils'

const forgotSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
})

type ForgotForm = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ForgotContent />
    </Suspense>
  )
}

function ForgotContent() {
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true)
    setServerError('')

    const result = await AuthService.resetPassword({
      email: data.email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (!result.success) {
      setServerError(result.error || '发送失败，请稍后重试')
      setIsLoading(false)
      return
    }

    setIsSent(true)
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {/* Back link */}
      <Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-clay-400 hover:text-clay-600 transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        返回登录
      </Link>

      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-clay-800">忘记密码</h2>
        <p className="text-clay-400 text-sm mt-1">
          {isSent ? '请查看你的邮箱' : '输入邮箱地址，我们将发送重置链接'}
        </p>
      </div>

      {/* Success state */}
      {isSent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-50 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-sage-500" />
          </div>
          <p className="text-clay-600 text-sm mb-6">
            重置密码链接已发送到你的邮箱。<br />
            请检查收件箱（包括垃圾邮件文件夹）。
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSent(false)}
            className="rounded-xl border-clay-200 text-clay-600"
          >
            重新发送
          </Button>
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
      {!isSent && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-clay-600">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="你的注册邮箱"
              className={cn('mt-1.5 rounded-xl', errors.email && 'border-red-300')}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
                发送中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                发送重置链接
              </span>
            )}
          </Button>
        </form>
      )}

      {/* Login link */}
      <p className="text-center text-sm text-clay-400 mt-6">
        想起密码了？{' '}
        <Link href="/auth/login" className="text-clay-600 hover:text-clay-800 font-medium transition-colors">
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
        <div className="h-11 bg-clay-100 rounded-xl" />
      </div>
    </div>
  )
}
