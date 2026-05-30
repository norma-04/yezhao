// ─── 野造 · 后台 Header ───
'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUIStore } from '@/lib/stores/ui-store'

export function AdminHeader() {
  const toggleAdminSidebar = useUIStore((s) => s.toggleAdminSidebar)

  return (
    <header className="sticky top-0 z-30 h-14 lg:h-16 border-b border-clay-200/60 bg-white/90 backdrop-blur flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleAdminSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="font-serif text-lg font-medium text-clay-700">管理后台</h2>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-clay-200 text-clay-600 text-xs">A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
