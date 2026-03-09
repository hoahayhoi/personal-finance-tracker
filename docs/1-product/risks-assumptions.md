# Risks & Assumptions — Personal Finance Tracker

> **Loại tài liệu:** Product / BA
> **Cập nhật lần cuối:** 2026-03-09

---

## 1. Risks (Rủi ro)

| ID | Rủi ro | Mức độ | Khả năng xảy ra | Mitigation Plan |
|---|---|---|---|---|
| R01 | **Vercel Free Tier limits** — Serverless function timeout 10s có thể gây lỗi cho các query phức tạp | Medium | Thấp | Tối ưu Prisma query, thêm index vào DB |
| R02 | **Neon.tech connection pool** — Free tier giới hạn số concurrent connections | Medium | Trung bình | Dùng Prisma connection pool, thêm `?pgbouncer=true` vào DB URL |
| R03 | **Auth.js session expiry** — User bị đăng xuất giữa chừng khi làm việc | Low | Trung bình | Set session maxAge phù hợp, handle redirect gracefully |
| R04 | **TypeScript strict mode** — Mất thêm thời gian fix type errors khi mới học | Low | Cao | Dành thêm thời gian học TypeScript trước |
| R05 | **Scope creep** — Thêm tính năng ngoài kế hoạch khiến deadline bị trễ | Medium | Trung bình | Bám chặt vào In Scope đã định nghĩa ở Phase 1 |
| R06 | **Data loss** — User xóa nhầm giao dịch không khôi phục được | Low | Thấp | Thêm confirmation dialog, có thể thêm soft-delete sau |

---

## 2. Assumptions (Giả định)

| ID | Giả định |
|---|---|
| A01 | Người dùng có kết nối internet ổn định — app không cần offline mode |
| A02 | Ứng dụng phục vụ 1 người dùng cá nhân — không cần chia sẻ dữ liệu giữa users |
| A03 | Đơn vị tiền tệ mặc định là VNĐ — không cần đổi tiền tệ |
| A04 | Người dùng nhập giao dịch thủ công — không import từ file hoặc bank |
| A05 | Schema database không thay đổi lớn trong Phase 1 — migration đơn giản |
| A06 | Dev environment dùng SQLite (local), production dùng Neon PostgreSQL |

---

## 3. Dependencies (Phụ thuộc bên ngoài)

| Service | Mục đích | Free Tier Limits | Fallback |
|---|---|---|---|
| **Neon.tech** | PostgreSQL hosting | 0.5GB storage, limited compute | PlanetScale hoặc Railway |
| **Vercel** | Deploy Next.js | 100GB bandwidth/tháng, 10s function timeout | Railway |
| **Auth.js v4** | Authentication library | Open source, no limits | Implement manual JWT |

---

## 4. Definition of Done (Tiêu chí hoàn thành Phase 1)

- [ ] Đăng ký / đăng nhập hoạt động
- [ ] CRUD giao dịch hoạt động đầy đủ
- [ ] Dashboard hiển thị số liệu và biểu đồ
- [ ] Filter theo tháng trên cả Dashboard và Transactions
- [ ] Danh mục mặc định tự tạo khi đăng ký
- [ ] Responsive trên mobile và desktop
- [ ] Deploy thành công lên Vercel
- [ ] URL public truy cập được trên browser
