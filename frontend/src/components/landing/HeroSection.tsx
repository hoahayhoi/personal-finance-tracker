import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LANDING_CONTENT } from '@/lib/constants'

export function HeroSection() {
  const { hero } = LANDING_CONTENT

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      
      <div className="container mx-auto max-w-4xl text-center relative">
        {/* Badge */}
        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
          {hero.badge}
        </Badge>

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {hero.title}
          <br />
          <span className="text-primary">{hero.subtitle}</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          {hero.description}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex items-center justify-center gap-4 flex-col sm:flex-row">
          <Button size="lg" className="px-8 py-3 text-base" asChild>
            <Link href="/register">
              {hero.ctaPrimary}
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="px-8 py-3 text-base" asChild>
            <Link href="/login">
              {hero.ctaSecondary}
            </Link>
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mt-12">
          <p className="text-sm text-muted-foreground">
            {hero.socialProof}
          </p>
        </div>
      </div>
    </section>
  )
}