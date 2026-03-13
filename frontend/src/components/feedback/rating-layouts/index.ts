export { DisappointedLayout } from './DisappointedLayout'
export { NeutralLayout } from './NeutralLayout'
export { HappyLayout } from './HappyLayout'

// Export types for consistency
export interface RatingLayoutProps {
  rating: number
  customerName: string | null
  orderId: string
  email: string
}