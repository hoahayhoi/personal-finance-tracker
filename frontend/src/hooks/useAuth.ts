'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/lib/api'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: { id: string; email: string; name?: string } | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setTokens: (access: string, refresh: string) => void
  refreshAccessToken: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await apiClient.login({ email, password })
        const { access, refresh } = response

        apiClient.setToken(access)
        
        // Get user profile
        const profile = await apiClient.getProfile()

        set({
          accessToken: access,
          refreshToken: refresh,
          user: profile,
          isAuthenticated: true,
        })
      },

      logout: () => {
        apiClient.clearToken()
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },

      setTokens: (access: string, refresh: string) => {
        apiClient.setToken(access)
        set({ accessToken: access, refreshToken: refresh })
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) throw new Error('No refresh token')

        const response = await apiClient.refreshToken(refreshToken)
        const { access } = response

        apiClient.setToken(access)
        set({ accessToken: access })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
