import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Playfair_Display } from 'next/font/google'
import { cn } from '@/lib/utils'

const playfair = Playfair_Display({ subsets: ['latin'] })

const comparisonData = {
  title: "Why Choose Flowify?",
  subtitle: "Compare our solution with traditional methods",
  options: [
    {
      title: "Traditional Methods",
      subtitle: "Spreadsheets & Manual Tracking",
      features: [
        { text: "Manual data entry", included: false },
        { text: "Limited insights", included: false },
        { text: "Time-consuming", included: false },
        { text: "Error-prone", included: false },
        { text: "No real-time updates", included: false },
        { text: "Basic reporting", included: false }
      ]
    },
    {
      title: "Flowify Platform",
      subtitle: "Smart Financial Management",
      isRecommended: true,
      features: [
        { text: "Automated transaction tracking", included: true },
        { text: "AI-powered insights", included: true },
        { text: "Real-time synchronization", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Smart categorization", included: true },
        { text: "Comprehensive reporting", included: true }
      ]
    }
  ],
  certifications: [
    { name: "IATA", icon: "icon-iata.png" },
    { name: "GDPR", icon: "icon-gdpr.png" },
    { name: "PCI DSS", icon: "icon-pci-dss.png" }
  ]
}

export function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4",
            playfair.className
          )}>
            {comparisonData.title}
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {comparisonData.subtitle}
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {comparisonData.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "relative bg-[#FFFFFF] rounded-2xl p-8 shadow-lg border",
                option.isRecommended ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20" : "border-[#EAEAEA]"
              )}
            >
              {/* Recommended Badge */}
              {option.isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#E8F5E9] text-green-700 px-4 py-2 text-sm font-medium">
                    <Image
                      src="/images/why_chose_us_section/icon-star-green.png"
                      alt="Star"
                      width={16}
                      height={16}
                      className="w-4 h-4 mr-2"
                    />
                    Recommended
                  </Badge>
                </div>
              )}

              {/* Card Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
                  {option.title}
                </h3>
                <p className="text-[#6B7280]">
                  {option.subtitle}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {option.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {feature.included ? (
                        <Image
                          src="/images/why_chose_us_section/icon-check-gold.jpg"
                          alt="Check"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#EAEAEA]"></div>
                      )}
                    </div>
                    <span className={cn(
                      "text-sm",
                      feature.included ? "text-[#1F2937]" : "text-[#6B7280]"
                    )}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Security Badge for Recommended Option */}
              {option.isRecommended && (
                <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
                  <div className="flex items-center justify-center space-x-2">
                    <Image
                      src="/images/why_chose_us_section/icon-shield-check-gold.png"
                      alt="Security"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium text-[#1F2937]">
                      Enterprise-grade security
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="text-center">
          <p className="text-sm font-medium text-[#6B7280] mb-6 uppercase tracking-wider">
            Trusted & Certified
          </p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            {comparisonData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-center">
                <Image
                  src={`/images/why_chose_us_section/${cert.icon}`}
                  alt={cert.name}
                  width={60}
                  height={40}
                  className="h-10 w-auto grayscale hover:grayscale-0 transition-all duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}