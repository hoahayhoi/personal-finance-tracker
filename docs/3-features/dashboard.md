> 🤖 **Agent:** Đọc file này **chỉ khi** implement hoặc test feature `dashboard` (`/dashboard`). Bỏ qua nếu làm feature khác.
> ✏️ **Update khi:** Thay đổi charts, summary cards, month selector, hoặc DoD.

# 📊 Feature: Dashboard — Personal Finance Tracker

**Feature ID:** FT-DASH  
**Route:** `/dashboard`  
**Priority:** Must Have  
**Status:** 📋 Documented — Chưa implement  
**Phụ thuộc:** FT-AUTH (cần đăng nhập), FT-TRANS (cần có giao dịch để hiển thị data)

---

## 1. Mô tả tổng quan

Dashboard là **màn hình chính** sau khi đăng nhập — nơi người dùng thấy toàn bộ bức tranh tài chính của mình trong một tháng: số dư, tổng thu/chi, biểu đồ xu hướng theo ngày, phân bổ chi tiêu theo danh mục.

### Mục tiêu

| # | Mục tiêu | Mô tả |
|---|---|---|
| DASH-G1 | Financial snapshot | Cho thấy ngay số dư + thu/chi tháng hiện tại |
| DASH-G2 | Trend visualization | Biểu đồ đường thu/chi theo ngày trong tháng |
| DASH-G3 | Spending breakdown | Biểu đồ tròn chi tiêu theo danh mục |
| DASH-G4 | Quick access | 5 giao dịch gần nhất để user review nhanh |

---

## 2. Functional Requirements

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-D01 | Tổng số dư | Tổng thu tất cả thời gian - Tổng chi tất cả thời gian | Must Have |
| FR-D02 | Tổng thu tháng | Tổng thu nhập trong tháng được chọn | Must Have |
| FR-D03 | Tổng chi tháng | Tổng chi tiêu trong tháng được chọn | Must Have |
| FR-D04 | Biểu đồ đường | Thu/chi theo từng ngày trong tháng (Recharts) | Must Have |
| FR-D05 | Biểu đồ tròn | Chi tiêu chia theo danh mục (Recharts) | Should Have |
| FR-D06 | Giao dịch gần nhất | Danh sách 5 giao dịch mới nhất | Must Have |
| FR-D07 | Chọn tháng | Bộ lọc tháng/năm — cập nhật toàn bộ dashboard | Should Have |

---

## 3. User Stories & Acceptance Criteria

### US-D01: Xem tổng quan tài chính

> As a **logged-in user**, I want to **see my financial overview on the dashboard**, so that **I can quickly understand my financial status this month**.

**Acceptance Criteria:**
- Given tôi ở trang dashboard, When page load xong, Then thấy số dư, tổng thu và tổng chi tháng hiện tại
- Given tôi chọn tháng khác, When filter áp dụng, Then tất cả summary cards và biểu đồ cập nhật theo tháng mới
- Given chưa có giao dịch nào, When tôi xem dashboard, Then hiển thị empty state với hint "Thêm giao dịch đầu tiên"
- Given số dư âm (chi > thu), When hiển thị, Then số dư hiển thị màu đỏ

---

### US-D02: Xem biểu đồ thu/chi theo ngày

> As a **user**, I want to **see a daily line chart of income and expenses**, so that **I can spot spending spikes and trends**.

**Acceptance Criteria:**
- Given có dữ liệu trong tháng, When tôi xem biểu đồ, Then thấy 2 đường: Thu (xanh) và Chi (đỏ) theo từng ngày
- Given không có giao dịch trong tháng đó, When xem biểu đồ, Then biểu đồ hiển thị đường nằm ngang ở mức 0
- Given tôi hover vào điểm trên biểu đồ, When hover, Then tooltip hiển thị thu/chi ngày đó

---

### US-D03: Xem biểu đồ chi tiêu theo danh mục

> As a **user**, I want to **see a pie chart of spending by category**, so that **I know where most of my money goes**.

**Acceptance Criteria:**
- Given có giao dịch chi trong tháng, When xem biểu đồ, Then các danh mục hiển thị đúng tỉ lệ
- Given tôi click vào slice, When click, Then highlight danh mục và hiển thị tổng tiền

---

## 4. UI/UX Screen Specification

### Layout tổng thể

```
┌─────────────────────────────────────────────────────────┐
│  🏦 Finance Tracker      [Tháng: 3/2026 ▼]  [Avatar]   │ ← Header
├────────────┬────────────────────────────────────────────┤
│ 📊 Dash    │                                            │
│ 💸 Giao   │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│   dịch    │  │  Số dư   │ │ Tổng thu │ │ Tổng chi │   │ ← Summary Cards
│ 🏷️ Danh   │  │ 5.2M VNĐ │ │ 15M VNĐ  │ │  9.8M    │   │
│   mục     │  └──────────┘ └──────────┘ └──────────┘   │
│ 👤 Profile │                                            │
│            │  ┌─────────────────────┐ ┌─────────────┐  │
│            │  │   Line Chart        │ │  Pie Chart  │  │ ← Charts
│            │  │   Thu/Chi theo ngày │ │  Theo danh  │  │
│            │  │                     │ │  mục        │  │
│            │  └─────────────────────┘ └─────────────┘  │
│            │                                            │
│            │  📋 Giao dịch gần nhất                    │
│            │  ┌─────────────────────────────────────┐  │
│            │  │ 🍜 Ăn uống  Bún bò    -150,000 VNĐ │  │ ← Recent Transactions
│            │  │ 💰 Lương    Tháng 3  +15,000,000    │  │
│            │  └─────────────────────────────────────┘  │
└────────────┴────────────────────────────────────────────┘
```

### Component breakdown

| Component | File đề xuất | Mô tả |
|---|---|---|
| `<SummaryCards />` | `components/dashboard/SummaryCards.tsx` | 3 cards: số dư, thu, chi |
| `<MonthSelector />` | `components/dashboard/MonthSelector.tsx` | Dropdown chọn tháng/năm |
| `<LineChart />` | `components/dashboard/IncomeExpenseChart.tsx` | Recharts LineChart |
| `<PieChart />` | `components/dashboard/CategoryPieChart.tsx` | Recharts PieChart |
| `<RecentTransactions />` | `components/dashboard/RecentTransactions.tsx` | List 5 giao dịch |
| Dashboard page | `app/(app)/dashboard/page.tsx` | Server Component, fetch data |

---

## 5. API / Data Fetching

### `GET /api/dashboard/summary?month=3&year=2026`

**Response:**
```json
{
  "balance": 5200000,
  "totalIncome": 15000000,
  "totalExpense": 9800000,
  "dailyData": [
    { "date": "2026-03-01", "income": 0, "expense": 150000 },
    { "date": "2026-03-02", "income": 15000000, "expense": 0 }
  ],
  "categoryBreakdown": [
    { "categoryId": "clx1", "name": "Ăn uống", "total": 2500000, "color": "#FF6B6B" }
  ],
  "recentTransactions": [
    {
      "id": "clx789",
      "amount": 150000,
      "type": "EXPENSE",
      "note": "Bún bò",
      "date": "2026-03-07",
      "category": { "name": "Ăn uống", "icon": "🍜", "color": "#FF6B6B" }
    }
  ]
}
```

> **Lưu ý:** `balance` = tổng thu - tổng chi **toàn bộ lịch sử** (không filter theo tháng).  
> `totalIncome`, `totalExpense`, biểu đồ = filter theo `month`/`year`.

---

## 6. Risks & Considerations

| # | Rủi ro | Mức độ | Mitigation |
|---|---|---|---|
| R1 | Query nặng khi có nhiều giao dịch | Medium | Index trên `(userId, date)` trong Prisma |
| R2 | Recharts không responsive tốt trên mobile | Medium | Wrap chart trong `<ResponsiveContainer>` |
| R3 | Empty state bị bỏ sót | Low | Handle riêng case: không có giao dịch nào |

---

## 7. Definition of Done

- [ ] Summary Cards hiển thị đúng số dư / thu / chi theo tháng
- [ ] Số dư âm hiển thị màu đỏ
- [ ] Month Selector thay đổi được tháng và re-fetch data
- [ ] Line Chart hiển thị đúng thu/chi theo ngày, có tooltip
- [ ] Pie Chart hiển thị đúng tỉ lệ chi tiêu theo danh mục
- [ ] Recent Transactions hiển thị 5 giao dịch mới nhất
- [ ] Empty state khi không có giao dịch
- [ ] Responsive: hoạt động tốt trên mobile (charts stack vertical)
