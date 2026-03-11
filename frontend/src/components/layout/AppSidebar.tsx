'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/stores/useUIStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Giao dịch', href: '/transactions', icon: '💰' },
  { name: 'Danh mục', href: '/categories', icon: '🏷️' },
  { name: 'Báo cáo', href: '/reports', icon: '📈' },
  { name: 'Cài đặt', href: '/profile', icon: '⚙️' },
  { name: 'Test', href: '/test', icon: '🧪' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0 lg:flex lg:flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 flex-shrink-0">
            <h1 className="text-xl font-bold text-white">
              💰 Finance Tracker
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Close mobile menu when clicking nav item
                    if (window.innerWidth < 1024) {
                      close()
                    }
                  }}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <p className="text-xs text-gray-500 text-center">
              © 2024 Finance Tracker
            </p>
          </div>
        </div>
      </div>
    </>
  )
}