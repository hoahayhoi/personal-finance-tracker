# 📊 Progress Tracker — Personal Finance Tracker

> **Living Document** — Cập nhật thường xuyên trong suốt quá trình phát triển.  
> Ngày khởi tạo: 2026-03-09 | Phiên bản mục tiêu: 1.0.0

---

## Tổng tiến độ

| Phase | Tổng tasks | Hoàn thành | Tiến độ |
|---|---|---|---|
| Phase 0 — Setup | 5 | 0 | 0% |
| Phase 1 — Auth | 6 | 0 | 0% |
| Phase 2 — Landing Page | 5 | 5 | 100% |
| Phase 3 — Dashboard | 7 | 0 | 0% |
| Phase 4 — Transactions | 9 | 0 | 0% |
| Phase 5 — Categories | 5 | 0 | 0% |
| Phase 6 — Profile | 3 | 0 | 0% |
| Phase 7 — Polish & Deploy | 6 | 0 | 0% |
| **Tổng** | **46** | **5** | **11%** |

> **Cách cập nhật:** Đổi `[ ]` → `[x]` khi hoàn thành, cập nhật số liệu ở bảng trên.

---

## Phase 0 — Project Setup

| # | Task | Status | Ghi chú |
|---|---|---|---|
| 0.1 | Khởi tạo Next.js project (`npx create-next-app`) | [ ] | |
| 0.2 | Cài đặt dependencies (Prisma, Auth.js, Recharts...) | [ ] | |
| 0.3 | Cấu hình ESLint, Prettier, TypeScript strict | [ ] | |
| 0.4 | Kết nối Neon.tech PostgreSQL (env vars) | [ ] | |
| 0.5 | Khởi tạo Prisma schema + `db push` | [ ] | |

---

## Phase 1 — Authentication

| # | Task | FR | Status | Ghi chú |
|---|---|---|---|---|
| 1.1 | Cài đặt và cấu hình Auth.js v4 stable | FR-A02 | [ ] | |
| 1.2 | Trang `/register` — form + server action | FR-A01 | [ ] | |
| 1.3 | Trang `/login` — form + `signIn()` | FR-A02 | [ ] | |
| 1.4 | Middleware bảo vệ route `/dashboard/*` | FR-A04 | [ ] | |
| 1.5 | Seed danh mục mặc định khi đăng ký | FR-C05 | [ ] | |
| 1.6 | Nút Sign Out hoạt động | FR-A03 | [ ] | |

---

## Phase 2 — Landing Page ⭐ (Ưu tiên cao)

| # | Task | FR | Status | Ghi chú |
|---|---|---|---|---|
| 2.1 | Tạo route `/` — page.tsx + metadata SEO | FR-LP06 | [x] | Hoàn thành với full SEO metadata |
| 2.2 | Middleware redirect `/` → `/dashboard` nếu đã login | FR-LP01 | [x] | Smart redirect logic implemented |
| 2.3 | Component `<HeroSection />` — tagline + 2 CTA | FR-LP02 | [x] | CTA buttons link to /register và /login |
| 2.4 | Component `<FeaturesSection />` — 3 feature cards | FR-LP03 | [x] | 3 feature cards với icons |
| 2.5 | Responsive layout (mobile 375px + desktop 1280px) | FR-LP07 | [x] | Mobile-first responsive design |

---

## Phase 3 — Dashboard

| # | Task | FR | Status | Ghi chú |
|---|---|---|---|---|
| 3.1 | Layout sidebar/bottom nav cho app | — | [ ] | |
| 3.2 | API lấy summary (số dư, thu, chi theo tháng) | FR-D01~03 | [ ] | |
| 3.3 | Summary Cards component | FR-D01~03 | [ ] | |
| 3.4 | Month Selector component | FR-D07 | [ ] | |
| 3.5 | Line Chart — thu/chi theo ngày (Recharts) | FR-D04 | [ ] | |
| 3.6 | Pie Chart — chi theo danh mục (Recharts) | FR-D05 | [ ] | |
| 3.7 | Recent Transactions (5 giao dịch gần nhất) | FR-D06 | [ ] | |

---

## Phase 4 — Transactions

| # | Task | FR | Status | Ghi chú |
|---|---|---|---|---|
| 4.1 | API GET `/api/transactions` + pagination | FR-T01, T09 | [ ] | |
| 4.2 | Trang `/transactions` — bảng danh sách | FR-T01 | [ ] | |
| 4.3 | Filter Bar — tháng, loại, danh mục | FR-T05~07 | [ ] | |
| 4.4 | Modal/Form thêm giao dịch | FR-T02 | [ ] | |
| 4.5 | Server Action `createTransaction` | FR-T02 | [ ] | |
| 4.6 | Modal/Form sửa giao dịch (pre-filled) | FR-T03 | [ ] | |
| 4.7 | Server Action `updateTransaction` | FR-T03 | [ ] | |
| 4.8 | Confirm dialog xóa giao dịch | FR-T04 | [ ] | |
| 4.9 | Server Action `deleteTransaction` | FR-T04 | [ ] | |

---

## Phase 5 — Categories

| # | Task | FR | Status | Ghi chú |
|---|---|---|---|---|
| 5.1 | API GET `/api/categories` | FR-C01 | [ ] | |
| 5.2 | Trang `/categories` — Category Grid | FR-C01 | [ ] | |
| 5.3 | Modal thêm danh mục | FR-C02 | [ ] | |
| 5.4 | Modal sửa danh mục | FR-C03 | [ ] | |
| 5.5 | Xóa danh mục (có validate no transaction) | FR-C04 | [ ] | |

---

## Phase 6 — Profile

| # | Task | FR | Status | Ghi chú |
|---|---|---|---|---|
| 6.1 | Trang `/profile` — hiển thị thông tin | FR-P01 | [ ] | |
| 6.2 | Form đổi tên hiển thị | FR-P02 | [ ] | |
| 6.3 | Form đổi mật khẩu | FR-P03 | [ ] | |

---

## Phase 7 — Polish & Deploy

| # | Task | Status | Ghi chú |
|---|---|---|---|
| 7.1 | Error handling toàn app (toast notifications) | [ ] | |
| 7.2 | Loading skeletons cho các trang có data fetch | [ ] | |
| 7.3 | Empty states (dashboard, transactions, categories) | [ ] | |
| 7.4 | Kiểm tra responsive tất cả màn hình | [ ] | |
| 7.5 | Deploy lên Vercel + cấu hình env vars | [ ] | |
| 7.6 | Smoke test trên production URL | [ ] | |

---

## Changelog

> Ghi lại các thay đổi đáng kể theo ngày.

| Ngày | Loại | Mô tả |
|---|---|---|
| 2026-03-09 | 📋 Docs | Khởi tạo Progress Tracker |
| 2026-03-09 | 📋 Docs | Tạo BA doc Feature Landing Page (`docs/features/landing_page.md`) |
| 2026-03-10 | ✅ Code | Hoàn thành Landing Page - components, middleware, SEO metadata |
| 2026-03-11 | ✅ Code | Cập nhật Landing Page v2.0 - Flowify design với glassmorphism, responsive layout |
| 2026-03-11 | ✅ Code | Thêm WhyChooseUs section - comparison table với Playfair Display font |
| 2026-03-11 | ✅ Code | Chuẩn hóa container width - tất cả sections dùng max-w-6xl |
| 2026-03-11 | ✅ Code | Header v5.1 - Two-row layout với scroll behavior, search bar, navigation |

---

## Ghi chú kỹ thuật (Technical Notes)

> Ghi lại các quyết định kỹ thuật quan trọng trong quá trình làm.

| Ngày | Quyết định | Lý do |
|---|---|---|
| 2026-03-09 | Dùng `middleware.ts` để redirect `/` thay vì client-side | Tránh layout flash, redirect xảy ra ở Edge |
| 2026-03-09 | 🔼 Priority | Landing Page được nâng lên Must Have, thực hiện ở Phase 2 (trước Dashboard) |
| 2026-03-10 | ✅ Code | Dùng Server Components cho landing page, không cần 'use client' |
| 2026-03-11 | ✅ Code | Flowify v2.0: Glassmorphism mockups, Next.js Image optimization, brand colors (#8B5CF6) |
| 2026-03-11 | ✅ Code | WhyChooseUs: Playfair Display font, comparison cards, certification badges |
| 2026-03-11 | ✅ Code | Container consistency: Tất cả sections dùng max-w-6xl cho layout thống nhất |
| 2026-03-11 | ✅ Code | Smart scroll header: Top bar ẩn khi scroll xuống, bottom nav luôn hiển thị |