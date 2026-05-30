// ─── 野造 · 404 ───
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center">
        <p className="font-serif text-8xl lg:text-9xl text-clay-300 font-semibold">404</p>
        <h1 className="mt-4 font-serif text-2xl text-clay-700">页面未找到</h1>
        <p className="mt-2 text-clay-500 max-w-sm mx-auto">
          这个页面可能已被移除，或者链接地址不正确。
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
