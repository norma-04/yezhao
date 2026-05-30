// ─── 野造 · 教程筛选状态 ───
import { create } from 'zustand'
import type { Category, Difficulty } from '@/lib/types'

interface TutorialFilterState {
  category: Category | 'all'
  difficulty: Difficulty | 'all'
  sortBy: 'latest' | 'popular' | 'favorites'
  searchQuery: string
  setCategory: (c: Category | 'all') => void
  setDifficulty: (d: Difficulty | 'all') => void
  setSortBy: (s: 'latest' | 'popular' | 'favorites') => void
  setSearchQuery: (q: string) => void
  resetFilters: () => void
}

export const useTutorialFilterStore = create<TutorialFilterState>((set) => ({
  category: 'all',
  difficulty: 'all',
  sortBy: 'latest',
  searchQuery: '',
  setCategory: (category) => set({ category }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () => set({ category: 'all', difficulty: 'all', sortBy: 'latest', searchQuery: '' }),
}))
