# Next.js Authentication Guide - Personal Finance Tracker

Hướng dẫn implement authentication cho frontend Next.js với Django JWT backend.

## Overview

- **Backend**: Django REST Framework + JWT
- **Frontend**: Next.js 15 + Auth.js (NextAuth) v4
- **Flow**: JWT tokens từ Django backend
- **Storage**: HTTP-only cookies (secure)

---

## 1. Setup Auth.js (NextAuth)

### Install Dependencies

```bash
cd frontend
npm install next-auth
```

### Environment Variables

Thêm vào `frontend/.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Django Backend
DJANGO_API_URL=http://127.0.0.1:8000
```

---

## 2. Auth Configuration

### Create `lib/auth.ts`

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call Django login API
          const response = await fetch(`${process.env.DJANGO_API_URL}/api/auth/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await response.json()

          if (!response.ok || !data.success) {
            return null
          }

          // Get user profile with access token
          const profileResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/profile/`, {
            headers: {
              'Authorization': `Bearer ${data.data.access}`,
            },
          })

          const profileData = await profileResponse.json()

          if (!profileResponse.ok || !profileData.success) {
            return null
          }

          return {
            id: profileData.data.id.toString(),
            email: profileData.data.email,
            name: profileData.data.full_name,
            accessToken: data.data.access,
            refreshToken: data.data.refresh,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      // Check if access token is expired and refresh it
      if (token.accessToken) {
        try {
          // Decode JWT to check expiration (optional)
          const payload = JSON.parse(atob(token.accessToken.split('.')[1]))
          const currentTime = Math.floor(Date.now() / 1000)
          
          // If token expires in next 5 minutes, refresh it
          if (payload.exp - currentTime < 300) {
            const refreshResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/token/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refresh: token.refreshToken,
              }),
            })

            const refreshData = await refreshResponse.json()

            if (refreshResponse.ok && refreshData.success) {
              token.accessToken = refreshData.data.access
            }
          }
        } catch (error) {
          console.error('Token refresh error:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  session: {
    strategy: 'jwt',
  },
}
```

### Create API Route `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

---

## 3. Type Definitions

### Create `types/next-auth.d.ts`

```typescript
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    accessToken?: string
    refreshToken?: string
  }

  interface Session {
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
  }
}
```

---

## 4. Auth Components

### Login Form `components/auth/LoginForm.tsx`

```tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Email hoặc mật khẩu không đúng')
      } else {
        toast.success('Đăng nhập thành công')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  )
}
```

### Register Form `components/auth/RegisterForm.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
        router.push('/auth/login')
      } else {
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Họ tên</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
      </Button>
    </form>
  )
}
```

---

## 5. Auth Pages

### Login Page `app/(auth)/login/page.tsx`

```tsx
import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
```

### Register Page `app/(auth)/register/page.tsx`

```tsx
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng ký</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 6. Session Provider

### Root Layout `app/layout.tsx`

```tsx
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
```

---

## 7. Protected Routes

### Middleware `middleware.ts`

```typescript
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/categories/:path*',
    '/profile/:path*'
  ]
}
```

### Auth Guard Hook `hooks/useAuthGuard.ts`

```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuthGuard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/login')
    }
  }, [session, status, router])

  return { session, status }
}
```

---

## 8. API Client with Auth

### Create `lib/api.ts`

```typescript
import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://127.0.0.1:8000'

export class ApiClient {
  private async getAuthHeaders() {
    const session = await getSession()
    return {
      'Content-Type': 'application/json',
      ...(session?.accessToken && {
        'Authorization': `Bearer ${session.accessToken}`
      })
    }
  }

  async get(endpoint: string) {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
    })
    return response.json()
  }

  async post(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return response.json()
  }

  async patch(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })
    return response.json()
  }

  async delete(endpoint: string) {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })
    return response.json()
  }
}

export const apiClient = new ApiClient()
```

---

## 9. Usage Examples

### Dashboard Page `app/(app)/dashboard/page.tsx`

```tsx
'use client'

import { useSession } from 'next-auth/react'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function DashboardPage() {
  const { session } = useAuthGuard()

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
      {/* Dashboard content */}
    </div>
  )
}
```

### API Usage Example

```tsx
'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'

export function TransactionsList() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiClient.get('/api/transactions/')
        if (response.success) {
          setTransactions(response.data)
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <div>
      {/* Render transactions */}
    </div>
  )
}
```

---

## 10. Environment Setup

### Frontend `.env.local`

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXT_PUBLIC_DJANGO_API_URL=http://127.0.0.1:8000
```

### Backend CORS Settings

Thêm vào Django `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

---

## 11. Testing Flow

1. **Start Backend**: `python manage.py runserver`
2. **Start Frontend**: `npm run dev`
3. **Test Register**: `/auth/register`
4. **Test Login**: `/auth/login`
5. **Test Protected Route**: `/dashboard`
6. **Test API Calls**: Check network tab for JWT headers

---

## 12. Security Notes

- JWT tokens stored in NextAuth session (HTTP-only cookies)
- Automatic token refresh before expiration
- CORS properly configured
- Protected routes with middleware
- Secure environment variables

---

## 13. Troubleshooting

### Common Issues:

1. **CORS Error**: Check Django CORS settings
2. **Token Expired**: Check refresh token logic
3. **Redirect Loop**: Check middleware matcher patterns
4. **API 401**: Verify token is being sent in headers

### Debug Tips:

```typescript
// Add to auth.ts for debugging
console.log('Auth response:', data)
console.log('Token payload:', JSON.parse(atob(token.split('.')[1])))
```

---

## Next Steps

1. Implement logout functionality
2. Add password reset flow
3. Add profile update
4. Implement role-based access
5. Add loading states and error boundaries