// Authentication types
import type { Session as NextAuthSession, User as NextAuthUser } from 'next-auth'

// ===== AUTH TYPES =====
export interface AuthUser {
  id: string
  email: string
  name?: string
}

export interface Session extends NextAuthSession {
  user: AuthUser
  accessToken?: string
  refreshToken?: string
}

// Extend NextAuth User type
export interface ExtendedUser extends NextAuthUser {
  accessToken?: string
  refreshToken?: string
}