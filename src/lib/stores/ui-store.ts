// ─── 野造 · UI 状态 ───
import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  isAdminSidebarOpen: boolean
  activeSearchQuery: string
  setMobileMenuOpen: (open: boolean) => void
  setAdminSidebarOpen: (open: boolean) => void
  setActiveSearchQuery: (query: string) => void
  toggleMobileMenu: () => void
  toggleAdminSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isAdminSidebarOpen: true,
  activeSearchQuery: '',
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setAdminSidebarOpen: (open) => set({ isAdminSidebarOpen: open }),
  setActiveSearchQuery: (query) => set({ activeSearchQuery: query }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  toggleAdminSidebar: () => set((s) => ({ isAdminSidebarOpen: !s.isAdminSidebarOpen })),
}))
