// ─── 野造 · 前台 Header ───
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, Menu, ChevronDown, User, Heart, BookOpen, Image, Calendar, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NAV_ITEMS } from '@/lib/constants'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { cn } from '@/lib/utils'

export function Header() {
  const router = useRouter()
  const { isAuthenticated, user, profile } = useAuthStore()
  const [searchValue, setSearchValue] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  const handleMenuAction = (href: string) => {
    router.push(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-clay-200/60 bg-cream/90 backdrop-blur-md supports-[backdrop-filter]:bg-cream/80">
      {/* Desktop Nav */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-2xl font-semibold text-clay-700 tracking-tight">
            野造
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                'text-clay-600 hover:text-clay-800 hover:bg-clay-100/70',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search + User */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clay-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索教程、材料..."
                className="h-9 w-48 lg:w-56 rounded-full border border-clay-200 bg-white/70 pl-9 pr-4 text-sm text-clay-700 placeholder:text-clay-400 focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/20 transition-all duration-200"
              />
            </div>
          </form>

          {/* User */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 hover:bg-clay-100 transition-colors cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-clay-300 text-clay-700 text-xs">
                      {(profile?.nickname || user.email || 'U')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm text-clay-600">{profile?.nickname || user.email}</span>
                  <ChevronDown className="hidden md:block h-3 w-3 text-clay-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-2 bg-white/95 backdrop-blur border-clay-200">
                <DropdownMenuItem onClick={() => handleMenuAction('/me')}>
                  <User className="h-4 w-4" /> 个人中心
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('/me/favorites')}>
                  <Heart className="h-4 w-4" /> 我的收藏
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('/me/learning')}>
                  <BookOpen className="h-4 w-4" /> 继续学习
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('/me/works')}>
                  <Image className="h-4 w-4" /> 我的作品
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('/me/challenges')}>
                  <Calendar className="h-4 w-4" /> 打卡挑战
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('/me/settings')}>
                  <Settings className="h-4 w-4" /> 账号设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    useAuthStore.getState().signOut()
                    getSupabaseClient().auth.signOut().finally(() => {
                      window.location.href = '/'
                    })
                  }}
                >
                  <LogOut className="h-4 w-4" /> 退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="rounded-full border-clay-300 text-clay-600 hover:bg-clay-100">
                登录
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-clay-100 transition-colors">
              <Menu className="h-5 w-5 text-clay-600" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-cream border-clay-200">
              <div className="flex flex-col gap-4 pt-8">
                <Link href="/" className="font-serif text-xl font-semibold text-clay-700" onClick={() => setMobileOpen(false)}>
                  野造
                </Link>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-clay-600 hover:text-clay-800 py-2 font-medium transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Mobile search */}
                <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false) }} className="mt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clay-400" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="搜索教程、材料..."
                      className="h-10 w-full rounded-full border border-clay-200 bg-white pl-10 pr-4 text-sm focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/20"
                    />
                  </div>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-clay-200/60 bg-cream/95 backdrop-blur-md">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-clay-500 hover:text-clay-700 transition-colors"
            >
              <div className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
