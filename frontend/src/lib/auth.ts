import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerSession } from 'next-auth/next'
import type { 
  DjangoLoginApiResponse, 
  DjangoRefreshApiResponse, 
  DjangoProfileApiResponse 
} from '@/types/django-api'

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

          const data: DjangoLoginApiResponse = await response.json()

          if (!response.ok || !data.success) {
            return null
          }

          // Get user profile with access token
          const profileResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/profile/`, {
            headers: {
              'Authorization': `Bearer ${data.data?.access}`,
            },
          })

          const profileData: DjangoProfileApiResponse = await profileResponse.json()

          if (!profileResponse.ok || !profileData.success || !profileData.data) {
            return null
          }

          return {
            id: profileData.data.id.toString(),
            email: profileData.data.email,
            name: profileData.data.full_name || profileData.data.first_name || undefined,
            accessToken: data.data?.access,
            refreshToken: data.data?.refresh,
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
      if (user && user.accessToken && user.refreshToken) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      // Check if access token is expired and refresh it
      if (token.accessToken && typeof token.accessToken === 'string') {
        try {
          // Decode JWT to check expiration (optional)
          const payload = JSON.parse(atob(token.accessToken.split('.')[1]))
          const currentTime = Math.floor(Date.now() / 1000)
          
          // If token expires in next 5 minutes, refresh it
          if (payload.exp - currentTime < 300 && token.refreshToken) {
            const refreshResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/token/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refresh: token.refreshToken,
              }),
            })

            const refreshData: DjangoRefreshApiResponse = await refreshResponse.json()

            if (refreshResponse.ok && refreshData.success && refreshData.data) {
              token.accessToken = refreshData.data.access
              // Refresh token API chỉ trả về access token mới, giữ nguyên refresh token cũ
            }
          }
        } catch (error) {
          console.error('Token refresh error:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      if (token.refreshToken) {
        session.refreshToken = token.refreshToken
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}

// Helper function để get session trong Server Components và Server Actions
export async function getSession() {
  return await getServerSession(authOptions)
}

// Helper function để get user từ session
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

// Helper function để get access token
export async function getAccessToken() {
  const session = await getSession()
  return session?.accessToken
}