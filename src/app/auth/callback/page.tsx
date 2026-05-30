// ─── 野造 · OAuth 回调处理 ───
'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackSkeleton />}>
      <CallbackContent />
    </Suspense>
  )
}

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const redirect = searchParams.get('redirect') || '/'
    const error = searchParams.get('error_description') || searchParams.get('error')

    if (error) {
      console.error('OAuth error:', error)
      router.push(`/auth/login?error=${encodeURIComponent(error)}`)
      return
    }

    // The session is already set by Supabase via the URL hash
    // Just redirect to the intended page
    router.push(redirect)
    router.refresh()
  }, [router, searchParams])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8"
    >
      <div className="w-12 h-12 mx-auto mb-4 border-2 border-clay-300 border-t-clay-600 rounded-full animate-spin" />
      <p className="text-clay-500 text-sm">正在完成登录...</p>
    </motion.div>
  )
}

function CallbackSkeleton() {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 mx-auto mb-4 border-2 border-clay-300 border-t-clay-600 rounded-full animate-spin" />
      <p className="text-clay-500 text-sm">正在完成登录...</p>
    </div>
  )
}
