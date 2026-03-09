# .agent/ — Agent Configuration

Thư mục này chứa cấu hình hỗ trợ AI agent làm việc hiệu quả trong dự án **Personal Finance Tracker**.

---

## Mục tiêu agent

| Mục tiêu | Mô tả |
|---|---|
| 📋 Phân tích nghiệp vụ | Tạo bộ tài liệu BA chuẩn từ yêu cầu mô tả |
| 📝 Viết docs | Sinh và cập nhật docs theo cấu trúc `docs/` |
| 🎓 Hướng dẫn học Next.js | Giải thích code, khái niệm dễ hiểu cho người mới |
| 🏗️ Implement feature | Viết code Next.js chuẩn production |

---

## Cấu trúc

```
.agent/
├── README.md                  ← file này — index tổng quan
├── workflows/
│   ├── ba_analysis.md         ← /ba_analysis
│   ├── implement_feature.md   ← /implement_feature
│   └── generate_testcases.md  ← /generate_testcases
└── skills/
    ├── nextjs_mentor/         ← giải thích khái niệm Next.js
    ├── ui_component_builder/  ← build UI shadcn/ui + Tailwind v4
    ├── code_reviewer/         ← review code theo chuẩn dự án
    ├── prisma_db_designer/    ← thiết kế schema, migration, seed
    └── qa_tester/             ← tạo test case checklist
```

---

## Workflows

### `/ba_analysis` — Phân tích nghiệp vụ

**Dùng khi:** Người dùng mô tả một dự án mới và muốn tạo bộ tài liệu BA đầy đủ.

**Kết quả output:**
```
docs/
├── 1-product/      overview, requirements, user stories, risks
├── 2-design/       architecture, data model, API, screens
├── 3-features/     đặc tả chi tiết từng feature
├── 4-engineering/  coding conventions, setup, deployment
└── 5-tracking/     progress tracker
```

**Trigger:** `/ba_analysis` hoặc "phân tích dự án", "tạo tài liệu BA", "viết docs"

---

### `/implement_feature` — Implement Feature

**Dùng khi:** Người dùng muốn implement một feature cụ thể (auth, dashboard, transactions...).

**Thứ tự luôn đọc trước:**
1. `docs/3-features/<feature>.md` — spec đầy đủ
2. `docs/4-engineering/coding-conventions.md` — quy ước bắt buộc
3. `docs/2-design/system-architecture.md` — folder structure

**Thứ tự implement:**
`Types → Server Actions → Server Components → Client Components → Navigation`

### `/generate_testcases` — Tạo Test Case Checklist

**Dùng khi:** Tạo test case for một feature cụ thể sau khi implement xong hoặc trước deploy.

**Đọc 4 nguồn docs:**
1. `docs/3-features/<feature>.md` — Acceptance Criteria, DoD
2. `docs/1-product/functional-requirements.md` — Feature IDs, priority
3. `docs/2-design/api-design.md` — Endpoints, error codes
4. `docs/2-design/screens.md` — Navigation, auth requirement

**Output:** `docs/5-tracking/testcases-<feature>.md` + cập nhật `testcases-index.md`

**6 loại test case:** 🟢 Happy Path → 🔴 Negative → 🟡 Auth → 🟡 UI/UX → 🔵 API → ⚡ Performance

**Trigger:** `/generate_testcases` hoặc "tạo test case", "viết test", "test feature"

---


### `nextjs_mentor` — Senior Next.js Mentor

Giải thích theo 3 lớp: **Là gì → Tại sao → Cách hoạt động** + kết nối vào dự án thực tế.

**Trigger:** "giải thích", "tại sao lại", "cho tôi hiểu"

---

### `ui_component_builder` — Build UI Production

Build UI với shadcn/ui + Tailwind v4. Bao phủ: mobile-first, Skeleton loading, Empty states, Form+Zod, Dialog, Toast (Sonner), CSS variables semantic colors.

**Trigger:** Bất kỳ khi nào tạo JSX/TSX component

---

### `code_reviewer` — Review Code

Review theo 5 priority: 🔴 Security (auth, userId filter) → 🔴 Correctness (Zod, revalidatePath) → 🟡 Architecture ('use client', singleton) → 🟡 TypeScript (no `any`) → 🟢 Quality.

**Trigger:** "review code", "check lại", "code đúng chưa"

---

### `prisma_db_designer` — Prisma Schema & DB Design

Schema chuẩn production: CUID, Cascade Delete, Decimal cho tiền, @@unique, migration strategy, upsert seed, query pattern an toàn.

### `qa_tester` — QA Tester

Sinh test case checklist từ docs: 6 loại (Happy/Negative/Auth/UI/API/Perf), format bảng chuẩn với ID unique, expected results cụ thể, re-check DoD.

**Trigger:** Bất kỳ khi nào cần test case checklist

---

## Docs Reference (đường dẫn quan trọng)

> Khi làm việc, agent **phải đọc** các file docs theo đúng path mới:

| Mục đích | Path |
|---|---|
| Đặc tả feature | `docs/3-features/<feature>.md` |
| Coding conventions | `docs/4-engineering/coding-conventions.md` |
| Folder structure | `docs/2-design/system-architecture.md` |
| Progress tracking | `docs/5-tracking/progress.md` |
| Data model | `docs/2-design/data-model.md` |
| API design | `docs/2-design/api-design.md` |

---

## Quy tắc bắt buộc

1. Đọc `coding-conventions.md` trước khi viết code
2. Dùng shadcn/ui trước khi tự viết UI component (`npx shadcn@latest add`)
3. Filter/pagination → URL state (nuqs) | UI state → Zustand
4. Mọi Server Action và Route Handler phải **check auth** và **filter `userId`**
5. Sau mỗi mutation: gọi `revalidatePath()`
6. Sau khi implement: cập nhật `docs/5-tracking/progress.md`
