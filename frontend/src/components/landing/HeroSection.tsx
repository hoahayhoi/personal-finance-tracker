import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LANDING_CONTENT } from '@/lib/constants'

export function HeroSection() {
  const { hero } = LANDING_CONTENT

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#FFFFFF]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Left */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <Badge variant="secondary" className="inline-flex px-4 py-2 text-xs font-medium uppercase tracking-wider bg-gray-100 text-[#888888] hover:bg-gray-200">
              {hero.badge}
            </Badge>

            {/* Typography */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                {hero.title}
              </h1>
              <p className="text-lg md:text-xl text-[#888888] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {hero.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="px-8 py-3 text-base bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white" asChild>
                <Link href="/register">
                  {hero.ctaPrimary}
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="px-8 py-3 text-base border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10" asChild>
                <Link href="/login">
                  {hero.ctaSecondary}
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Image 
                    key={i}
                    src="/images/icons/ic-star.svg" 
                    alt="Star" 
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                ))}
              </div>
              <p className="text-sm text-[#888888]">
                {hero.socialProof}
              </p>
            </div>
          </div>

          {/* Content Right - Visual Mockup */}
          <div className="relative">
            <div className="relative max-w-lg mx-auto lg:max-w-none">
              {/* Glassmorphism container */}
              <div className="relative">
                {/* Main Balance Card */}
                <div className="relative z-10 bg-white/40 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <Image 
                    src="/images/landing/mockup-balance.svg" 
                    alt="Main Balance Card" 
                    width={400}
                    height={240}
                    className="w-full h-auto"
                  />
                </div>

                {/* Yearly Spent Chart - positioned top right */}
                <div className="absolute -top-4 -right-4 z-20 bg-white/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl">
                  <Image 
                    src="/images/landing/mockup-chart.svg" 
                    alt="Yearly Spent Chart" 
                    width={128}
                    height={96}
                    className="w-32 h-auto"
                  />
                </div>

                {/* Transaction Notification - positioned left */}
                <div className="absolute top-1/2 -left-6 z-20 bg-white/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl">
                  <Image 
                    src="/images/landing/mockup-notification.svg" 
                    alt="Transaction Notification" 
                    width={160}
                    height={120}
                    className="w-40 h-auto"
                  />
                </div>

                {/* Visa Card - positioned bottom right */}
                <div className="absolute -bottom-6 -right-2 z-20 bg-white/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl">
                  <Image 
                    src="/images/landing/mockup-visa.svg" 
                    alt="Visa Card" 
                    width={144}
                    height={90}
                    className="w-36 h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}