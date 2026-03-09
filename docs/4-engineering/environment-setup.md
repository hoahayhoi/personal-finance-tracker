# Environment Setup — Personal Finance Tracker

> **Loại tài liệu:** Engineering
> **Cập nhật lần cuối:** 2026-03-09

Hướng dẫn setup môi trường development local từ đầu.

---

## Yêu cầu

| Tool | Version | Ghi chú |
|---|---|---|
| Node.js | ≥ 20.x LTS | Dùng `nvm` nếu cần quản lý nhiều version |
| npm / pnpm | npm ≥ 10 hoặc pnpm ≥ 9 | Project dùng npm |
| Git | bất kỳ | Clone repo |
| VS Code | bất kỳ | Khuyến nghị |

**VS Code Extensions khuyến nghị:**
- Prisma (Prisma.prisma)
- ESLint (dbaeumer.vscode-eslint)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- TypeScript Error Lens

---

## Bước 1: Clone & Install

```bash
# Clone repo
git clone <repository-url>
cd personal-finance-tracker

# Cài dependencies
npm install
```

---

## Bước 2: Tạo file `.env.local`

Tạo file `.env.local` ở root project (**không commit file này**):

```bash
# .env.local

# Database — Lấy từ Neon.tech dashboard
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

# Auth.js — Tạo bằng: openssl rand -base64 32
AUTH_SECRET="your-random-secret-here"

# URL của app (dev)
NEXTAUTH_URL="http://localhost:3000"

# (Tùy chọn) Google OAuth
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
```

> **Lấy `DATABASE_URL` từ Neon.tech:** Đăng nhập neon.tech → Project → Connection String → chọn "Prisma" format.

---

## Bước 3: Setup Database

```bash
# Áp dụng schema vào database
npx prisma db push

# (Tùy chọn) Seed danh mục mặc định cho test
npx prisma db seed

# Mở Prisma Studio để kiểm tra data
npx prisma studio
```

---

## Bước 4: Chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên browser.

---

## Bước 5: Kiểm tra setup hoạt động

- [ ] Trang landing `/` hiển thị đúng
- [ ] Đăng ký tài khoản mới thành công
- [ ] Đăng nhập và vào được `/dashboard`
- [ ] Prisma Studio hiển thị data đúng

---

## Scripts hữu ích

```bash
npm run dev          # Chạy dev server (port 3000)
npm run build        # Build production
npm run lint         # Chạy ESLint
npx prisma studio    # Mở Prisma Studio (GUI database)
npx prisma db push   # Sync schema → database (dev)
npx prisma migrate dev --name <name>  # Tạo migration (production-ready)
```

---

## Troubleshooting thường gặp

### Lỗi `PrismaClientInitializationError`
→ Kiểm tra `DATABASE_URL` trong `.env.local`. Đảm bảo đúng connection string từ Neon.tech.

### Lỗi `[auth][error] JWTSessionError`
→ `AUTH_SECRET` bị thiếu hoặc sai. Tạo lại bằng `openssl rand -base64 32`.

### Neon.tech "Too Many Connections"
→ Thêm `?pgbouncer=true&connection_limit=1` vào cuối `DATABASE_URL`:
```
DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true&connection_limit=1"
```

### Tailwind không apply style
→ Chạy `npm run dev` lại. Nếu vẫn lỗi, kiểm tra `app/globals.css` có `@import "tailwindcss"`.
