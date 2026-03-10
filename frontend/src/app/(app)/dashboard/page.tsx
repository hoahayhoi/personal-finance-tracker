// Dashboard Page - Server Component
import type { Metadata } from 'next'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Dashboard | Personal Finance Tracker',
  description: 'Tổng quan tài chính cá nhân',
}

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Chào mừng trở lại, {session?.user?.name || session?.user?.email}! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Đây là tổng quan tài chính của bạn hôm nay.
        </p>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Summary Cards */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Tổng thu nhập</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">0 ₫</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Tổng chi tiêu</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">0 ₫</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Số dư</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">0 ₫</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Giao dịch</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">💰</div>
            <div className="font-medium">Thêm thu nhập</div>
            <div className="text-sm text-gray-500">Ghi nhận tiền vào</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">💸</div>
            <div className="font-medium">Thêm chi tiêu</div>
            <div className="text-sm text-gray-500">Ghi nhận tiền ra</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Xem báo cáo</div>
            <div className="text-sm text-gray-500">Phân tích chi tiết</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">🏷️</div>
            <div className="font-medium">Quản lý danh mục</div>
            <div className="text-sm text-gray-500">Tạo danh mục mới</div>
          </button>
        </div>
      </div>
    </div>
  )
}