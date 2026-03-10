'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/stores/useUIStore'
import type { AuthUser } from '@/types/auth'

interface AppHeaderProps {
  user: AuthUser
}

export function AppHeader({ user }: AppHeaderProps) {
  const { toggle } = useSidebar()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggle}
        >
          <span className="sr-only">Mở menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Page title for mobile */}
        <div className="flex-1 lg:flex-none">
          <h1 className="text-lg font-semibold text-gray-900 lg:hidden ml-4">
            Finance Tracker
          </h1>
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Sign out button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="text-gray-700 hover:text-gray-900"
          >
            <span className="hidden sm:inline">Đăng xuất</span>
            <span className="sm:hidden">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}