// Middleware - Bảo vệ routes và redirect logic
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Redirect root to dashboard if authenticated
    if (pathname === '/' && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect root to login if not authenticated
    if (pathname === '/' && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to auth pages without token
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

        // Allow access to other pages
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