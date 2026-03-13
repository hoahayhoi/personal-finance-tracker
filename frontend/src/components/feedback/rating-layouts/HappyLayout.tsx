import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RatingLayoutProps } from './index'

export function HappyLayout({ rating, customerName, orderId, email }: RatingLayoutProps) {
  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="text-6xl mb-4">🎉</div>
        <CardTitle className="text-2xl text-green-800 mb-2">
          Tuyệt vời!
        </CardTitle>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-green-200 text-green-800">
            Đánh giá xuất sắc
          </Badge>
          <span className="text-green-600 font-bold text-lg">{rating}/10</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-4 text-green-700">
          <p className="text-lg">
            Xin chào <span className="font-semibold">{customerName}</span>,
          </p>
          
          <div className="bg-white/50 rounded-lg p-4 space-y-3">
            <p className="text-lg">
              <span className="text-2xl">🌟</span> Wow! Cảm ơn bạn đã đánh giá{' '}
              <span className="font-bold text-green-800">{rating}/10</span> cho dịch vụ của chúng tôi!{' '}
              <span className="text-2xl">🌟</span>
            </p>
            
            <p>
              Điều này thực sự làm chúng tôi vui mừng và tự hào. 
              Sự hài lòng của bạn là động lực lớn nhất để chúng tôi tiếp tục cải thiện 
              và mang đến những trải nghiệm tuyệt vời hơn nữa.
            </p>
          </div>
          
          <div className="bg-green-100 rounded-lg p-4 border border-green-200">
            <p className="font-semibold text-green-800 mb-2">
              🚀 Bạn có thể chia sẻ trải nghiệm này với cộng đồng không?
            </p>
            <p className="text-sm">
              Google sẽ mở popup để bạn có thể đánh giá và chia sẻ trải nghiệm tuyệt vời này!
            </p>
          </div>
        </div>

        {/* Celebration elements */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-200">
          <div className="text-center space-y-2">
            <div className="text-3xl">🏆</div>
            <p className="font-semibold text-green-800">Khách hàng xuất sắc!</p>
            <p className="text-sm text-green-700">
              Bạn là một trong những khách hàng đánh giá cao nhất của chúng tôi
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            ⭐ Đánh giá trên Google
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
          >
            📱 Chia sẻ với bạn bè
          </Button>
        </div>

        {/* Loyalty program hint */}
        <div className="bg-white/70 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎁</div>
            <div className="flex-1">
              <p className="font-semibold text-green-800">Ưu đãi đặc biệt</p>
              <p className="text-sm text-green-700">
                Nhận mã giảm giá 15% cho lần mua tiếp theo!
              </p>
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Nhận ngay
            </Button>
          </div>
        </div>

        {/* Order info */}
        <div className="text-center text-sm text-green-600 pt-4 border-t border-green-200">
          <p>Mã đơn hàng: <span className="font-mono">{orderId}</span></p>
          <p>Email: <span className="font-mono">{email}</span></p>
        </div>
      </CardContent>
    </Card>
  )
}