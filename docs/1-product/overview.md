# Project Overview — Personal Finance Tracker

> **Loại tài liệu:** Product / BA
> **Cập nhật lần cuối:** 2026-03-09

---

## 1. Giới thiệu dự án

| Key | Value |
|---|---|
| **Tên dự án** | Personal Finance Tracker |
| **Nền tảng** | Web Application (Next.js 15 LTS App Router) |
| **Phiên bản** | 1.0.0 |
| **Ngày phân tích** | 2026-03-07 |
| **Deploy** | Vercel + Neon.tech PostgreSQL |
| **Budget** | Zero cost — 100% free tier |

**Mô tả tổng quan:**
Personal Finance Tracker là ứng dụng web giúp người dùng theo dõi thu nhập và chi tiêu cá nhân hằng ngày. Người dùng có thể ghi nhận các giao dịch, phân loại chúng theo danh mục, và xem tổng quan tài chính qua dashboard với biểu đồ trực quan.

---

## 2. Mục tiêu (Goals)

| ID | Mục tiêu | Mô tả |
|---|---|---|
| G1 | Theo dõi thu chi | Người dùng ghi lại mọi giao dịch tài chính hằng ngày |
| G2 | Phân loại giao dịch | Giao dịch được gắn danh mục (ăn uống, đi lại, lương...) |
| G3 | Visualize tài chính | Dashboard hiển thị biểu đồ thu/chi theo tháng |
| G4 | Bảo mật dữ liệu | Mỗi người dùng chỉ thấy dữ liệu của mình |
| G5 | Học Next.js thực tế | Project bao phủ toàn bộ kỹ năng trong lộ trình |

---

## 3. Phạm vi (Scope)

### ✅ In Scope — Phiên bản 1.0

- Đăng ký / Đăng nhập (Email + Password)
- CRUD giao dịch (thu nhập & chi tiêu)
- Quản lý danh mục (categories)
- Dashboard: tổng quan số dư, biểu đồ theo tháng
- Filter giao dịch theo tháng / danh mục / loại
- Responsive UI (mobile & desktop)
- Deploy lên Vercel

### ❌ Out of Scope — Phiên bản 1.0

- Kết nối tài khoản ngân hàng tự động
- Chia sẻ tài khoản nhóm (family budget)
- Xuất báo cáo PDF / Excel
- Đa tiền tệ (multi-currency)
- Thông báo / nhắc nhở (notifications)
- Mobile app (iOS / Android)

---

## 4. Stakeholders

| Vai trò | Mô tả | Nhu cầu chính |
|---|---|---|
| **End User** | Người dùng cuối tự quản lý tài chính | Dễ dùng, nhanh, visualize rõ ràng |
| **Developer** | Người build và maintain hệ thống | Code sạch, cấu trúc rõ, dễ scale |
| **Admin** (future) | Quản trị viên hệ thống | Quản lý user, monitor hệ thống |

---

## 5. Constraints (Ràng buộc)

| Loại | Mô tả |
|---|---|
| **Technical** | Next.js 15 LTS App Router, TypeScript strict bắt buộc |
| **Technical** | Prisma 6.x làm ORM, PostgreSQL (Neon.tech) |
| **Auth** | Auth.js v4 stable (NextAuth) cho authentication |
| **Deploy** | Vercel Free Tier — serverless function timeout 10s |
| **Budget** | Zero cost — dùng free tier cho tất cả services |
| **Timeline** | Solo developer, học theo lộ trình 8 tuần |

---

## 6. Assumptions (Giả định)

- Người dùng có tài khoản email để đăng ký
- Ứng dụng phục vụ cá nhân, không có nhu cầu real-time sync
- Dữ liệu tiền tệ mặc định là VNĐ (Vietnam Đồng)
- Người dùng nhập giao dịch thủ công (không tự động import)
- PostgreSQL được host trên Neon.tech (free tier)
