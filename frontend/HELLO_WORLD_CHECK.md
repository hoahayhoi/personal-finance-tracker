# Next.js Hello World Check Guide

Hướng dẫn kiểm tra Next.js app có chạy được Hello World không.

## 1. Kiểm tra Dependencies

### Check package.json
```bash
cd frontend
cat package.json
```

**Cần có:**
- `next`: 15.5.12
- `react`: 19.1.0
- `react-dom`: 19.1.0
- `typescript`: ^5

### Clean Install (nếu cần)
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại
npm install
```

---

## 2. Kiểm tra File Structure

### Cần có các file này:
```
frontend/
├── src/
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
├── package.json
├── next.config.ts
├── tailwind.config.ts (nếu có)
└── tsconfig.json
```

### Check layout.tsx
```bash
cat src/app/layout.tsx
```

**Nội dung tối thiểu:**
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Check page.tsx
```bash
cat src/app/page.tsx
```

**Nội dung tối thiểu:**
```tsx
export default function HomePage() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>Next.js is working!</p>
    </div>
  )
}
```

---

## 3. Start Development Server

### Method 1: npm run dev
```bash
cd frontend
npm run dev
```

### Method 2: npx next dev
```bash
cd frontend
npx next dev
```

### Method 3: With Turbopack (faster)
```bash
cd frontend
npm run dev --turbo
```

---

## 4. Check Server Output

**Successful output should look like:**
```
   ▲ Next.js 15.5.12
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 2.3s
```

**Common errors:**
- `Module not found` → Run `npm install`
- `Port 3000 already in use` → Use different port: `npm run dev -- -p 3001`
- `TypeScript errors` → Check tsconfig.json

---

## 5. Test in Browser

### Open Browser
```
http://localhost:3000
```

**Should see:**
- "Hello World" heading
- "Next.js is working!" text
- No console errors in DevTools (F12)

### Check Network Tab
- Should see successful requests to `/_next/static/`
- No 404 or 500 errors

---

## 6. Troubleshooting

### Error: "Module not found"
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
npx kill-port 3000
```

### Error: TypeScript issues
```bash
# Check TypeScript config
npx tsc --noEmit

# Generate types
npm run build
```

### Error: "Cannot resolve module"
Check `next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
```

---

## 7. Quick Test Commands

### All-in-one check:
```bash
cd frontend && \
echo "📦 Checking dependencies..." && \
npm list next react react-dom && \
echo "🔧 Starting dev server..." && \
timeout 10s npm run dev || echo "✅ Server started (timeout after 10s)"
```

### Manual step-by-step:
```bash
# 1. Go to frontend
cd frontend

# 2. Check if Next.js is installed
npm list next

# 3. Check main files exist
ls -la src/app/

# 4. Start server
npm run dev
```

---

## 8. Expected Results

### ✅ Success Indicators:
- Server starts without errors
- Browser shows "Hello World"
- Hot reload works (edit page.tsx and see changes)
- No console errors
- Fast refresh works

### ❌ Failure Indicators:
- Server won't start
- Blank page in browser
- Console errors
- Module not found errors
- TypeScript compilation errors

---

## 9. Next Steps After Hello World Works

1. **Add basic styling** (Tailwind CSS)
2. **Test routing** (create new pages)
3. **Add components** (create components folder)
4. **Test builds** (`npm run build`)
5. **Setup environment** (`.env.local`)

---

## 10. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000 busy | Use `npm run dev -- -p 3001` |
| Module errors | `rm -rf node_modules && npm install` |
| TypeScript errors | Check `tsconfig.json` |
| Build fails | Run `npm run build` to see errors |
| Hot reload broken | Restart dev server |
| Blank page | Check browser console for errors |

---

## Quick Verification Script

Create this file as `check-hello-world.sh`:

```bash
#!/bin/bash
echo "🚀 Next.js Hello World Check"
echo "=========================="

cd frontend

echo "📦 Checking package.json..."
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json missing"
    exit 1
fi

echo "📁 Checking app structure..."
if [ -f "src/app/layout.tsx" ] && [ -f "src/app/page.tsx" ]; then
    echo "✅ App structure exists"
else
    echo "❌ Missing layout.tsx or page.tsx"
    exit 1
fi

echo "🔧 Installing dependencies..."
npm install

echo "🚀 Starting dev server (will timeout after 15s)..."
timeout 15s npm run dev &
sleep 10

echo "🌐 Testing localhost:3000..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is responding"
else
    echo "❌ Server not responding"
fi

echo "✅ Check complete! Open http://localhost:3000 in browser"
```

Run with: `chmod +x check-hello-world.sh && ./check-hello-world.sh`