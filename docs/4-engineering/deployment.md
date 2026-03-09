# Deployment Guide — Personal Finance Tracker

> **Loại tài liệu:** Engineering
> **Cập nhật lần cuối:** 2026-03-09

Hướng dẫn deploy lên Vercel (hosting) + Neon.tech (database PostgreSQL).

---

## Tổng quan

```
Code (GitHub) → Vercel (auto-deploy) → Next.js App
                                            │
                                       Neon.tech (PostgreSQL)
```

---

## Bước 1: Setup Neon.tech (Database)

1. Đăng ký tài khoản tại [neon.tech](https://neon.tech) (free)
2. Tạo project mới → chọn region gần Việt Nam (Singapore)
3. Lấy **Connection String** (chọn format "Prisma"):
   ```
   postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Lưu connection string — dùng ở bước sau

> **Lưu ý Neon free tier:**
> - 0.5 GB storage
> - Compute tạm dừng sau 5 phút không hoạt động (cold start ~1-2s)
> - Thêm `?pgbouncer=true` để tránh "Too Many Connections"

---

## Bước 2: Migrate Database lên Production

```bash
# Từ máy local, chạy migration lên Neon database
DATABASE_URL="<neon-connection-string>" npx prisma migrate deploy

# Hoặc nếu chưa có migration (chỉ dùng khi dev):
DATABASE_URL="<neon-connection-string>" npx prisma db push
```

---

## Bước 3: Deploy lên Vercel

### Cách 1: Deploy qua Vercel Dashboard (khuyến nghị)

1. Push code lên GitHub
2. Đăng nhập [vercel.com](https://vercel.com) → **New Project** → Import từ GitHub
3. Vercel tự detect Next.js — giữ config mặc định
4. Thêm **Environment Variables** (xem Bước 4)
5. Click **Deploy**

### Cách 2: Deploy qua Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Bước 4: Cấu hình Environment Variables trên Vercel

Vào Vercel Dashboard → Project → **Settings** → **Environment Variables**:

| Key | Value | Environment |
|---|---|---|
| `DATABASE_URL` | Connection string từ Neon (có `?pgbouncer=true`) | Production, Preview |
| `AUTH_SECRET` | Random string (32+ chars) — dùng `openssl rand -base64 32` | Production, Preview |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Production |

> ⚠️ **`NEXTAUTH_URL` phải là domain production** — không dùng `localhost`.

---

## Bước 5: Smoke Test sau Deploy

Sau khi deploy xong, kiểm tra:

- [ ] Trang landing `https://your-app.vercel.app` hiển thị đúng
- [ ] Đăng ký tài khoản mới thành công
- [ ] Đăng nhập và vào được `/dashboard`
- [ ] Thêm 1 giao dịch → dữ liệu lưu vào Neon DB
- [ ] Kiểm tra Neon dashboard: data đã có trong bảng `Transaction`
- [ ] Responsive: mở trên mobile

---

## Cấu hình Vercel tối ưu (vercel.json)

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

> Vercel Free Tier giới hạn **10 giây** cho serverless functions. Đây là config mặc định.

---

## Troubleshooting Deploy

### Build lỗi TypeScript
→ Chạy `npm run build` local trước. Fix hết lỗi TypeScript trước khi push.

### `PrismaClientInitializationError` trên production
→ Kiểm tra `DATABASE_URL` trong Vercel env vars. Đảm bảo không có khoảng trắng thừa.

### `[auth][error] MissingSecret`
→ Thêm `AUTH_SECRET` vào Vercel Environment Variables.

### `Error: NEXTAUTH_URL` không khớp
→ Đảm bảo `NEXTAUTH_URL` = domain chính xác của app trên Vercel (có `https://`).

### Neon "Connection Pool" lỗi
→ URL production phải có: `?sslmode=require&pgbouncer=true&connection_limit=1`

---

## Re-deploy sau code changes

Mỗi khi push lên GitHub branch `main`, Vercel tự động re-deploy. Không cần làm gì thêm.

```bash
git add .
git commit -m "feat: add feature"
git push origin main
# Vercel tự deploy trong ~1-2 phút
```
