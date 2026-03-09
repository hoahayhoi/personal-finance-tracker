# Non-Functional Requirements — Personal Finance Tracker

> **Loại tài liệu:** Product / BA
> **Cập nhật lần cuối:** 2026-03-09

---

## 1. Performance (Hiệu năng)

| ID | Yêu cầu | Mục tiêu |
|---|---|---|
| NFR-P01 | Page load time | < 2 giây cho First Contentful Paint |
| NFR-P02 | API response time | < 500ms cho các route handler thông thường |
| NFR-P03 | Dashboard load | Dashboard render trong < 1.5 giây |
| NFR-P04 | Image optimization | Dùng `next/image` để tự động tối ưu |
| NFR-P05 | Server-side caching | Cache data fetch với `revalidate` phù hợp |

---

## 2. Security (Bảo mật)

| ID | Yêu cầu | Giải pháp |
|---|---|---|
| NFR-S01 | Authentication | Auth.js v4 với session strategy |
| NFR-S02 | Authorization | Middleware bảo vệ toàn bộ route `/dashboard/**` |
| NFR-S03 | Data isolation | Mỗi query đều filter theo `userId` của session |
| NFR-S04 | Password storage | Bcrypt hash — không lưu plain text |
| NFR-S05 | CSRF protection | Auth.js tích hợp sẵn |
| NFR-S06 | SQL Injection | Dùng Prisma ORM — parameterized queries |
| NFR-S07 | Environment variables | Sensitive data chỉ lưu trong `.env.local`, không commit |
| NFR-S08 | HTTPS | Vercel đảm bảo HTTPS mặc định |

---

## 3. Scalability (Khả năng mở rộng)

| ID | Yêu cầu | Ghi chú |
|---|---|---|
| NFR-SC01 | Stateless API | Route handlers không giữ state, dễ scale horizontal |
| NFR-SC02 | Database | Prisma + PostgreSQL hỗ trợ connection pooling |
| NFR-SC03 | Folder structure | Theo chuẩn feature-based để dễ thêm module mới |
| NFR-SC04 | Component reuse | UI components tái sử dụng tốt |

---

## 4. Reliability (Độ tin cậy)

| ID | Yêu cầu | Giải pháp |
|---|---|---|
| NFR-R01 | Error Handling | Mỗi route handler có try/catch, trả `error.tsx` thân thiện |
| NFR-R02 | Form Validation | Validate cả client-side và server-side |
| NFR-R03 | Loading States | Mỗi async action có loading indicator |
| NFR-R04 | Uptime | Vercel SLA 99.9% uptime |

---

## 5. Maintainability (Dễ bảo trì)

| ID | Yêu cầu | Áp dụng |
|---|---|---|
| NFR-M01 | TypeScript | Toàn bộ codebase dùng TypeScript strict mode |
| NFR-M02 | Code structure | Theo chuẩn Next.js App Router best practices |
| NFR-M03 | Naming convention | camelCase cho variables/functions, PascalCase cho components |
| NFR-M04 | Prisma schema | Single source of truth cho database model |

---

## 6. Usability (Trải nghiệm người dùng)

| ID | Yêu cầu | Mô tả |
|---|---|---|
| NFR-U01 | Responsive design | Hoạt động tốt trên mobile (≥ 375px) và desktop |
| NFR-U02 | Consistent UI | Dùng shadcn/ui design system nhất quán |
| NFR-U03 | Feedback rõ ràng | Toast notification sau mỗi hành động (thêm/sửa/xóa) |
| NFR-U04 | Empty states | Trang trống có hướng dẫn khi chưa có dữ liệu |
