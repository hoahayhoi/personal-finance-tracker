// Auth Layout - Centered layout cho login/register pages
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập | Personal Finance Tracker',
  description: 'Đăng nhập vào ứng dụng quản lý tài chính cá nhân',
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            💰 Finance Tracker
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý tài chính cá nhân thông minh
          </p>
        </div>
        
        {/* Auth Form */}
        {children}
      </div>
    </div>
  )
}