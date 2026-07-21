import { create } from 'zustand'

interface AppState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  identityScore: number
  setIdentityScore: (score: number) => void
}

export const useStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  identityScore: 85,
  setIdentityScore: (score) => set({ identityScore: score }),
}))
