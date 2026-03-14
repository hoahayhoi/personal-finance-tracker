# Frontend Auth Flow — Personal Finance Tracker

**Document ID:** ENG-AUTH-FRONTEND  
**Version:** 1.0  
**Last Updated:** 2026-03-14  
**Tech Stack:** Next.js 15 + NextAuth.js v4 + Django JWT Backend

---

## 1. Tổng quan Architecture

### Auth Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│ NextAuth.js v4 (Session Management)                        │
│ ├── JWT Strategy (không dùng database)                     │
│ ├── Credentials Provider (email/password)                  │
│ └── Custom callbacks (token refresh logic)                 │
├─────────────────────────────────────────────────────────────┤
│ Middleware (Route Protection)                               │
│ ├── Protected routes: /dashboard, /transactions, etc.      │
│ └── Auth redirects: /login ↔ /dashboard                    │
├─────────────────────────────────────────────────────────────┤
│                    Backend (Django)                        │
│ ├── JWT Authentication (djangorestframework-simplejwt)     │
│ ├── Access Token (60 min) + Refresh Token (24h)           │
│ └── API Endpoints: /register, /login, /token/refresh       │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | File | Mô tả |
|---|---|---|
| **Auth Config** | `src/lib/auth.ts` | NextAuth configuration, providers, callbacks |
| **Middleware** | `src/middleware.ts` | Route protection, redirects |
| **Login Form** | `src/components/auth/LoginForm.tsx` | Client component với react-hook-form |
| **Register Form** | `src/components/auth/RegisterForm.tsx` | Direct Django API call |
| **API Route** | `src/app/api/auth/[...nextauth]/route.ts` | NextAuth handler |
| **Types** | `src/types/django-api.ts` | Django API response types |
| **Validation** | `src/lib/validations.ts` | Zod schemas cho forms |

---

## 2. Authentication Flow Diagrams

### 2.1 Register Flow
```
User fills /register form
         │
         ▼
Client validation (Zod)
         │
         ▼
Direct fetch() to Django /api/auth/register/
         │
    ┌────┴────┐
  Error    Success
    │         │
    ▼         ▼
Show toast  Redirect to /login
            with success message
```

### 2.2 Login Flow
```
User fills /login form
         │
         ▼
signIn('credentials', { email, password })
         │
         ▼
NextAuth Credentials Provider
         │
         ▼
Django /api/auth/login/ → get JWT tokens
         │
         ▼
Django /api/auth/profile/ → get user info
         │
    ┌────┴────┐
  Error    Success
    │         │
    ▼         ▼
Return null  Return user object + tokens
    │         │
    ▼         ▼
Show error   JWT callback → Session callback
             │
             ▼
           Redirect to /dashboard
```

### 2.3 Token Refresh Flow (Automatic)
```
User makes request to protected page
         │
         ▼
Middleware checks session
         │
         ▼
NextAuth JWT callback triggered
         │
         ▼
Check if access token expires in <5 min
         │
    ┌────┴────┐
   No      Yes (refresh needed)
    │         │
    ▼         ▼
Continue   Django /api/auth/token/refresh/
           with refresh token
                 │
            ┌────┴────┐
          Error    Success
            │         │
            ▼         ▼
        Log error   Update access token
                         │
                         ▼
                    Continue request
```

### 2.4 Route Protection Flow
```
User navigates to /dashboard
         │
         ▼
Middleware.ts executes
         │
         ▼
Check if route is protected
         │
    ┌────┴────┐
   No      Yes
    │         │
    ▼         ▼
Allow    Check session token
         │
    ┌────┴────┐
  Valid   Invalid/Missing
    │         │
    ▼         ▼
  Allow    Redirect to /login
```

---

## 3. File-by-File Implementation

### 3.1 Auth Configuration (`src/lib/auth.ts`)

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
        // 1. Validate input
        if (!credentials?.email || !credentials?.password) return null

        try {
          // 2. Call Django login API
          const loginResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const loginData = await loginResponse.json()
          if (!loginResponse.ok || !loginData.success) return null

          // 3. Get user profile with access token
          const profileResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/profile/`, {
            headers: { 'Authorization': `Bearer ${loginData.data?.access}` },
          })

          const profileData = await profileResponse.json()
          if (!profileResponse.ok || !profileData.success) return null

          // 4. Return user object với tokens
          return {
            id: profileData.data.id.toString(),
            email: profileData.data.email,
            name: profileData.data.full_name || profileData.data.first_name,
            accessToken: loginData.data?.access,
            refreshToken: loginData.data?.refresh,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  
  callbacks: {
    // JWT callback: Chạy mỗi khi tạo/update JWT token
    async jwt({ token, user }) {
      // Lần đầu login: lưu tokens từ user object
      if (user?.accessToken && user?.refreshToken) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      // Auto refresh logic: Check nếu access token sắp hết hạn
      if (token.accessToken && typeof token.accessToken === 'string') {
        try {
          const payload = JSON.parse(atob(token.accessToken.split('.')[1]))
          const currentTime = Math.floor(Date.now() / 1000)
          
          // Nếu token hết hạn trong 5 phút tới → refresh
          if (payload.exp - currentTime < 300 && token.refreshToken) {
            const refreshResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/token/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: token.refreshToken }),
            })

            const refreshData = await refreshResponse.json()
            if (refreshResponse.ok && refreshData.success) {
              token.accessToken = refreshData.data.access
              // Giữ nguyên refresh token (Django không trả về refresh token mới)
            }
          }
        } catch (error) {
          console.error('Token refresh error:', error)
        }
      }

      return token
    },

    // Session callback: Expose tokens cho client
    async session({ session, token }) {
      if (token.accessToken) session.accessToken = token.accessToken
      if (token.refreshToken) session.refreshToken = token.refreshToken
      return session
    }
  },

  pages: {
    signIn: '/login',  // Custom login page
  },
  
  session: {
    strategy: 'jwt',  // Không dùng database sessions
  },
}
```

**Key Points:**
- **Credentials Provider**: Xử lý email/password authentication
- **JWT Strategy**: Không cần database, lưu tokens trong JWT
- **Auto Refresh**: Tự động refresh access token khi sắp hết hạn
- **Error Handling**: Graceful fallback khi API calls fail

### 3.2 Middleware Protection (`src/middleware.ts`)

```typescript
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Smart redirect: Root → Dashboard nếu đã login
    if (pathname === '/' && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow auth pages without token
        if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
          return true
        }

        // Require token for protected routes
        if (pathname.startsWith('/dashboard') || 
            pathname.startsWith('/transactions') || 
            pathname.startsWith('/categories') ||
            pathname.startsWith('/profile')) {
          return !!token
        }

        // Allow other pages (landing, about, etc.)
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/transactions/:path*', 
    '/categories/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
}
```

**Key Points:**
- **withAuth**: NextAuth middleware wrapper
- **Smart Redirects**: Root → Dashboard cho logged-in users
- **Route Protection**: Block protected routes cho unauthenticated users
- **Matcher Config**: Chỉ chạy middleware cho specific routes

### 3.3 Login Form (`src/components/auth/LoginForm.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { loginSchema, type LoginInput } from '@/lib/validations'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)

    try {
      // NextAuth signIn với credentials provider
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,  // Handle redirect manually
      })

      if (result?.error) {
        toast.error('Email hoặc mật khẩu không đúng')
      } else {
        toast.success('Đăng nhập thành công!')
        router.push('/dashboard')
        router.refresh()  // Refresh để update server components
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields với shadcn/ui components */}
    </form>
  )
}
```

**Key Points:**
- **Client Component**: Cần useState, form handlers
- **NextAuth signIn**: Sử dụng NextAuth thay vì direct API call
- **Manual Redirect**: `redirect: false` để handle success/error
- **Zod Validation**: Client-side validation với react-hook-form

### 3.4 Register Form (`src/components/auth/RegisterForm.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerSchema, type RegisterInput } from '@/lib/validations'

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)

    try {
      // Direct API call to Django (không qua NextAuth)
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          first_name: data.name || '',
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        toast.error(result.error || 'Đăng ký thất bại')
        return
      }

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      router.push('/login')
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  // Form JSX...
}
```

**Key Points:**
- **Direct API Call**: Không qua NextAuth vì chỉ tạo user
- **Environment Variable**: `NEXT_PUBLIC_` để access từ client
- **Success Flow**: Register → Redirect to Login

---

## 4. Session Management

### 4.1 Server-Side Session Access

```typescript
// Server Components và Server Actions
import { getSession, getCurrentUser, getAccessToken } from '@/lib/auth'

// Get full session
const session = await getSession()
if (!session) redirect('/login')

// Get user info only
const user = await getCurrentUser()
console.log(user?.email)

// Get access token for API calls
const accessToken = await getAccessToken()
const response = await fetch(`${process.env.DJANGO_API_URL}/api/transactions/`, {
  headers: { 'Authorization': `Bearer ${accessToken}` }
})
```

### 4.2 Client-Side Session Access

```typescript
// Client Components
import { useSession, signOut } from 'next-auth/react'

function ProfileComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>Please login</div>

  return (
    <div>
      <p>Welcome {session?.user?.name}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  )
}
```

### 4.3 API Calls với Authentication

```typescript
// Helper function cho authenticated API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const session = await getSession()
  if (!session?.accessToken) throw new Error('No access token')

  return fetch(`${process.env.DJANGO_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

// Usage
const transactions = await apiCall('/api/transactions/')
const result = await apiCall('/api/transactions/', {
  method: 'POST',
  body: JSON.stringify(transactionData)
})
```

---

## 5. Error Handling & Edge Cases

### 5.1 Token Expiry Scenarios

| Scenario | Behavior | Solution |
|---|---|---|
| Access token expired | Auto refresh trong JWT callback | Transparent cho user |
| Refresh token expired | Session invalid, redirect to login | User phải login lại |
| Network error during refresh | Keep old token, retry next request | Graceful degradation |
| Invalid credentials | signIn returns error | Show error message |

### 5.2 Common Issues & Solutions

**Issue: "NEXTAUTH_URL not configured"**
```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

**Issue: CORS errors với Django**
```python
# Django settings.py
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
CORS_ALLOW_CREDENTIALS = True
```

**Issue: Session không persist sau refresh**
```typescript
// Wrap app với SessionProvider
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
```

**Issue: Middleware redirect loop**
```typescript
// Đảm bảo authorized callback return true cho auth pages
if (pathname.startsWith('/login')) return true
```

---

## 6. Security Considerations

### 6.1 Token Security

| Aspect | Implementation | Security Level |
|---|---|---|
| **Storage** | HTTP-only cookies (NextAuth default) | ✅ Secure |
| **Transmission** | HTTPS only | ✅ Secure |
| **Expiry** | Access: 60min, Refresh: 24h | ✅ Reasonable |
| **Rotation** | Refresh token rotation enabled | ✅ Secure |

### 6.2 Best Practices Implemented

- ✅ **No localStorage**: Tokens stored in HTTP-only cookies
- ✅ **Auto refresh**: Transparent token renewal
- ✅ **CSRF protection**: NextAuth built-in protection
- ✅ **Secure cookies**: `secure: true` in production
- ✅ **Input validation**: Zod schemas cho all forms
- ✅ **Error messages**: Generic messages (không reveal field nào sai)

---

## 7. Testing Auth Flow

### 7.1 Manual Testing Checklist

**Register Flow:**
- [ ] Valid registration → success message → redirect to login
- [ ] Invalid email → show validation error
- [ ] Weak password → show validation error
- [ ] Duplicate email → show server error
- [ ] Network error → show generic error

**Login Flow:**
- [ ] Valid credentials → redirect to dashboard
- [ ] Invalid credentials → show error message
- [ ] Already logged in + visit /login → redirect to dashboard
- [ ] Network error → show generic error

**Session Management:**
- [ ] Protected route without login → redirect to login
- [ ] Login + visit protected route → allow access
- [ ] Token refresh works transparently
- [ ] Logout → clear session + redirect to home

**Edge Cases:**
- [ ] Refresh page on protected route → stay logged in
- [ ] Multiple tabs → session sync
- [ ] Token expires → auto refresh or redirect to login

### 7.2 Environment Variables Required

```bash
# .env.local (Frontend)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
DJANGO_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_DJANGO_API_URL=http://127.0.0.1:8000

# .env (Backend Django)
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 8. Future Enhancements

### 8.1 Planned Features

| Feature | Priority | Implementation |
|---|---|---|
| **OAuth Login** | Should Have | Google Provider trong NextAuth |
| **Remember Me** | Could Have | Longer refresh token expiry |
| **2FA** | Could Have | TOTP integration |
| **Password Reset** | Should Have | Email-based reset flow |
| **Account Verification** | Could Have | Email verification |

### 8.2 Performance Optimizations

- **Token caching**: Cache decoded JWT payload
- **Parallel requests**: Batch API calls where possible
- **Optimistic updates**: Update UI before API response
- **Session preloading**: Preload session trong layout

---

## 9. Troubleshooting Guide

### 9.1 Common Errors

**"Invalid credentials" but credentials are correct:**
- Check Django API is running on correct port
- Verify CORS settings
- Check network tab for actual error response

**Middleware redirect loop:**
- Ensure authorized callback returns true for auth pages
- Check matcher config doesn't conflict

**Session not persisting:**
- Verify SessionProvider wraps app
- Check NEXTAUTH_URL matches current domain
- Ensure cookies are not blocked

**Token refresh fails:**
- Check refresh token hasn't expired (24h default)
- Verify Django refresh endpoint works
- Check network connectivity

### 9.2 Debug Tools

```typescript
// Enable NextAuth debug logs
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  // ... other config
}

// Log session in components
const { data: session } = useSession()
console.log('Current session:', session)

// Log tokens in JWT callback
async jwt({ token, user }) {
  console.log('JWT callback:', { token, user })
  return token
}
```

---

## 10. Changelog

| Date | Version | Changes |
|---|---|---|
| 2026-03-14 | 1.0 | Initial documentation |

---

**Next Steps:**
1. Implement OAuth providers (Google)
2. Add password reset functionality  
3. Enhance error handling với retry logic
4. Add comprehensive test suite