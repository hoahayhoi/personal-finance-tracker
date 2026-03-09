# 👤 Feature: Profile — Personal Finance Tracker

**Feature ID:** FT-PROFILE  
**Route:** `/profile`  
**Priority:** Should Have  
**Status:** 📋 Documented — Chưa implement  
**Phụ thuộc:** FT-AUTH (cần session để lấy user info)

---

## 1. Mô tả tổng quan

Trang Profile cho phép người dùng xem và cập nhật thông tin tài khoản cá nhân: tên hiển thị, đổi mật khẩu, và đăng xuất. Đây là module **độc lập, ít phụ thuộc** nhất trong app.

### Mục tiêu

| # | Mục tiêu | Mô tả |
|---|---|---|
| PROF-G1 | Self-service | User tự cập nhật tên + mật khẩu, không cần admin |
| PROF-G2 | Security | Đổi mật khẩu yêu cầu nhập mật khẩu cũ để xác nhận |
| PROF-G3 | Sign out | Cung cấp nút đăng xuất rõ ràng |

---

## 2. Functional Requirements

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-P01 | Xem thông tin | Hiển thị avatar, tên, email của tài khoản | Should Have |
| FR-P02 | Đổi tên | Cập nhật tên hiển thị | Should Have |
| FR-P03 | Đổi mật khẩu | Đổi mật khẩu với xác nhận mật khẩu cũ | Should Have |

> Sign Out (FR-A03) thuộc FT-AUTH nhưng được đặt button tại trang Profile.

---

## 3. User Stories & Acceptance Criteria

### US-P01: Xem và cập nhật thông tin cá nhân

> As a **user**, I want to **view and update my profile information**, so that **my account reflects my correct name**.

**Acceptance Criteria:**
- Given tôi vào `/profile`, When page load, Then thấy avatar (chữ cái đầu), tên hiển thị, và email (read-only)
- Given tôi thay đổi tên và submit, When thành công, Then toast "Đã cập nhật" và Header navbar cập nhật tên mới
- Given tôi để trống tên, When submit, Then lỗi "Tên không được trống"

---

### US-P02: Đổi mật khẩu

> As a **user**, I want to **change my password**, so that **I can keep my account secure**.

**Acceptance Criteria:**
- Given tôi nhập đúng mật khẩu cũ + mật khẩu mới hợp lệ, When submit, Then toast "Đã đổi mật khẩu thành công"
- Given tôi nhập sai mật khẩu cũ, When submit, Then lỗi "Mật khẩu hiện tại không đúng"
- Given mật khẩu mới < 8 ký tự, When submit, Then lỗi "Mật khẩu tối thiểu 8 ký tự"
- Given confirm password không khớp với new password, When submit, Then lỗi "Mật khẩu không khớp"
- Given user đăng nhập bằng OAuth (Google), When vào chức năng đổi mật khẩu, Then form bị ẩn với thông báo "Tài khoản Google không dùng mật khẩu"

---

## 4. UI/UX Screen Specification

### Trang `/profile`

```
┌───────────────────────────────────────────────────────────┐
│  👤 Hồ sơ cá nhân                                        │
├───────────────────────────────────────────────────────────┤
│                                                           │
│    ┌────┐  Nguyễn Văn A                                   │
│    │ NV │  email@example.com          (readonly)          │ ← Avatar + Info
│    └────┘                                                 │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  Cập nhật tên hiển thị                                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Nguyễn Văn A                                        │  │
│  └─────────────────────────────────────────────────────┘  │
│  [Lưu tên]                                                │
├───────────────────────────────────────────────────────────┤
│  Đổi mật khẩu                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Mật khẩu hiện tại                             👁    │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Mật khẩu mới                                  👁    │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Xác nhận mật khẩu mới                         👁    │  │
│  └─────────────────────────────────────────────────────┘  │
│  [Đổi mật khẩu]                                          │
├───────────────────────────────────────────────────────────┤
│  [ 🔴 Đăng xuất ]                                        │
└───────────────────────────────────────────────────────────┘
```

### Component breakdown

| Component | File đề xuất | Mô tả |
|---|---|---|
| `<ProfileInfo />` | `components/profile/ProfileInfo.tsx` | Avatar + email display |
| `<UpdateNameForm />` | `components/profile/UpdateNameForm.tsx` | Form đổi tên |
| `<ChangePasswordForm />` | `components/profile/ChangePasswordForm.tsx` | Form đổi mật khẩu |
| Profile page | `app/(app)/profile/page.tsx` | Server Component lấy session |

---

## 5. API / Server Actions

> Trang Profile nên dùng **Server Actions** thay vì Route Handler vì là form mutation đơn giản.

| Action | Mô tả |
|---|---|
| `updateName(name)` | Cập nhật `User.name` |
| `changePassword(oldPwd, newPwd)` | Verify old → bcrypt.hash → update `hashedPassword` |

---

## 6. Data Schema liên quan

```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique  // readonly
  name           String?           // có thể cập nhật
  hashedPassword String?           // update khi đổi mật khẩu
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## 7. Risks & Considerations

| # | Rủi ro | Mức độ | Mitigation |
|---|---|---|---|
| R1 | OAuth user cố đổi mật khẩu | Low | Check `hashedPassword === null` → ẩn form |
| R2 | Đổi tên không cập nhật trên Header | Low | Revalidate session sau khi update |

---

## 8. Definition of Done

- [ ] Trang `/profile` hiển thị avatar (initials), tên, email
- [ ] Form đổi tên validate và lưu thành công
- [ ] Sau đổi tên, Header navbar cập nhật tên mới
- [ ] Form đổi mật khẩu: verify mật khẩu cũ, hash mới, lưu
- [ ] Sai mật khẩu cũ → hiển thị lỗi đúng
- [ ] OAuth user: ẩn form đổi mật khẩu
- [ ] Nút Sign Out hoạt động đúng, redirect về `/`
