'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import GCRTrigger from '@/components/gcr/GCRTrigger'
import { useRouter } from 'next/navigation'

export default function TestPage() {
  const router = useRouter()

  // Sample order data for testing
  const sampleOrderData = {
    id: 'ORDER-2024-001',
    email: 'customer@example.com',
    country: 'VN',
    deliveryDate: '2024-03-20'
  }

  const handleTriggerGCRByURL = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('review_trigger', 'true')
    
    // Navigate to URL with trigger parameter
    router.push(currentUrl.pathname + currentUrl.search)
  }

  const handleSimulateEmailLink = () => {
    // Simulate clicking link from email
    const emailLink = `/test?review_trigger=true&order_id=${sampleOrderData.id}`
    router.push(emailLink)
  }

  return (
    <div className="space-y-6">
      {/* GCR Trigger Component - sẽ tự động trigger nếu có review_trigger=true */}
      <GCRTrigger orderData={sampleOrderData} />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Page</h1>
        <p className="text-muted-foreground">
          Testing area for Google Customer Reviews integration
        </p>
      </div>

      {/* Google Customer Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🌟</span>
            Google Customer Reviews Integration
          </CardTitle>
          <CardDescription>
            Test GCR popup trigger via URL parameters (như từ email)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Cách hoạt động:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• GCR sẽ trigger khi URL có parameter <Badge variant="secondary">review_trigger=true</Badge></li>
                <li>• Component GCRTrigger sẽ tự động detect và hiển thị popup</li>
                <li>• Thường được gọi từ link trong email gửi khách hàng</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleTriggerGCRByURL}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                🚀 Trigger GCR (Add URL Param)
              </Button>
              
              <Button 
                onClick={handleSimulateEmailLink}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                📧 Simulate Email Link
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Sample Order Data:</strong></p>
              <p>• Order ID: {sampleOrderData.id}</p>
              <p>• Email: {sampleOrderData.email}</p>
              <p>• Country: {sampleOrderData.country}</p>
              <p>• Delivery Date: {sampleOrderData.deliveryDate}</p>
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