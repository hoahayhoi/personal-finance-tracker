---
description: BA Analysis Workflow — sinh tài liệu phân tích nghiệp vụ chuẩn cho dự án Next.js
---

# BA Analysis Workflow

Workflow này hướng dẫn agent thực hiện phân tích dự án theo chuẩn Business Analyst (BA),
sinh ra bộ tài liệu hoàn chỉnh trong folder `docs/` theo cấu trúc chuẩn.

// turbo-all

## Bước 1: Tạo cấu trúc thư mục docs/

Tạo các thư mục sau nếu chưa tồn tại:

```
docs/
├── 1-product/
├── 2-design/
├── 3-features/
├── 4-engineering/
└── 5-tracking/
```

## Bước 2: Viết Project Overview

Tạo file `docs/1-product/overview.md` với nội dung:
- Tên dự án, mô tả tổng quan, version, ngày phân tích
- Mục tiêu (Goals)
- Phạm vi (Scope — In Scope / Out of Scope)
- Stakeholders (người dùng cuối, dev, admin)
- Constraints & Assumptions

## Bước 3: Viết Functional Requirements

Tạo file `docs/1-product/functional-requirements.md` với nội dung:
- Danh sách tính năng (Feature List) nhóm theo module
- Mô tả chi tiết từng tính năng
- Priority: Must Have / Should Have / Nice to Have

## Bước 4: Viết Non-Functional Requirements

Tạo file `docs/1-product/non-functional-requirements.md` với nội dung:
- Performance, Security, Scalability, Reliability, Maintainability, Usability

## Bước 5: Viết User Stories & Acceptance Criteria

Tạo file `docs/1-product/user-stories.md` với format chuẩn:
```
As a [role], I want to [action], so that [benefit].

Acceptance Criteria:
- Given [context], When [action], Then [outcome]
```
Viết ít nhất 1 story cho mỗi tính năng Must Have.

## Bước 6: Viết Risks & Assumptions

Tạo file `docs/1-product/risks-assumptions.md` với nội dung:
- Risks: mô tả, mức độ (High/Med/Low), mitigation plan
- Assumptions: các giả định khi phân tích
- Dependencies: third-party services
- Definition of Done

## Bước 7: Viết System Architecture

Tạo file `docs/2-design/system-architecture.md` với nội dung:
- Component diagram (Mermaid) — KHÔNG có bảng Tech Stack (đã có ở coding-conventions.md)
- Folder structure của Next.js project
- Data flow diagram (Mermaid sequenceDiagram)
- Authentication flow (Mermaid flowchart)
- Thêm link cross-reference: `> 📐 Tech Stack → xem [4-engineering/coding-conventions.md](../4-engineering/coding-conventions.md)`

## Bước 8: Viết Data Model

Tạo file `docs/2-design/data-model.md` với nội dung:
- ERD (Mermaid erDiagram)
- Mô tả chi tiết từng entity (field, type, constraint)
- Prisma schema draft
- Seed data mẫu

## Bước 9: Viết UI/UX Screens

Tạo file `docs/2-design/screens.md` với nội dung:
- Bảng overview tất cả màn hình (route, mục đích, auth)
- Mô tả từng màn hình: components, actions
- Navigation flow (Mermaid flowchart)
- Layout diagram (ASCII)

## Bước 10: Viết API Design

Tạo file `docs/2-design/api-design.md` với nội dung:
- Bảng tổng hợp tất cả endpoints (method, path, mô tả, auth)
- Chi tiết từng endpoint: query params, request body, response mẫu
- HTTP Error Codes

## Bước 11: Viết Feature Docs chi tiết

Với mỗi feature chính (Must Have), tạo file `docs/3-features/<feature-name>.md`:

```
docs/3-features/
├── auth.md
├── dashboard.md
├── transactions.md
├── categories.md
└── landing-page.md
```

Mỗi file feature doc gồm:
1. Header: Feature ID, Routes, Priority, Status, Dependencies
2. Mô tả tổng quan + Goals
3. Functional Requirements (subset từ 1-product/)
4. User Stories & Acceptance Criteria (chi tiết hơn)
5. UI/UX Screen Specification (wireframe ASCII)
6. Component breakdown (file đề xuất)
7. Logic Flow (text diagram)
8. API Endpoints liên quan
9. Data Schema liên quan (Prisma snippet)
10. Risks & Considerations
11. Definition of Done (checklist)

## Bước 12: Tạo Engineering Docs

Tạo file `docs/4-engineering/coding-conventions.md`:
- Bảng tech stack với version cụ thể (LTS/Stable)
- Quy tắc Server vs Client Component
- Naming conventions
- Folder structure chi tiết
- Patterns chuẩn: Server Actions, Route Handlers, Prisma singleton
- Checklist trước khi commit

Tạo file `docs/4-engineering/environment-setup.md`:
- Yêu cầu (Node, tools)
- Hướng dẫn clone, install, tạo .env.local
- Setup database (prisma db push, seed)
- Chạy dev server
- Troubleshooting thường gặp

Tạo file `docs/4-engineering/deployment.md`:
- Setup Neon.tech (database)
- Deploy lên Vercel
- Environment variables production
- Smoke test checklist
- Troubleshooting deploy

## Bước 13: Tạo Progress Tracker

Tạo file `docs/5-tracking/progress.md`:
- Bảng tổng tiến độ theo Phase
- Chi tiết task từng Phase với status [ ]
- Changelog section
- Technical Notes section

## Bước 14: Tạo README.md Index

Tạo file `docs/README.md` làm mục lục theo cấu trúc nhóm:
- Bảng overview: 1-product/, 2-design/, 3-features/, 4-engineering/, 5-tracking/
- Link đến từng file trong mỗi nhóm
- Project Summary (tech stack, deploy target)
