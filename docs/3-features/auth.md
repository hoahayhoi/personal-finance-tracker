> 🤖 **Agent:** Đọc file này **chỉ khi** implement hoặc test feature `auth` (`/login`, `/register`). Bỏ qua nếu làm feature khác.
> ✏️ **Update khi:** Thay đổi logic auth, dependency, hoặc DoD.

# 🔐 Feature: Authentication — Personal Finance Tracker

**Feature ID:** FT-AUTH  
**Routes:** `/register`, `/login`  
**Priority:** Must Have  
**Status:** 📋 Documented — Chưa implement  
**Phụ thuộc:** Auth.js v4 stable (NextAuth), Prisma `User` model, Seed danh mục mặc định

---

## 1. Mô tả tổng quan

Module Authentication xử lý toàn bộ vòng đời xác thực người dùng: đăng ký tài khoản mới, đăng nhập, bảo vệ route, và đăng xuất. Đây là **nền tảng bắt buộc** cho mọi module khác trong app.

### Mục tiêu

| # | Mục tiêu | Mô tả |
|---|---|---|
| AUTH-G1 | Xác thực an toàn | Password được hash (bcrypt), không lưu plain-text |
| AUTH-G2 | Session management | Auth.js quản lý session tự động |
| AUTH-G3 | Route protection | Middleware block toàn bộ route `/dashboard/*` |
| AUTH-G4 | Onboarding | Tự tạo danh mục mặc định ngay khi user đăng ký |

---

## 2. Functional Requirements

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-A01 | Đăng ký | Tạo tài khoản mới bằng email + password | Must Have |
| FR-A02 | Đăng nhập | Xác thực bằng email + password | Must Have |
| FR-A03 | Đăng xuất | Kết thúc session, clear cookie | Must Have |
| FR-A04 | Bảo vệ route | Redirect về `/login` nếu chưa xác thực | Must Have |
| FR-A05 | OAuth Login | Đăng nhập bằng Google (tuỳ chọn) | Should Have |

---

## 3. User Stories & Acceptance Criteria

### US-A01: Đăng ký tài khoản

> As a **new user**, I want to **register with email and password**, so that **I can start tracking my finances**.

**Acceptance Criteria:**
- Given tôi chưa có tài khoản, When tôi nhập email + password hợp lệ và submit, Then tài khoản được tạo + danh mục mặc định được seed + redirect về `/dashboard`
- Given email đã tồn tại, When tôi submit form, Then hiển thị lỗi "Email đã được sử dụng"
- Given password < 8 ký tự, When tôi submit form, Then hiển thị lỗi validation ngay tại field
- Given confirm password không khớp, When tôi submit, Then hiển thị lỗi "Mật khẩu không khớp"

**Fields:**

| Field | Kiểu | Validation |
|---|---|---|
| Name | String | Bắt buộc, min 2 ký tự |
| Email | String | Bắt buộc, format email hợp lệ, unique |
| Password | String | Bắt buộc, min 8 ký tự |
| Confirm Password | String | Phải khớp với Password |

---

### US-A02: Đăng nhập

> As a **registered user**, I want to **log in with my email and password**, so that **I can access my financial data**.

**Acceptance Criteria:**
- Given thông tin đúng, When tôi nhập email + password và submit, Then redirect về `/dashboard`
- Given sai email hoặc password, When tôi submit, Then hiển thị lỗi "Email hoặc mật khẩu không đúng" (không nói rõ cái nào sai — bảo mật)
- Given tôi chưa đăng nhập, When tôi truy cập `/dashboard`, Then bị redirect về `/login`
- Given tôi đã đăng nhập, When tôi truy cập `/login`, Then bị redirect về `/dashboard`

---

### US-A03: Đăng xuất

> As a **logged-in user**, I want to **sign out**, so that **my account is secure on shared devices**.

**Acceptance Criteria:**
- Given tôi click "Sign Out", When action hoàn thành, Then session bị xóa và redirect về `/`
- Given tôi đã đăng xuất, When tôi nhấn Back, Then không thể vào lại trang protected

---

## 4. UI/UX Screen Specification

### Trang `/register`

```
┌─────────────────────────────────┐
│      🏦 Finance Tracker         │
│                                 │
│  Tạo tài khoản mới              │
│  ┌─────────────────────────┐    │
│  │ Tên hiển thị            │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Email                   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Mật khẩu          👁    │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Xác nhận mật khẩu  👁   │    │
│  └─────────────────────────┘    │
│  [    Đăng ký ngay    ]         │
│                                 │
│  Đã có tài khoản? Đăng nhập     │
└─────────────────────────────────┘
```

### Trang `/login`

```
┌─────────────────────────────────┐
│      🏦 Finance Tracker         │
│                                 │
│  Đăng nhập                      │
│  ┌─────────────────────────┐    │
│  │ Email                   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Mật khẩu          👁    │    │
│  └─────────────────────────┘    │
│  [      Đăng nhập     ]         │
│                                 │
│  Chưa có tài khoản? Đăng ký     │
└─────────────────────────────────┘
```

### Component breakdown

| Component | File đề xuất | Mô tả |
|---|---|---|
| `<RegisterForm />` | `components/auth/RegisterForm.tsx` | Form đăng ký với validation |
| `<LoginForm />` | `components/auth/LoginForm.tsx` | Form đăng nhập |
| Register page | `app/(auth)/register/page.tsx` | Page wrapper |
| Login page | `app/(auth)/login/page.tsx` | Page wrapper |
| Auth layout | `app/(auth)/layout.tsx` | Layout centered, không có sidebar |

---

## 5. Logic Flow

### Đăng ký

```
User submit /register
      │
      ▼
Server Action: validateInput()
      │
   ┌──┴──┐
 Lỗi  Hợp lệ
   │      │
   ▼      ▼
return  bcrypt.hash(password)
errors       │
             ▼
        prisma.user.create()
             │
             ▼
        seedDefaultCategories(userId)
             │
             ▼
        signIn() → redirect /dashboard
```

### Middleware bảo vệ route

```ts
// middleware.ts
export function middleware(req: NextRequest) {
  const session = await getSession(req) // Auth.js helper
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard')
    || req.nextUrl.pathname.startsWith('/transactions')
    || req.nextUrl.pathname.startsWith('/categories')
    || req.nextUrl.pathname.startsWith('/profile')

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (req.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
}
```

---

## 6. API Endpoints

| Method | Path | Mô tả | Auth |
|---|---|---|---|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handler | Public |

> Đăng ký dùng **Server Action**, không phải Route Handler.

---

## 7. Data Schema liên quan

```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  name           String?
  hashedPassword String?  // null nếu OAuth
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  transactions   Transaction[]
  categories     Category[]
}
```

---

## 8. Risks & Considerations

| # | Rủi ro | Mức độ | Mitigation |
|---|---|---|---|
| R1 | Brute force login | Medium | Rate limiting (middleware hoặc API) |
| R2 | Session expiry trong lúc dùng | Low | Handle redirect gracefully, set maxAge hợp lý |
| R3 | Email case-sensitivity | Low | Lowercase email trước khi lưu DB |

---

## 9. Definition of Done

- [ ] Form `/register` validate client-side + server-side
- [ ] Password được hashed bằng bcrypt trước khi lưu
- [ ] Đăng ký thành công → seed 13 danh mục mặc định → redirect `/dashboard`
- [ ] Form `/login` xác thực đúng, redirect `/dashboard`
- [ ] Sai thông tin hiển thị lỗi không tiết lộ field nào sai
- [ ] Middleware block toàn bộ route protected khi chưa login
- [ ] Đã login truy cập `/login` → redirect `/dashboard`
- [ ] Sign Out xóa session + redirect `/`
