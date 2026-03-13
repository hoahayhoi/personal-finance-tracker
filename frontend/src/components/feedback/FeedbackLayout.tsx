import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { 
  DisappointedLayout,
  NeutralLayout, 
  HappyLayout 
} from './rating-layouts'

interface FeedbackLayoutProps {
  rating: number
  customerName: string | null
  orderId: string
  email: string
}

export function FeedbackLayout({ rating, customerName, orderId, email }: FeedbackLayoutProps) {
  // Determine rating category
  const getRatingCategory = (rating: number): 'disappointed' | 'neutral' | 'happy' => {
    if (rating >= 1 && rating <= 4) return 'disappointed'
    if (rating >= 5 && rating <= 7) return 'neutral'
    if (rating >= 8 && rating <= 10) return 'happy'
    return 'neutral'
  }

  const category = getRatingCategory(rating)

  // Render appropriate layout based on rating
  const renderRatingLayout = () => {
    const commonProps = {
      rating,
      customerName,
      orderId,
      email
    }

    switch (category) {
      case 'disappointed':
        return <DisappointedLayout {...commonProps} />
      case 'neutral':
        return <NeutralLayout {...commonProps} />
      case 'happy':
        return <HappyLayout {...commonProps} />
      default:
        return <NeutralLayout {...commonProps} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with rating info */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            Đánh giá: {rating}/10
          </Badge>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cảm ơn phản hồi của bạn
          </h1>
          <p className="text-gray-600">
            Mã đơn hàng: {orderId}
          </p>
        </div>

        {/* Dynamic rating layout */}
        <div className="max-w-2xl mx-auto">
          {renderRatingLayout()}
        </div>

        {/* Footer info */}
        <div className="text-center mt-12 space-y-4">
          <Link href="/test">
            <Button variant="ghost" className="flex items-center gap-2 mx-auto">
              <ArrowLeft className="h-4 w-4" />
              Quay lại Test Page để thử rating khác
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            Personal Finance Tracker - Cảm ơn bạn đã sử dụng dịch vụ
          </p>
        </div>
      </div>
    </div>
  )
}