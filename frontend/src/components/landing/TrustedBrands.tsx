import Image from 'next/image'
import { LANDING_CONTENT } from '@/lib/constants'

export function TrustedBrands() {
  const { trustedBrands } = LANDING_CONTENT

  return (
    <section className="py-16 bg-[#FFFFFF] border-t border-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider">
            Trusted by leading companies
          </p>
        </div>
        
        {/* Logo ticker - Desktop */}
        <div className="hidden md:flex items-center justify-center gap-12 opacity-60">
          {trustedBrands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center hover:opacity-100 transition-opacity duration-200"
            >
              <Image 
                src={`/images/landing/logo-${brand.toLowerCase()}.svg`}
                alt={brand}
                width={120}
                height={32}
                className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-200"
              />
            </div>
          ))}
        </div>

        {/* Logo grid - Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-8 opacity-60">
          {trustedBrands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
            >
              <Image 
                src={`/images/landing/logo-${brand.toLowerCase()}.svg`}
                alt={brand}
                width={90}
                height={24}
                className="h-6 w-auto grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}