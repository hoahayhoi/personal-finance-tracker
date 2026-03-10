// Landing Page - Redirect logic handled by middleware
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function HomePage() {
  const session = await getSession()
  
  // Middleware sẽ handle redirect, nhưng backup logic
  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }

  return null
}