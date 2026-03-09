# Functional Requirements — Personal Finance Tracker

> **Loại tài liệu:** Product / BA
> **Cập nhật lần cuối:** 2026-03-09

---

## Module 1: Authentication (Xác thực)

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-A01 | Đăng ký tài khoản | Người dùng đăng ký bằng email + password | Must Have |
| FR-A02 | Đăng nhập | Đăng nhập bằng email + password | Must Have |
| FR-A03 | Đăng xuất | Kết thúc session hiện tại | Must Have |
| FR-A04 | Bảo vệ route | Redirect về login nếu chưa xác thực | Must Have |
| FR-A05 | OAuth Login | Đăng nhập bằng Google | Should Have |

---

## Module 2: Dashboard (Tổng quan)

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-D01 | Tổng số dư | Hiển thị số dư hiện tại (Tổng thu - Tổng chi) | Must Have |
| FR-D02 | Tổng thu tháng | Tổng thu nhập tháng hiện tại | Must Have |
| FR-D03 | Tổng chi tháng | Tổng chi tiêu tháng hiện tại | Must Have |
| FR-D04 | Biểu đồ đường | Thu / Chi theo từng ngày trong tháng | Must Have |
| FR-D05 | Biểu đồ tròn | Chi tiêu chia theo danh mục | Should Have |
| FR-D06 | Giao dịch gần nhất | Danh sách 5 giao dịch gần nhất | Must Have |
| FR-D07 | Chọn tháng xem | Người dùng chọn tháng/năm để xem dashboard | Should Have |

---

## Module 3: Transactions (Giao dịch)

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-T01 | Xem danh sách | Hiển thị toàn bộ giao dịch dạng bảng | Must Have |
| FR-T02 | Thêm giao dịch | Form nhập giao dịch mới (loại, số tiền, danh mục, ngày, ghi chú) | Must Have |
| FR-T03 | Sửa giao dịch | Chỉnh sửa thông tin giao dịch đã có | Must Have |
| FR-T04 | Xóa giao dịch | Xóa giao dịch khỏi hệ thống | Must Have |
| FR-T05 | Filter theo tháng | Lọc giao dịch theo tháng/năm | Must Have |
| FR-T06 | Filter theo loại | Lọc theo Thu / Chi | Should Have |
| FR-T07 | Filter theo danh mục | Lọc theo danh mục | Should Have |
| FR-T08 | Tìm kiếm | Tìm giao dịch theo ghi chú, số tiền | Nice to Have |
| FR-T09 | Phân trang | Pagination nếu nhiều giao dịch | Should Have |

---

## Module 4: Categories (Danh mục)

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-C01 | Xem danh mục | Danh sách danh mục của người dùng | Must Have |
| FR-C02 | Thêm danh mục | Tạo danh mục mới (tên, icon, màu sắc, loại) | Must Have |
| FR-C03 | Sửa danh mục | Chỉnh sửa danh mục | Should Have |
| FR-C04 | Xóa danh mục | Xóa danh mục (chỉ khi không có giao dịch liên kết) | Should Have |
| FR-C05 | Danh mục mặc định | Hệ thống tạo sẵn danh mục mặc định khi đăng ký | Must Have |

**Danh mục mặc định:**

| Loại | Danh mục |
|---|---|
| Chi | Ăn uống, Đi lại, Mua sắm, Nhà ở & Tiện ích, Giải trí, Sức khỏe, Giáo dục, Khác |
| Thu | Lương, Thưởng, Đầu tư, Thu nhập phụ, Khác |

---

## Module 5: Profile (Hồ sơ)

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-P01 | Xem profile | Thông tin tài khoản người dùng | Should Have |
| FR-P02 | Đổi tên hiển thị | Cập nhật tên hiển thị | Should Have |
| FR-P03 | Đổi mật khẩu | Thay đổi mật khẩu | Should Have |

---

## Tổng hợp Priority

| Priority | Số lượng tính năng |
|---|---|
| Must Have | 18 |
| Should Have | 10 |
| Nice to Have | 1 |
