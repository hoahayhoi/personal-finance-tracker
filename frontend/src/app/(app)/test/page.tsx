'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import GCRTrigger from '@/components/gcr/GCRTrigger'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function TestPage() {
  const router = useRouter()
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

  // Sample order data for testing
  const sampleOrderData = {
    id: orderId || 'ORDER-2024-001',
    email: email || 'customer@example.com',
    country: 'VN',
    deliveryDate: '2024-03-20'
  }

  const handleTriggerGCRByURL = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('review_trigger', 'true')
    
    // Navigate to URL with trigger parameter
    router.push(currentUrl.pathname + currentUrl.search)
  }

  const handleSimulateEmailLink = (testRating?: number) => {
    // Simulate clicking link from email - redirect to feedback page
    const emailLink = `/feedback?review_trigger=true&order_id=${sampleOrderData.id}&email=${sampleOrderData.email}&rating=${testRating || 8}`
    router.push(emailLink)
  }

  // Rating-based layout content
  const getRatingContent = () => {
    if (!reviewTrigger || ratingNumber === null) return null

    if (ratingNumber >= 1 && ratingNumber <= 4) {
      // Disappointed layout (1-4)
      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <span>😔</span>
              Chúng tôi rất tiếc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-red-700">
              <p>Xin chào {customerName},</p>
              <p>
                Chúng tôi rất tiếc vì đã không thể phục vụ bạn tốt như mong đợi. 
                Đánh giá {ratingNumber}/10 của bạn cho chúng tôi biết rằng chúng tôi cần cải thiện nhiều hơn.
              </p>
              <p>
                Chúng tôi sẽ xem xét lại quy trình và cải thiện dịch vụ để mang đến trải nghiệm tốt hơn cho bạn trong tương lai.
              </p>
              <p className="font-semibold">Cảm ơn bạn đã chia sẻ phản hồi thẳng thắn.</p>
            </div>
          </CardContent>
        </Card>
      )
    } else if (ratingNumber >= 5 && ratingNumber <= 7) {
      // Neutral/Improvement layout (5-7)
      return (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <span>🙏</span>
              Cảm ơn bạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-yellow-700">
              <p>Xin chào {customerName},</p>
              <p>
                Cảm ơn bạn đã đánh giá {ratingNumber}/10 cho dịch vụ của chúng tôi. 
                Chúng tôi biết rằng vẫn còn nhiều điều cần cải thiện.
              </p>
              <p>
                Đội ngũ của chúng tôi đang không ngừng nỗ lực để nâng cao chất lượng dịch vụ 
                và mang đến trải nghiệm tốt hơn cho bạn trong những lần tiếp theo.
              </p>
              <p className="font-semibold">Chúng tôi sẽ cố gắng hơn nữa!</p>
            </div>
          </CardContent>
        </Card>
      )
    } else if (ratingNumber >= 8 && ratingNumber <= 10) {
      // Happy layout (8-10) + GCR trigger
      return (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <span>🎉</span>
              Tuyệt vời!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-green-700">
              <p>Xin chào {customerName},</p>
              <p>
                Wow! Cảm ơn bạn đã đánh giá {ratingNumber}/10 cho dịch vụ của chúng tôi! 
                Điều này thực sự làm chúng tôi vui mừng và tự hào.
              </p>
              <p>
                Sự hài lòng của bạn là động lực lớn nhất để chúng tôi tiếp tục cải thiện 
                và mang đến những trải nghiệm tuyệt vời hơn nữa.
              </p>
              <p className="font-semibold">
                Bạn có thể chia sẻ trải nghiệm này với cộng đồng không? 
                {ratingNumber >= 7 && " (Google sẽ mở popup để bạn đánh giá)"}
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      {/* GCR Trigger Component - chỉ trigger nếu rating 7-10 */}
      <GCRTrigger orderData={sampleOrderData} />

      {/* Rating-based content */}
      {getRatingContent()}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Page</h1>
        <p className="text-muted-foreground">
          Testing area for Google Customer Reviews integration with rating-based layout
        </p>
      </div>

      {/* Google Customer Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🌟</span>
            Google Customer Reviews Integration với Rating
          </CardTitle>
          <CardDescription>
            Test GCR popup trigger dựa trên rating (chỉ hiện popup nếu rating 7-10).
            Các nút test sẽ redirect đến trang feedback riêng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Cách hoạt động:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• GCR chỉ trigger khi rating từ <Badge variant="secondary">7-10</Badge></li>
                <li>• Rating 1-4: Layout tiếc nuối</li>
                <li>• Rating 5-7: Layout cảm ơn và cải thiện</li>
                <li>• Rating 8-10: Layout vui vẻ + GCR popup</li>
                <li>• Tên khách hàng lấy từ email parameter</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button 
                onClick={() => handleSimulateEmailLink(3)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                � Test Rating 3
              </Button>
              
              <Button 
                onClick={() => handleSimulateEmailLink(6)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
              >
                � Test Rating 6
              </Button>

              <Button 
                onClick={() => handleSimulateEmailLink(8)}
                className="bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                🎉 Test Rating 8
              </Button>

              <Button 
                onClick={() => handleSimulateEmailLink(10)}
                className="bg-green-700 hover:bg-green-800 text-white text-xs"
              >
                🌟 Test Rating 10
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Test URLs sẽ redirect đến:</strong></p>
              <p>• /feedback?review_trigger=true&rating=X&order_id=ORDER-2024-001&email=customer@example.com</p>
              <p><strong>Current URL Parameters:</strong></p>
              <p>• review_trigger: {reviewTrigger ? 'true' : 'false'}</p>
              <p>• rating: {rating || 'none'}</p>
              <p>• order_id: {orderId || 'none'}</p>
              <p>• email: {email || 'none'}</p>
              <p>• customer_name: {customerName || 'none'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🔗</span>
            URL Testing Examples
          </CardTitle>
          <CardDescription>
            Các URL example để test GCR trigger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
              <strong>Trigger GCR:</strong><br />
              /test?review_trigger=true
            </div>
            <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
              <strong>With Order ID:</strong><br />
              /test?review_trigger=true&order_id=ORDER-2024-001
            </div>
            <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
              <strong>Email Link Example:</strong><br />
              /test?review_trigger=true&order_id=ORDER-2024-001&email=customer@example.com
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Info */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <span>ℹ️</span>
            Development Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Google Script:</strong> Đã load trong layout.tsx</p>
            <p>• <strong>GCRTrigger Component:</strong> Client component tự động detect URL params</p>
            <p>• <strong>Merchant ID:</strong> Hiện tại dùng placeholder (123456789)</p>
            <p>• <strong>Trigger Method:</strong> URL parameter thay vì button click</p>
            <p>• <strong>Email Integration:</strong> Sẵn sàng cho việc gửi link qua email</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}