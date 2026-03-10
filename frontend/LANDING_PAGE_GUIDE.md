# Landing Page Implementation Guide - Personal Finance Tracker

Hướng dẫn implement Landing Page cho frontend Next.js theo spec `docs/3-features/landing-page.md`.

## Overview

- **Route**: `/` (root page)
- **Auth**: Public (không cần login)
- **Smart Redirect**: User đã đăng nhập → auto redirect `/dashboard`
- **Layout**: Full-page, không dùng Dashboard Layout
- **SEO**: Metadata đầy đủ cho search engines

---

## 1. Project Structure

### Files cần tạo/sửa:

```
frontend/src/
├── app/
│   ├── page.tsx                    # Landing page (root route)
│   └── layout.tsx                  # Update metadata
├── components/
│   └── landing/
│       ├── Navbar.tsx              # Minimal navbar
│       ├── HeroSection.tsx         # Hero với CTA buttons
│       └── FeaturesSection.tsx     # 3-4 feature cards
├── middleware.ts                   # Smart redirect logic
└── lib/
    └── constants.ts                # Landing page content
```

---

## 2. Smart Redirect Implementation

### Update `middleware.ts`

```typescript
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  // Smart redirect: nếu user đã login và truy cập "/", redirect về dashboard
  if (req.nextUrl.pathname === '/') {
    const token = req.cookies.get('next-auth.session-token') || 
                  req.cookies.get('__Secure-next-auth.session-token')
    
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Protected routes middleware (existing logic)
  return withAuth(req as any, {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  })
}

export const config = {
  matcher: [
    '/',                    // Add root route
    '/dashboard/:path*',
    '/transactions/:path*',
    '/categories/:path*',
    '/profile/:path*'
  ]
}
```

---

## 3. Landing Page Content

### Create `lib/constants.ts`

```typescript
export const LANDING_CONTENT = {
  hero: {
    title: 'Quản lý tài chính cá nhân',
    subtitle: 'dễ dàng và trực quan',
    description: 'Theo dõi thu chi, phân loại giao dịch, và visualize tài chính cá nhân bằng biểu đồ trực quan.',
    ctaPrimary: 'Bắt đầu miễn phí',
    ctaSecondary: 'Đăng nhập'
  },
  features: [
    {
      icon: '📊',
      title: 'Theo dõi thu chi',
      description: 'Ghi lại mọi giao dịch hằng ngày một cách dễ dàng'
    },
    {
      icon: '💸',
      title: 'Phân loại giao dịch',
      description: 'Tự động phân loại theo danh mục để quản lý tốt hơn'
    },
    {
      icon: '📈',
      title: 'Visualize tài chính',
      description: 'Xem báo cáo trực quan bằng biểu đồ và thống kê'
    }
  ]
} as const
```

---

## 4. Landing Page Components

### Create `components/landing/Navbar.tsx`

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🏦</span>
          <span className="font-bold text-xl">Finance Tracker</span>
        </Link>

        {/* CTA */}
        <Button asChild>
          <Link href="/login">Đăng nhập</Link>
        </Button>
      </div>
    </nav>
  )
}
```

### Create `components/landing/HeroSection.tsx`

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LANDING_CONTENT } from '@/lib/constants'

export function HeroSection() {
  const { hero } = LANDING_CONTENT

  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
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
          <Button size="lg" asChild>
            <Link href="/register">
              🚀 {hero.ctaPrimary}
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">
              {hero.ctaSecondary} →
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

### Create `components/landing/FeaturesSection.tsx`

```tsx
import { LANDING_CONTENT } from '@/lib/constants'

export function FeaturesSection() {
  const { features } = LANDING_CONTENT

  return (
    <section className="container py-24 bg-muted/50">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className="text-4xl mb-4">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 5. Main Landing Page

### Update `app/page.tsx`

```tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'

export const metadata: Metadata = {
  title: 'Personal Finance Tracker — Quản lý tài chính cá nhân',
  description: 'Theo dõi thu chi, phân loại giao dịch, và visualize tài chính cá nhân bằng biểu đồ trực quan.',
  openGraph: {
    title: 'Personal Finance Tracker',
    description: 'Quản lý tài chính cá nhân dễ dàng và trực quan.',
    type: 'website',
    url: 'https://your-domain.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Finance Tracker',
    description: 'Quản lý tài chính cá nhân dễ dàng và trực quan.',
  }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  )
}
```

---

## 6. Layout Updates

### Update `app/layout.tsx` (if needed)

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Personal Finance Tracker',
    template: '%s | Personal Finance Tracker'
  },
  description: 'Quản lý tài chính cá nhân dễ dàng và trực quan',
  keywords: ['tài chính', 'quản lý tiền', 'thu chi', 'personal finance'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
```

---

## 7. Responsive Design

### Mobile-First Approach

```tsx
// Example responsive classes used in components above:

// HeroSection
<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
<div className="mt-10 flex items-center justify-center gap-4 flex-col sm:flex-row">

// FeaturesSection  
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

// Navbar
<div className="container flex h-16 items-center justify-between">
```

### Test Breakpoints:
- **Mobile**: 375px (iPhone SE)
- **Tablet**: 768px (iPad)
- **Desktop**: 1280px (Standard)

---

## 8. Dark Mode Support

Components sử dụng Tailwind classes tương thích dark mode:

```tsx
// Background colors
className="bg-background/95 backdrop-blur"
className="bg-muted/50"

// Text colors  
className="text-muted-foreground"
className="text-primary"

// Border
className="border-b"
```

---

## 9. SEO Optimization

### Structured Data (Optional)

Thêm vào `app/page.tsx`:

```tsx
export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Personal Finance Tracker',
    description: 'Quản lý tài chính cá nhân dễ dàng và trực quan',
    url: 'https://your-domain.com',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        {/* Components */}
      </div>
    </>
  )
}
```

---

## 10. Performance Optimization

### Image Optimization (if using images later)

```tsx
import Image from 'next/image'

// Use Next.js Image component
<Image
  src="/hero-image.jpg"
  alt="Personal Finance Dashboard"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

### Font Optimization

```tsx
// Already implemented in layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

---

## 11. Testing Checklist

### Functionality Tests:

- [ ] Route `/` hiển thị Landing Page (user chưa login)
- [ ] Route `/` redirect `/dashboard` (user đã login)
- [ ] Click "Bắt đầu miễn phí" → `/register`
- [ ] Click "Đăng nhập" → `/login`
- [ ] Navbar logo click → reload trang

### Responsive Tests:

- [ ] Mobile 375px: Layout không bị overflow
- [ ] Tablet 768px: Features grid 1 column → 3 columns
- [ ] Desktop 1280px: CTA buttons horizontal alignment

### SEO Tests:

- [ ] `<title>` tag đúng format
- [ ] `<meta description>` có nội dung
- [ ] Open Graph tags complete
- [ ] No console errors

---

## 12. Implementation Steps

### Step 1: Setup Structure

```bash
# Tạo folders
mkdir -p frontend/src/components/landing

# Tạo files
touch frontend/src/components/landing/Navbar.tsx
touch frontend/src/components/landing/HeroSection.tsx  
touch frontend/src/components/landing/FeaturesSection.tsx
touch frontend/src/lib/constants.ts
```

### Step 2: Copy Code

1. Copy code từ guide này vào từng file
2. Update `middleware.ts` với smart redirect logic
3. Update `app/page.tsx` với landing page content

### Step 3: Test Flow

```bash
# Start development server
npm run dev

# Test scenarios:
# 1. Visit "/" without login → see landing page
# 2. Login → visit "/" → auto redirect to dashboard  
# 3. Test CTA buttons navigation
# 4. Test responsive on different screen sizes
```

### Step 4: Verify SEO

```bash
# Check metadata
curl -I http://localhost:3000

# Test Open Graph
# Use: https://developers.facebook.com/tools/debug/
```

---

## 13. Customization Options

### Brand Colors

Update `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#your-brand-color',
          // ... other shades
        }
      }
    }
  }
}
```

### Content Updates

Edit `lib/constants.ts`:

```typescript
export const LANDING_CONTENT = {
  hero: {
    title: 'Your Custom Title',
    // ... update content
  }
}
```

---

## 14. Advanced Features (Optional)

### Animations

```bash
npm install framer-motion
```

```tsx
'use client'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Content */}
    </motion.section>
  )
}
```

### Analytics

```tsx
// Add to app/page.tsx
import { Analytics } from '@vercel/analytics/react'

export default function LandingPage() {
  return (
    <>
      {/* Content */}
      <Analytics />
    </>
  )
}
```

---

## 15. Deployment Notes

### Environment Variables

```env
# .env.local
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_DJANGO_API_URL=https://your-api-domain.com
```

### Build Check

```bash
npm run build
npm run start

# Test production build locally
```

---

## 16. Troubleshooting

### Common Issues:

1. **Redirect Loop**: Check middleware matcher patterns
2. **Layout Flash**: Ensure middleware runs before page render
3. **CTA Links 404**: Verify auth pages exist
4. **Mobile Overflow**: Check container max-widths

### Debug Tips:

```typescript
// Add to middleware.ts for debugging
console.log('Pathname:', req.nextUrl.pathname)
console.log('Has token:', !!token)
```

---

## Next Steps

1. Add hero background image/gradient
2. Implement testimonials section
3. Add pricing section (if needed)
4. A/B test different CTA copy
5. Add contact/support links
6. Implement newsletter signup