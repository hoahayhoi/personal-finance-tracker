import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RatingLayoutProps } from './index'

export function NeutralLayout({ rating, customerName, orderId, email }: RatingLayoutProps) {
  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="text-6xl mb-4">🙏</div>
        <CardTitle className="text-2xl text-yellow-800 mb-2">
          Cảm ơn bạn
        </CardTitle>
        <div className="text-yellow-600 font-medium">
          Đánh giá: {rating}/10
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-4 text-yellow-700">
          <p className="text-lg">
            Xin chào <span className="font-semibold">{customerName}</span>,
          </p>
          
          <div className="bg-white/50 rounded-lg p-4 space-y-3">
            <p>
              Cảm ơn bạn đã đánh giá <span className="font-bold">{rating}/10</span> cho dịch vụ của chúng tôi. 
              Chúng tôi biết rằng vẫn còn nhiều điều cần cải thiện.
            </p>
            
            <p>
              Đội ngũ của chúng tôi đang không ngừng nỗ lực để nâng cao chất lượng dịch vụ 
              và mang đến trải nghiệm tốt hơn cho bạn trong những lần tiếp theo.
            </p>
          </div>
          
          <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-200">
            <p className="font-semibold text-yellow-800">
              Chúng tôi sẽ cố gắng hơn nữa!
            </p>
            <p className="text-sm mt-2">
              Mọi ý kiến đóng góp của bạn đều rất quý giá với chúng tôi.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            💡 Đề xuất cải thiện
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            📧 Nhận thông tin cập nhật
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="bg-white/70 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between text-sm text-yellow-700 mb-2">
            <span>Tiến độ cải thiện dịch vụ</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            Chúng tôi đang triển khai nhiều cải tiến dựa trên phản hồi khách hàng
          </p>
        </div>

        {/* Order info */}
        <div className="text-center text-sm text-yellow-600 pt-4 border-t border-yellow-200">
          <p>Mã đơn hàng: <span className="font-mono">{orderId}</span></p>
          <p>Email: <span className="font-mono">{email}</span></p>
        </div>
      </CardContent>
    </Card>
  )
}