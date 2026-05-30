// ─── 野造 · 后台侧边栏 ───
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Package, Users, MessageSquare,
  Settings, LogOut, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ADMIN_NAV_ITEMS } from '@/lib/constants'
import { useUIStore } from '@/lib/stores/ui-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, BookOpen, Package, Users, MessageSquare, Settings,
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { isAdminSidebarOpen, toggleAdminSidebar } = useUIStore()

  return (
    <>
      {/* Mobile overlay */}
      {isAdminSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={toggleAdminSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-clay-200 flex flex-col transition-transform duration-300 ease-out',
          'lg:translate-x-0',
          isAdminSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-clay-100">
          <Link href="/admin/dashboard" className="font-serif text-lg font-semibold text-clay-700">
            野造管理
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleAdminSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-clay-100 text-clay-700'
                    : 'text-clay-500 hover:text-clay-700 hover:bg-clay-50'
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-clay-100">
          <button
            onClick={() => {
              useAuthStore.getState().signOut()
              window.location.href = '/admin/login'
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-clay-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            退出管理
          </button>
        </div>
      </aside>
    </>
  )
}
