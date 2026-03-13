'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import GCRTrigger from '@/components/gcr/GCRTrigger'
import { FeedbackLayout } from '@/components/feedback/FeedbackLayout'

export default function FeedbackPage() {
  const searchParams = useSearchParams()
  
  // Get URL parameters
  const reviewTrigger = searchParams.get('review_trigger') === 'true'
  const orderId = searchParams.get('order_id')
  const email = searchParams.get('email')
  const rating = searchParams.get('rating')
  const ratingNumber = rating ? parseInt(rating, 10) : null

  // Extract customer name from email
  const customerName = useMemo(() => {
    if (!email) return null
    const localPart = email.split('@')[0]
    return localPart.charAt(0).toUpperCase() + localPart.slice(1)
  }, [email])

  // Order data for GCR
  const orderData = {
    id: orderId || 'ORDER-2024-001',
    email: email || 'customer@example.com',
    country: 'VN',
    deliveryDate: '2024-03-20'
  }

  // Validate required parameters
  if (!reviewTrigger || ratingNumber === null || !email || !orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800">Thiếu thông tin</h1>
          <p className="text-gray-600">
            URL cần có đầy đủ: review_trigger, rating, email, order_id
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-700 font-semibold mb-2">Ví dụ URL đúng:</p>
            <p className="text-xs text-gray-600 font-mono break-all">
              /feedback?review_trigger=true&rating=8&email=customer@example.com&order_id=ORDER-001
            </p>
          </div>
          <Link href="/test">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại Test Page
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* GCR Trigger Component - chỉ trigger nếu rating 7-10 */}
      <GCRTrigger orderData={orderData} />
      
      {/* Main Feedback Layout */}
      <FeedbackLayout 
        rating={ratingNumber}
        customerName={customerName}
        orderId={orderId}
        email={email}
      />
    </>
  )
}