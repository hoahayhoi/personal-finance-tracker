# 📚 Documentation — Personal Finance Tracker

> Ứng dụng quản lý thu chi cá nhân xây dựng bằng **Next.js 15 LTS**.
> 🔴 **Tiến độ triển khai:** [5-tracking/progress.md](./5-tracking/progress.md)

---

## Cấu trúc tài liệu

```
docs/
├── 1-product/       # Tài liệu sản phẩm — BA, PM đọc
├── 2-design/        # Thiết kế hệ thống — Architect, Senior Dev đọc
├── 3-features/      # Đặc tả chi tiết từng feature — Dev đọc khi implement
├── 4-engineering/   # Tài liệu kỹ thuật — Dev đọc khi setup & deploy
└── 5-tracking/      # Theo dõi tiến độ — cập nhật thường xuyên
```

---

## 1-product — Tài liệu sản phẩm

| Tài liệu | Mô tả |
|---|---|
| [overview.md](./1-product/overview.md) | Mục tiêu, phạm vi, stakeholders, constraints |
| [functional-requirements.md](./1-product/functional-requirements.md) | Danh sách tính năng theo module + priority |
| [non-functional-requirements.md](./1-product/non-functional-requirements.md) | Performance, Security, Scalability, UX |
| [user-stories.md](./1-product/user-stories.md) | As a / I want / So that + Acceptance Criteria |
| [risks-assumptions.md](./1-product/risks-assumptions.md) | Rủi ro, giả định, Definition of Done |

---

## 2-design — Thiết kế hệ thống

| Tài liệu | Mô tả |
|---|---|
| [system-architecture.md](./2-design/system-architecture.md) | Component diagram, folder structure, data flow |
| [data-model.md](./2-design/data-model.md) | ERD, mô tả entity, Prisma schema, seed data |
| [api-design.md](./2-design/api-design.md) | Route handlers — endpoint, request/response |
| [screens.md](./2-design/screens.md) | Danh sách màn hình, navigation flow, layout |

---

## 3-features — Đặc tả feature

> Mỗi file mô tả đầy đủ 1 feature: requirements, user stories, UI spec, logic flow, API, DoD.

| Feature | Tài liệu | Priority | Status |
|---|---|---|---|
| 🏠 Landing Page | [landing-page.md](./3-features/landing-page.md) | Must Have | 📋 Documented |
| 🔐 Authentication | [auth.md](./3-features/auth.md) | Must Have | 📋 Documented |
| 📊 Dashboard | [dashboard.md](./3-features/dashboard.md) | Must Have | 📋 Documented |
| 💸 Transactions | [transactions.md](./3-features/transactions.md) | Must Have | 📋 Documented |
| 🏷️ Categories | [categories.md](./3-features/categories.md) | Must Have | 📋 Documented |
| 👤 Profile | [profile.md](./3-features/profile.md) | Should Have | 📋 Documented |

---

## 4-engineering — Tài liệu kỹ thuật

| Tài liệu | Mô tả |
|---|---|
| [coding-conventions.md](./4-engineering/coding-conventions.md) | Tech stack, patterns chuẩn, quy ước code, checklist commit |
| [environment-setup.md](./4-engineering/environment-setup.md) | Hướng dẫn setup local dev từ đầu |
| [deployment.md](./4-engineering/deployment.md) | Hướng dẫn deploy Vercel + Neon.tech |

---

## 5-tracking — Tiến độ

| Tài liệu | Mô tả |
|---|---|
| [progress.md](./5-tracking/progress.md) | Tiến độ từng phase, changelog, technical decisions |

---

## Project Summary

| Key | Value |
|---|---|
| **Tech Stack** | Next.js 15 LTS, TypeScript 5, Tailwind v4, shadcn/ui, Auth.js v4, Prisma 6.x, PostgreSQL |
| **Deploy** | Vercel + Neon.tech (free tier) |
| **Tổng tính năng** | 29 (18 Must Have, 10 Should Have, 1 Nice to Have) |
| **Số màn hình** | 7 màn hình |
| **API Endpoints** | 10 endpoints |
