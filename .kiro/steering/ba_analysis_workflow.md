---
inclusion: auto
keywords: ["ba", "phân tích", "tài liệu", "docs", "requirements", "user stories"]
---

# BA Analysis Workflow

Workflow phân tích dự án theo chuẩn Business Analyst, sinh bộ tài liệu hoàn chỉnh trong `docs/`.

## Cấu trúc thư mục

```
docs/
├── 1-product/      # Overview, requirements, user stories, risks
├── 2-design/       # Architecture, data model, API, screens
├── 3-features/     # Đặc tả chi tiết từng feature
├── 4-engineering/  # Coding conventions, setup, deployment
└── 5-tracking/     # Progress tracker
```

## Thứ tự thực hiện

### 1. Tạo cấu trúc thư mục
Tạo các folder: `1-product/`, `2-design/`, `3-features/`, `4-engineering/`, `5-tracking/`

### 2. Project Overview
File: `docs/1-product/overview.md`
- Tên dự án, mô tả, version, ngày phân tích
- Goals, Scope (In/Out), Stakeholders
- Constraints & Assumptions

### 3. Functional Requirements
File: `docs/1-product/functional-requirements.md`
- Feature List nhóm theo module
- Mô tả chi tiết từng tính năng
- Priority: Must Have / Should Have / Nice to Have

### 4. Non-Functional Requirements
File: `docs/1-product/non-functional-requirements.md`
- Performance, Security, Scalability, Reliability, Maintainability, Usability

### 5. User Stories
File: `docs/1-product/user-stories.md`
```
As a [role], I want to [action], so that [benefit].

Acceptance Criteria:
- Given [context], When [action], Then [outcome]
```

### 6. Risks & Assumptions
File: `docs/1-product/risks-assumptions.md`
- Risks: mô tả, mức độ, mitigation
- Assumptions
- Dependencies
- Definition of Done

### 7. System Architecture
File: `docs/2-design/system-architecture.md`
- Component diagram (Mermaid)
- Folder structure
- Data flow diagram
- Authentication flow
- Link cross-reference đến coding-conventions.md

### 8. Data Model
File: `docs/2-design/data-model.md`
- ERD (Mermaid erDiagram)
- Mô tả entity (field, type, constraint)
- Prisma schema draft
- Seed data mẫu

### 9. UI/UX Screens
File: `docs/2-design/screens.md`
- Bảng overview màn hình (route, mục đích, auth)
- Mô tả từng màn hình
- Navigation flow (Mermaid)
- Layout diagram (ASCII)

### 10. API Design
File: `docs/2-design/api-design.md`
- Bảng endpoints (method, path, mô tả, auth)
- Chi tiết endpoint: params, body, response
- HTTP Error Codes

### 11. Feature Docs
Với mỗi Must Have feature, tạo `docs/3-features/<feature>.md`:
1. Header: Feature ID, Routes, Priority, Status, Dependencies
2. Mô tả + Goals
3. Functional Requirements
4. User Stories & Acceptance Criteria
5. UI/UX Screen Specification
6. Component breakdown
7. Logic Flow
8. API Endpoints
9. Data Schema
10. Risks & Considerations
11. Definition of Done

### 12. Engineering Docs

**coding-conventions.md:**
- Tech stack với version
- Server vs Client Component rules
- Naming conventions
- Folder structure
- Patterns: Server Actions, Route Handlers, Prisma
- Checklist trước commit

**environment-setup.md:**
- Requirements (Node, tools)
- Clone, install, .env.local
- Database setup
- Run dev server
- Troubleshooting

**deployment.md:**
- Setup database (Neon.tech)
- Deploy Vercel
- Environment variables
- Smoke test
- Troubleshooting

### 13. Progress Tracker
File: `docs/5-tracking/progress.md`
- Bảng tiến độ theo Phase
- Task chi tiết với status [ ]
- Changelog section
- Technical Notes

### 14. README Index
File: `docs/README.md`
- Mục lục theo nhóm
- Link đến từng file
- Project Summary
