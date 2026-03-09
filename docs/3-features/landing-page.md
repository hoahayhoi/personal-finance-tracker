# 🏠 Feature: Landing Page — Personal Finance Tracker

**Feature ID:** FT-LP  
**Route:** `/`  
**Priority:** Must Have *(nâng lên từ Should Have theo quyết định ngày 2026-03-09)*  
**Status:** 📋 Documented — Chưa implement  
**Phụ thuộc:** FR-A01 (Đăng ký), FR-A02 (Đăng nhập), FR-A04 (Bảo vệ route)

---

## 1. Mô tả tổng quan

Landing Page là **điểm vào đầu tiên** của ứng dụng. Người dùng chưa đăng nhập sẽ thấy trang giới thiệu app với Hero section và các CTA (Call-to-Action). Người dùng đã đăng nhập sẽ được **tự động redirect** về `/dashboard`.

### Mục tiêu

| # | Mục tiêu | Mô tả |
|---|---|---|
| LP-G1 | First impression | Truyền đạt rõ ràng app làm gì trong 5 giây đầu |
| LP-G2 | Tăng conversion | Dẫn dắt người dùng hành động: Đăng ký hoặc Đăng nhập |
| LP-G3 | Smart redirect | Không làm phiền user đã đăng nhập — redirect thẳng vào app |
| LP-G4 | Học Next.js | Luyện: `middleware`, `metadata` SEO, `Suspense`, animation |

---

## 2. Functional Requirements

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-LP01 | Smart redirect | Nếu user đã đăng nhập → redirect `/dashboard` ngay | Must Have |
| FR-LP02 | Hero section | Hiển thị tagline, mô tả ngắn, 2 CTA buttons | Must Have |
| FR-LP03 | Features section | Liệt kê 3–4 tính năng nổi bật của app | Should Have |
| FR-LP04 | CTA Đăng ký | Button "Bắt đầu miễn phí" → `/register` | Must Have |
| FR-LP05 | CTA Đăng nhập | Button "Đăng nhập" → `/login` | Must Have |
| FR-LP06 | SEO Metadata | Title, description, Open Graph tags | Should Have |
| FR-LP07 | Responsive layout | Hiển thị đúng trên mobile và desktop | Must Have |
| FR-LP08 | Dark mode support | Tương thích với dark/light mode của hệ thống | Nice to Have |

---

## 3. User Stories & Acceptance Criteria

### US-LP01: Xem Landing Page (Khách chưa đăng nhập)

> As a **guest (unauthenticated user)**, I want to **see what Personal Finance Tracker offers**, so that **I can decide whether to register**.

**Acceptance Criteria:**

- Given tôi chưa đăng nhập, When tôi truy cập `/`, Then tôi thấy Landing Page với Hero section và 2 CTA buttons
- Given tôi click "Bắt đầu miễn phí", When click, Then tôi được điều hướng đến `/register`
- Given tôi click "Đăng nhập", When click, Then tôi được điều hướng đến `/login`
- Given tôi truy cập trên mobile, When page load, Then layout hiển thị đúng, không bị overflow

---

### US-LP02: Auto-redirect (User đã đăng nhập)

> As a **logged-in user**, I want to **be automatically redirected to the dashboard when I visit the homepage**, so that **I don't have to navigate manually every time**.

**Acceptance Criteria:**

- Given tôi đã đăng nhập, When tôi truy cập `/`, Then tôi được redirect ngay về `/dashboard` mà không thấy Landing Page
- Given redirect xảy ra, When chuyển trang, Then không có flash/nhấp nháy — redirect xảy ra ở server (middleware), không ở client

---

### US-LP03: SEO & Discoverability

> As a **product owner**, I want the **landing page to be SEO-friendly**, so that **users can find the app through search engines**.

**Acceptance Criteria:**

- Given trang được load, When inspect HTML, Then `<title>` chứa tên app và tagline
- Given trang được share lên mạng xã hội, When link preview hiển thị, Then có Open Graph image, title, description

---

## 4. UI/UX Screen Specification

### Route: `/`

| Thành phần | Mô tả |
|---|---|
| **Mục đích** | Giới thiệu app, redirect nếu đã đăng nhập |
| **Auth** | Public (không cần login) |
| **Layout** | Full-page, không dùng Dashboard Layout |

### Cấu trúc trang

```
┌─────────────────────────────────────────────────────┐
│  🏦 Finance Tracker                    [Đăng nhập]  │  ← Navbar (minimal)
├─────────────────────────────────────────────────────┤
│                                                     │
│         Quản lý tài chính cá nhân                  │
│         dễ dàng và trực quan                        │  ← Hero Section
│         [Tagline phụ - 1 câu mô tả ngắn]           │
│                                                     │
│    [🚀 Bắt đầu miễn phí]  [Đăng nhập →]           │  ← CTA Buttons
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   📊 Theo dõi    💸 Phân loại    📈 Visualize      │  ← Features Section
│   thu chi        giao dịch        tài chính         │
│   hằng ngày      theo danh mục    bằng biểu đồ      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Component breakdown

| Component | File đề xuất | Mô tả |
|---|---|---|
| `<Navbar />` | `components/landing/Navbar.tsx` | Logo + nút Đăng nhập |
| `<HeroSection />` | `components/landing/HeroSection.tsx` | Headline, subtext, 2 CTA |
| `<FeaturesSection />` | `components/landing/FeaturesSection.tsx` | 3 feature cards |
| `page.tsx` | `app/(landing)/page.tsx` hoặc `app/page.tsx` | Entry point, chứa metadata |

---

## 5. Logic Redirect (Smart Redirect)

```
User truy cập "/"
        │
        ▼
middleware.ts kiểm tra session
        │
   ┌────┴────┐
   │         │
   ▼         ▼
Có session   Không có session
   │         │
   ▼         ▼
redirect   Hiển thị
/dashboard  Landing Page
```

### Cách implement (Next.js App Router)

```ts
// middleware.ts — chạy ở Edge, không tốn cold start
export function middleware(req: NextRequest) {
  const session = req.cookies.get('auth-session') // hoặc NextAuth token
  if (req.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
}
export const config = { matcher: ['/'] }
```

> **Lý do dùng middleware:** Redirect xảy ra ở server/edge, không có layout flash, trải nghiệm mượt hơn so với `useEffect` + `router.push()` ở client.

---

## 6. SEO Metadata

```ts
// app/page.tsx
export const metadata: Metadata = {
  title: 'Personal Finance Tracker — Quản lý tài chính cá nhân',
  description:
    'Theo dõi thu chi, phân loại giao dịch, và visualize tài chính cá nhân bằng biểu đồ trực quan.',
  openGraph: {
    title: 'Personal Finance Tracker',
    description: 'Quản lý tài chính cá nhân dễ dàng và trực quan.',
    type: 'website',
  },
}
```

---

## 7. Risks & Considerations

| # | Rủi ro | Mức độ | Mitigation |
|---|---|---|---|
| R1 | Redirect flash (nhấp nháy layout) | Medium | Dùng middleware thay vì client-side redirect |
| R2 | Landing page nặng, ảnh hưởng LCP | Low | Không dùng ảnh nặng, dùng SVG/icon cho Features section |
| R3 | Mobile layout bị vỡ | Low | Test sớm trên breakpoint 375px (iPhone SE) |
| R4 | SEO metadata bị thiếu | Low | Dùng Next.js `Metadata` API, kiểm tra với `og:debugger` |

---

## 8. Definition of Done (DoD)

- [ ] Route `/` trả về Landing Page cho user chưa đăng nhập
- [ ] Route `/` redirect về `/dashboard` cho user đã đăng nhập (qua middleware)
- [ ] Hero section hiển thị tagline + 2 CTA buttons
- [ ] Features section hiển thị ít nhất 3 tính năng
- [ ] Click "Bắt đầu miễn phí" → `/register`
- [ ] Click "Đăng nhập" → `/login`
- [ ] Responsive: hoạt động đúng trên mobile (375px) và desktop (1280px)
- [ ] `<title>` và `<meta description>` được set đúng
- [ ] Không có layout flash khi redirect
