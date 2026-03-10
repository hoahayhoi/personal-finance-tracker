import type { Metadata } from 'next'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { TrustedBrands } from '@/components/landing/TrustedBrands'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Flowify — Simplify your money management in minutes',
  description: 'A smarter way to track spending, organize income, and stay in control of your financial activity—without complexity.',
  keywords: ['personal finance', 'money management', 'expense tracking', 'financial planning', 'budgeting'],
  openGraph: {
    title: 'Flowify — Simplify your money management',
    description: 'A smarter way to track spending, organize income, and stay in control of your financial activity—without complexity.',
    type: 'website',
    url: 'https://flowify.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Flowify - Personal Finance Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowify — Simplify your money management',
    description: 'A smarter way to track spending, organize income, and stay in control of your financial activity—without complexity.',
    images: ['/og-image.jpg'],
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBrands />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}