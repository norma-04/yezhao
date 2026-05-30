// ─── 野造 · 认证状态 ───
import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { ProfileRow } from '@/lib/supabase/database.types'

interface AuthState {
  user: User | null
  profile: ProfileRow | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: ProfileRow | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: () => set({ user: null, profile: null, isAuthenticated: false, isLoading: false }),
}))
