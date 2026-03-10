// Register Page - Server Component
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default async function RegisterPage() {
  // Redirect nếu đã đăng nhập
  const session = await getSession()
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Đăng ký tài khoản
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Đăng nhập
          </a>
        </p>
      </div>

      <RegisterForm />
    </div>
  )
}