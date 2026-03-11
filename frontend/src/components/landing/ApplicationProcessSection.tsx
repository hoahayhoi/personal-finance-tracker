import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserPlus, CreditCard, BarChart3, Target, TrendingUp, Calendar } from 'lucide-react'

export function ApplicationProcessSection() {
  const processSteps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up in seconds and connect your financial accounts securely",
      step: "01"
    },
    {
      icon: CreditCard,
      title: "Connect Banks",
      description: "Link your bank accounts and credit cards with bank-level security",
      step: "02"
    },
    {
      icon: BarChart3,
      title: "Track Automatically",
      description: "Watch as your transactions are categorized and analyzed in real-time",
      step: "03"
    },
    {
      icon: Target,
      title: "Achieve Goals",
      description: "Set financial goals and get personalized insights to reach them faster",
      step: "04"
    }
  ]

  const pricingPlans = [
    {
      type: "Basic Plan",
      duration: "Perfect for Individuals",
      price: "Free",
      features: [
        "Connect up to 2 bank accounts",
        "Basic expense tracking",
        "Monthly spending reports",
        "Mobile app access"
      ],
      popular: false
    },
    {
      type: "Pro Plan",
      duration: "Best for Families",
      price: "$9.99",
      features: [
        "Unlimited bank connections",
        "Advanced analytics & insights",
        "Goal tracking & budgeting",
        "Priority customer support",
        "Export data & custom reports"
      ],
      popular: true
    },
    {
      type: "Business Plan",
      duration: "For Small Businesses",
      price: "$29.99",
      features: [
        "Multi-user access",
        "Business expense categorization",
        "Tax preparation reports",
        "API access & integrations",
        "Dedicated account manager"
      ],
      popular: false
    }
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/landing/bg-mountain-landscape.jpg"
          alt="Financial success background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Financial Journey
          </h2>
          <p className="text-xl text-[#A0AEC0] max-w-3xl mx-auto leading-relaxed">
            Get started with Flowify in just 4 simple steps. Take control of your finances and build the future you deserve.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="relative">
                {/* Glass Card */}
                <div className="bg-[rgba(30,30,30,0.6)] backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center hover:bg-[rgba(30,30,30,0.8)] transition-all duration-300 hover:scale-105">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#C19B4C] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-[#8B5CF6]" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#A0AEC0] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line (except for last item) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-[#8B5CF6] to-transparent transform -translate-y-1/2" />
                )}
              </div>
            )
          })}
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h3>
          <p className="text-lg text-[#A0AEC0] max-w-2xl mx-auto">
            Select the perfect plan for your financial management needs. Start free and upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="relative">
              {/* Pricing Card */}
              <div className={`bg-[rgba(30,30,30,0.6)] backdrop-blur-lg border rounded-2xl p-8 text-center hover:bg-[rgba(30,30,30,0.8)] transition-all duration-300 ${
                plan.popular 
                  ? 'border-green-400/50 hover:border-green-400/70 scale-105 ring-2 ring-green-400/20' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                {/* Popular Badge - Inside card at top */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Type */}
                <h4 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-green-400 mt-4' : 'text-white'}`}>
                  {plan.type}
                </h4>
                
                {/* Duration */}
                <div className="flex items-center justify-center mb-6">
                  <TrendingUp className="w-4 h-4 text-[#8B5CF6] mr-2" />
                  <span className="text-[#A0AEC0]">{plan.duration}</span>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.price !== "Free" && (
                    <span className="text-[#A0AEC0] ml-2">/month</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-[#A0AEC0]">
                      <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#C19B4C] hover:from-[#8B5CF6]/90 hover:to-[#C19B4C]/90 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {plan.price === "Free" ? "Start Free" : `Choose ${plan.type}`}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-[rgba(30,30,30,0.6)] backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-[#8B5CF6] mr-2" />
              <span className="text-white font-semibold">Ready to Take Control?</span>
            </div>
            <p className="text-[#A0AEC0] mb-6">
              Join over 1M+ users who trust Flowify to manage their finances smarter, not harder.
            </p>
            <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#C19B4C] hover:from-[#8B5CF6]/90 hover:to-[#C19B4C]/90 text-white font-semibold px-8 py-3 rounded-lg">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}