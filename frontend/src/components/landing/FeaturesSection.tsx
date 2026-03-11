import { LANDING_CONTENT } from '@/lib/constants'

export function FeaturesSection() {
  const { features } = LANDING_CONTENT

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to manage your finances
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to simplify your financial life and help you make better money decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}