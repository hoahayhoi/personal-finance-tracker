# User Stories & Acceptance Criteria — Personal Finance Tracker

> **Loại tài liệu:** Product / BA
> **Cập nhật lần cuối:** 2026-03-09

---

## Module: Authentication

### US-A01: Đăng ký tài khoản
> As a **new user**, I want to **register with email and password**, so that **I can start tracking my finances**.

**Acceptance Criteria:**
- Given tôi chưa có tài khoản, When tôi nhập email + password hợp lệ và submit, Then tài khoản được tạo và tôi được redirect về dashboard
- Given email đã tồn tại, When tôi submit form, Then hiển thị lỗi "Email đã được sử dụng"
- Given password < 8 ký tự, When tôi submit form, Then hiển thị lỗi validation

---

### US-A02: Đăng nhập
> As a **registered user**, I want to **log in with my email and password**, so that **I can access my financial data**.

**Acceptance Criteria:**
- Given thông tin đúng, When tôi nhập email + password và submit, Then tôi được redirect về `/dashboard`
- Given sai email hoặc password, When tôi submit, Then hiển thị lỗi "Email hoặc mật khẩu không đúng"
- Given tôi chưa đăng nhập, When tôi truy cập `/dashboard`, Then tôi bị redirect về `/login`

---

## Module: Dashboard

### US-D01: Xem tổng quan tài chính
> As a **logged-in user**, I want to **see my financial overview on the dashboard**, so that **I can quickly understand my financial status**.

**Acceptance Criteria:**
- Given tôi ở trang dashboard, When page load xong, Then tôi thấy số dư hiện tại, tổng thu và tổng chi trong tháng
- Given tôi chọn tháng khác, When tôi thay đổi bộ lọc tháng, Then dashboard cập nhật theo tháng được chọn
- Given chưa có giao dịch nào, When tôi xem dashboard, Then hiển thị empty state với hướng dẫn thêm giao dịch đầu tiên

---

### US-D02: Xem biểu đồ thu/chi
> As a **user**, I want to **see a chart of my income and expenses**, so that **I can visualize spending trends**.

**Acceptance Criteria:**
- Given tôi ở dashboard, When có dữ liệu, Then biểu đồ đường hiển thị thu/chi theo từng ngày trong tháng
- Given không có dữ liệu trong tháng, When xem dashboard, Then biểu đồ hiển thị đường nằm ngang ở mức 0

---

## Module: Transactions

### US-T01: Thêm giao dịch mới
> As a **user**, I want to **add a new transaction**, so that **I can record my income or expense**.

**Acceptance Criteria:**
- Given tôi ở trang giao dịch, When tôi nhấn "Thêm giao dịch" và điền form hợp lệ, Then giao dịch mới xuất hiện trong danh sách
- Given form thiếu trường bắt buộc (số tiền, danh mục, ngày), When tôi submit, Then hiển thị lỗi từng trường
- Given số tiền nhập ≤ 0, When tôi submit, Then hiển thị lỗi "Số tiền phải lớn hơn 0"

**Fields bắt buộc:**
| Field | Kiểu | Ràng buộc |
|---|---|---|
| Loại | Enum | INCOME / EXPENSE |
| Số tiền | Number | > 0 |
| Danh mục | Relation | Phải chọn 1 danh mục |
| Ngày | Date | Không được để trống |
| Ghi chú | String | Tùy chọn, max 255 ký tự |

---

### US-T02: Sửa giao dịch
> As a **user**, I want to **edit a transaction**, so that **I can correct mistakes in my records**.

**Acceptance Criteria:**
- Given tôi click "Sửa" trên một giao dịch, When form mở ra, Then form được điền sẵn dữ liệu cũ
- Given tôi thay đổi và submit, When thành công, Then danh sách cập nhật ngay lập tức với dữ liệu mới

---

### US-T03: Xóa giao dịch
> As a **user**, I want to **delete a transaction**, so that **I can remove incorrect entries**.

**Acceptance Criteria:**
- Given tôi click "Xóa", When dialog xác nhận xuất hiện, Then tôi phải xác nhận trước khi xóa
- Given tôi xác nhận xóa, When xóa thành công, Then giao dịch biến mất khỏi danh sách và hiển thị toast "Đã xóa"

---

### US-T04: Filter giao dịch
> As a **user**, I want to **filter transactions by month and category**, so that **I can analyze specific periods or spending areas**.

**Acceptance Criteria:**
- Given tôi chọn tháng 1/2026, When filter áp dụng, Then chỉ hiển thị giao dịch trong tháng đó
- Given tôi chọn danh mục "Ăn uống", When filter áp dụng, Then chỉ hiển thị giao dịch loại Ăn uống

---

## Module: Categories

### US-C01: Thêm danh mục tùy chỉnh
> As a **user**, I want to **create custom categories**, so that **I can organize transactions to fit my lifestyle**.

**Acceptance Criteria:**
- Given tôi nhập tên danh mục và chọn loại (Thu/Chi), When submit, Then danh mục mới xuất hiện trong danh sách
- Given tên danh mục đã tồn tại (của cùng loại), When submit, Then hiển thị lỗi "Danh mục đã tồn tại"

---

### US-C02: Danh mục mặc định khi đăng ký
> As a **new user**, I want to **have default categories pre-created**, so that **I can start adding transactions immediately without setup effort**.

**Acceptance Criteria:**
- Given tôi vừa đăng ký xong, When vào trang Categories, Then thấy đầy đủ danh mục mặc định cho cả Thu và Chi
