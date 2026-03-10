// Login Page - Server Component
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function LoginPage() {
  // Redirect nếu đã đăng nhập
  const session = await getSession()
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Đăng nhập
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>

      <LoginForm />
    </div>
  )
}