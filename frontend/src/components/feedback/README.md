# Feedback System Architecture

## Cấu trúc thư mục

```
components/feedback/
├── FeedbackLayout.tsx          # Main layout component
├── rating-layouts/             # Rating-specific layouts
│   ├── index.ts               # Export all layouts + types
│   ├── DisappointedLayout.tsx # Rating 1-4
│   ├── NeutralLayout.tsx      # Rating 5-7
│   └── HappyLayout.tsx        # Rating 8-10
└── README.md                  # This file
```

## Cách hoạt động

### 1. FeedbackLayout (Main Component)
- Nhận props: rating, customerName, orderId, email
- Phân loại rating thành 3 category: disappointed, neutral, happy
- Render layout tương ứng dựa trên category

### 2. Rating Categories
- **Disappointed (1-4)**: Layout màu đỏ, thể hiện tiếc nuối
- **Neutral (5-7)**: Layout màu vàng, cảm ơn và cam kết cải thiện  
- **Happy (8-10)**: Layout màu xanh, vui vẻ + trigger GCR popup

### 3. Extensibility (Khả năng mở rộng)

#### Thêm layout cho rating cụ thể:
```typescript
// Trong FeedbackLayout.tsx
const getRatingCategory = (rating: number) => {
  if (rating === 1) return 'very-disappointed'
  if (rating === 2) return 'disappointed-2'
  // ... specific ratings
  if (rating === 10) return 'perfect'
  // fallback to current categories
}
```

#### Tạo layout mới:
```typescript
// components/feedback/rating-layouts/VeryDisappointedLayout.tsx
export function VeryDisappointedLayout({ rating, customerName, orderId, email }: RatingLayoutProps) {
  return (
    <Card className="border-red-500 bg-red-900">
      {/* Custom layout for rating 1 */}
    </Card>
  )
}
```

#### Cập nhật index.ts:
```typescript
export { VeryDisappointedLayout } from './VeryDisappointedLayout'
```

## URL Structure

```
/feedback?review_trigger=true&rating=8&order_id=ORDER-001&email=customer@example.com
```

### Required Parameters:
- `review_trigger`: true (để kích hoạt feedback mode)
- `rating`: 1-10 (điểm đánh giá)
- `order_id`: Mã đơn hàng
- `email`: Email khách hàng (để extract tên)

## GCR Integration

- GCR popup chỉ trigger khi rating >= 7
- Component GCRTrigger được include trong feedback page
- Tự động sử dụng thông tin từ URL parameters

## Customization Examples

### Thêm layout cho từng điểm rating:
1. Tạo file layout mới trong `rating-layouts/`
2. Export trong `index.ts`
3. Cập nhật logic trong `FeedbackLayout.tsx`
4. Thêm case mới trong `renderRatingLayout()`

### Thêm features:
- Survey forms cho rating thấp
- Loyalty program cho rating cao  
- Social sharing buttons
- Email subscription
- Discount codes
- Follow-up surveys

## Best Practices

1. **Consistent Props**: Tất cả layout components dùng chung `RatingLayoutProps`
2. **Color Coding**: Đỏ (1-4), Vàng (5-7), Xanh (8-10)
3. **Responsive Design**: Tất cả layouts responsive
4. **Accessibility**: Proper contrast, semantic HTML
5. **Performance**: Lazy load layouts nếu cần