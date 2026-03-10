// NextAuth API Route Handler
// Xử lý tất cả authentication endpoints: /api/auth/*

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Tạo handler từ authOptions đã config
const handler = NextAuth(authOptions)

// Export handler cho cả GET và POST requests
// GET: /api/auth/signin, /api/auth/session
// POST: /api/auth/signin, /api/auth/signout, /api/auth/callback
export { handler as GET, handler as POST }