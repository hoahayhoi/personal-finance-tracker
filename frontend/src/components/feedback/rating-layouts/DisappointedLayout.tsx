import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RatingLayoutProps } from './index'

export function DisappointedLayout({ rating, customerName, orderId, email }: RatingLayoutProps) {
  return (
    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="text-6xl mb-4">😔</div>
        <CardTitle className="text-2xl text-red-800 mb-2">
          Chúng tôi rất tiếc
        </CardTitle>
        <div className="text-red-600 font-medium">
          Đánh giá: {rating}/10
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-4 text-red-700">
          <p className="text-lg">
            Xin chào <span className="font-semibold">{customerName}</span>,
          </p>
          
          <div className="bg-white/50 rounded-lg p-4 space-y-3">
            <p>
              Chúng tôi rất tiếc vì đã không thể phục vụ bạn tốt như mong đợi. 
              Đánh giá <span className="font-bold">{rating}/10</span> của bạn cho chúng tôi biết rằng 
              chúng tôi cần cải thiện nhiều hơn.
            </p>
            
            <p>
              Chúng tôi sẽ xem xét lại quy trình và cải thiện dịch vụ để mang đến 
              trải nghiệm tốt hơn cho bạn trong tương lai.
            </p>
          </div>
          
          <div className="bg-red-100 rounded-lg p-4 border border-red-200">
            <p className="font-semibold text-red-800">
              Cảm ơn bạn đã chia sẻ phản hồi thẳng thắn.
            </p>
            <p className="text-sm mt-2">
              Đội ngũ chăm sóc khách hàng sẽ liên hệ với bạn trong 24h tới.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
          >
            📞 Liên hệ hỗ trợ
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
          >
            📝 Gửi phản hồi chi tiết
          </Button>
        </div>

        {/* Order info */}
        <div className="text-center text-sm text-red-600 pt-4 border-t border-red-200">
          <p>Mã đơn hàng: <span className="font-mono">{orderId}</span></p>
          <p>Email: <span className="font-mono">{email}</span></p>
        </div>
      </CardContent>
    </Card>
  )
}