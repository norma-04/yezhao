// ─── 野造 · 社区状态 ───
import { create } from 'zustand'
import type { Topic } from '@/lib/types'

interface CommunityState {
  activeTopic: Topic
  setActiveTopic: (topic: Topic) => void
}

export const useCommunityStore = create<CommunityState>((set) => ({
  activeTopic: 'all',
  setActiveTopic: (activeTopic) => set({ activeTopic }),
}))
