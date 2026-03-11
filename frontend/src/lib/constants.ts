// Global Design System Colors
export const GLOBAL_COLORS = {
  primary: '#8B5CF6',        // Tím chủ đạo (Thương hiệu)
  background: '#FFFFFF',     // Nền trang mặc định
  textMain: '#1A1A1A',       // Text đen/xám than
  textMuted: '#888888',      // Text xám nhạt
  accentGold: '#C19B4C',     // Vàng/cam highlight dùng chung
  accentGreen: '#2E8B57',    // Xanh lá báo hiệu tích cực dùng chung
  
  // Header specific colors
  headerBgTop: '#FFFFFF',    // Nền trắng hàng trên
  headerBgBottom: '#F4F6F8', // Nền xám nhạt hàng dưới
  primaryOrange: '#F8931F',  // Màu cam cho nút 'Apply Now'
  searchBg: '#F3F4F6',       // Nền xám nhạt của ô input search
  searchBorder: '#D1D5DB'    // Màu viền của nút search
} as const

export const LANDING_CONTENT = {
  hero: {
    badge: 'TAKE CONTROL OF YOUR FINANCES',
    title: 'Simplify your money management in minutes',
    subtitle: '',
    description: 'A smarter way to track spending, organize income, and stay in control of your financial activity—without complexity.',
    ctaPrimary: 'Book a Demo',
    ctaSecondary: 'Learn More',
    socialProof: '1M+ Trusted users worldwide (4.8/5 stars)'
  },
  whyChooseUs: {
    title: "Why Choose Flowify?",
    subtitle: "Compare our solution with traditional methods",
    traditional: {
      title: "Traditional Methods",
      subtitle: "Spreadsheets & Manual Tracking",
      features: [
        "Manual data entry",
        "Limited insights", 
        "Time-consuming",
        "Error-prone",
        "No real-time updates",
        "Basic reporting"
      ]
    },
    flowify: {
      title: "Flowify Platform",
      subtitle: "Smart Financial Management",
      features: [
        "Automated transaction tracking",
        "AI-powered insights",
        "Real-time synchronization", 
        "Advanced analytics",
        "Smart categorization",
        "Comprehensive reporting"
      ]
    }
  },
  features: [
    {
      icon: '📊',
      title: 'Track Your Spending',
      description: 'Monitor every transaction with intuitive categorization and real-time insights'
    },
    {
      icon: '💰',
      title: 'Organize Income',
      description: 'Streamline your revenue streams and understand your earning patterns'
    },
    {
      icon: '📈',
      title: 'Visual Analytics',
      description: 'Beautiful charts and reports that make financial data easy to understand'
    },
    {
      icon: '🎯',
      title: 'Smart Goals',
      description: 'Set and track financial goals with intelligent recommendations'
    }
  ],
  trustedBrands: [
    'Catalog',
    'Capsule', 
    'Biosynthesis',
    'Epicurious',
    'Interlock',
    'Nietzsche'
  ]
} as const