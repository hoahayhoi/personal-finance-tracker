import { LANDING_CONTENT } from '@/lib/constants'

export function TrustedBrands() {
  const { trustedBrands } = LANDING_CONTENT

  return (
    <section className="py-16 border-t bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted by leading companies
          </p>
        </div>
        
        {/* Logo ticker */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          {trustedBrands.map((brand, index) => (
            <div
              key={index}
              className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}