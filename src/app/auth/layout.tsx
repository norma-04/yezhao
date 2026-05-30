// ─── 野造 · Auth Layout ───
// Centered card layout for auth pages — warm, healing, new-Chinese aesthetic
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登录 | 野造',
  description: '登录野造，开启你的手作之旅',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-warm-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-clay-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-clay-700 tracking-wide">野造</h1>
          <p className="text-clay-400 text-sm mt-2">指尖造物，心生温暖</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-clay-100 shadow-card p-8">
          {children}
        </div>

        {/* Footer text */}
        <p className="text-center text-clay-300 text-xs mt-6">
          继续即表示你同意野造的{' '}
          <a href="/terms" className="text-clay-500 hover:text-clay-600 underline underline-offset-2">
            服务条款
          </a>{' '}
          和{' '}
          <a href="/privacy" className="text-clay-500 hover:text-clay-600 underline underline-offset-2">
            隐私政策
          </a>
        </p>
      </div>
    </div>
  )
}
