# Google Customer Reviews (GCR) Integration Guide

## Tổng quan

Tài liệu này mô tả toàn bộ lifecycle của tích hợp Google Customer Reviews popup trong ứng dụng Personal Finance Tracker, từ setup ban đầu đến trigger popup thông qua email links.

## Architecture Overview

```
Email Link → URL Parameter → GCRTrigger Component → Google API → Popup Display
```

## 1. Setup & Configuration

### 1.1 Google Script Loading
**File:** `frontend/src/app/layout.tsx`

```typescript
<Script 
  src="https://apis.google.com/js/platform.js?onload=renderOptIn" 
  strategy="afterInteractive"
/>
```

**Mục đích:**
- Load Google Customer Reviews API library
- Strategy `afterInteractive` đảm bảo load sau khi page interactive
- Script sẵn sàng cho toàn bộ application

### 1.2 Component Structure
**File:** `frontend/src/components/gcr/GCRTrigger.tsx`

**Responsibilities:**
- Detect URL parameters để trigger popup
- Quản lý Google API ready state
- Render GCR popup với order data

## 2. Lifecycle Flow

### 2.1 Initial Page Load
```
1. User opens page with URL: /test?review_trigger=true
2. Next.js renders page với GCRTrigger component
3. GCRTrigger component mounts và reads URL parameters
4. Component checks if Google API ready
```

### 2.2 Google API Loading Process
```
1. Browser loads Google script (layout.tsx)
2. GCRTrigger polls for window.gapi availability
3. Polling interval: 100ms, timeout: 10 seconds
4. When ready: setGapiReady(true)
```

### 2.3 Trigger Conditions Check
```typescript
// Cả hai conditions phải true:
shouldTrigger = searchParams.get('review_trigger') === 'true'
gapiReady = window.gapi !== undefined
```

### 2.4 Popup Rendering
```
1. gapi.load('surveyoptin', callback)
2. gapi.surveyoptin.render(config)
3. Google displays popup với order information
4. User có thể submit review hoặc dismiss
```

## 3. Implementation Details

### 3.1 URL Parameter Detection
```typescript
const searchParams = useSearchParams()
const shouldTrigger = searchParams.get('review_trigger') === 'true'
```

**Supported URL formats:**
- `/test?review_trigger=true`
- `/test?review_trigger=true&order_id=ORDER-123`
- `/dashboard?review_trigger=true&email=customer@example.com`

### 3.2 Google API Ready Detection
```typescript
const [gapiReady, setGapiReady] = useState(false)

useEffect(() => {
  const checkGapi = () => {
    if (typeof window !== 'undefined' && window.gapi) {
      setGapiReady(true)
      return true
    }
    return false
  }

  // Polling mechanism với cleanup
  const interval = setInterval(checkGapi, 100)
  const timeout = setTimeout(() => clearInterval(interval), 10000)
  
  return () => {
    clearInterval(interval)
    clearTimeout(timeout)
  }
}, [])
```

### 3.3 Order Data Configuration
```typescript
const config = {
  "merchant_id": 123456789,        // TODO: Replace với real ID
  "order_id": orderData.id,        // Unique order identifier
  "email": orderData.email,        // Customer email
  "delivery_country": orderData.country,  // ISO country code
  "estimated_delivery_date": orderData.deliveryDate,  // YYYY-MM-DD
  "opt_in_style": "CENTER_DIALOG"  // Popup style
}
```

## 4. Email Integration Workflow

### 4.1 Email Template Setup
```html
<!-- Email template example -->
<a href="https://yourdomain.com/dashboard?review_trigger=true&order_id={{ORDER_ID}}">
  Rate your experience with us
</a>
```

### 4.2 Backend Email Sending
```typescript
// Pseudo code for email service
const emailData = {
  to: customer.email,
  template: 'review_request',
  variables: {
    ORDER_ID: order.id,
    REVIEW_LINK: `${DOMAIN}/dashboard?review_trigger=true&order_id=${order.id}`
  }
}

await emailService.send(emailData)
```

### 4.3 Customer Journey
```
1. Customer receives email với review link
2. Clicks link → Opens app với review_trigger=true
3. GCRTrigger detects parameter và triggers popup
4. Customer sees Google review popup
5. Customer submits review hoặc dismisses
```

## 5. Testing & Debugging

### 5.1 Local Development Testing
**Test Page:** `/test`

**Available test methods:**
- Button trigger: Adds URL parameter programmatically
- Direct URL: Manual URL với parameters
- Email simulation: Simulates email link click

### 5.2 Console Debug Output
```javascript
// Expected console logs:
"Google API ready!"
"GCR Debug: {shouldTrigger: true, gapiReady: true, orderData: {...}}"
"Loading GCR surveyoptin..."
"GCR surveyoptin loaded, rendering popup..."
"GCR Config: {merchant_id: 123456789, ...}"
```

### 5.3 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `hasGapi: false` | Google script chưa load | Wait hoặc check network |
| `404 from google.com` | Fake merchant ID | Use real merchant ID |
| `Popup không hiện` | Localhost limitation | Deploy to HTTPS domain |
| `shouldTrigger: false` | Missing URL parameter | Check URL format |

## 6. Production Deployment

### 6.1 Prerequisites
- ✅ Google Merchant Center account
- ✅ Real merchant ID từ Google
- ✅ HTTPS domain đã verify
- ✅ Domain whitelist trong Merchant Center

### 6.2 Configuration Updates
```typescript
// Update merchant_id trong GCRTrigger.tsx
"merchant_id": REAL_MERCHANT_ID,  // Replace 123456789

// Update domain trong email templates
const PRODUCTION_DOMAIN = "https://yourdomain.com"
```

### 6.3 Deployment Checklist
- [ ] Update merchant ID với real value
- [ ] Test trên staging environment
- [ ] Verify domain trong Google Merchant Center
- [ ] Test email links end-to-end
- [ ] Monitor console logs trong production
- [ ] Setup error tracking cho GCR failures

## 7. Monitoring & Analytics

### 7.1 Success Metrics
- GCR popup display rate
- Review submission rate
- Email click-through rate
- Console error frequency

### 7.2 Error Tracking
```typescript
// Add error tracking trong GCRTrigger
try {
  gapi.surveyoptin.render(config)
} catch (error) {
  console.error('GCR render failed:', error)
  // Send to error tracking service
}
```

## 8. File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Google script loading
│   │   └── (app)/
│   │       └── test/
│   │           └── page.tsx           # Testing interface
│   └── components/
│       └── gcr/
│           └── GCRTrigger.tsx         # Main GCR component
└── docs/
    └── 4-engineering/
        └── google-customer-reviews-integration.md  # This file
```

## 9. Security Considerations

### 9.1 Data Privacy
- Order data chỉ được truyền qua HTTPS
- Email addresses được validate trước khi gửi
- No sensitive financial data trong GCR config

### 9.2 Domain Security
- Chỉ whitelisted domains có thể trigger GCR
- Google validates merchant ID và domain
- HTTPS required cho production

## 10. Future Enhancements

### 10.1 Potential Improvements
- A/B testing cho popup timing
- Custom popup styling
- Integration với analytics platforms
- Automated email scheduling
- Multi-language support

### 10.2 Scalability Considerations
- Component có thể reuse cho multiple pages
- Order data có thể fetch từ API
- Support multiple merchant IDs cho multi-tenant

---

## Quick Reference

### Trigger GCR Popup
```typescript
// URL format
/any-page?review_trigger=true

// Component usage
<GCRTrigger orderData={{
  id: "ORDER-123",
  email: "customer@example.com", 
  country: "VN",
  deliveryDate: "2024-03-20"
}} />
```

### Debug Commands
```javascript
// Check if Google API ready
console.log('GAPI Ready:', !!window.gapi)

// Manual trigger (for testing)
window.gapi.load('surveyoptin', () => {
  window.gapi.surveyoptin.render({...config})
})
```

---

**Last Updated:** March 2024  
**Version:** 1.0  
**Status:** Production Ready (pending real merchant ID)