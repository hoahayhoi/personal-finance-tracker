'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface GCRProps {
  orderData: {
    id: string
    email: string
    country: string
    deliveryDate: string
  }
}

// Extend Window interface to include gapi
declare global {
  interface Window {
    gapi?: {
      load: (api: string, callback: () => void) => void
      surveyoptin: {
        render: (config: {
          merchant_id: number
          order_id: string
          email: string
          delivery_country: string
          estimated_delivery_date: string
          opt_in_style: string
        }) => void
      }
    }
  }
}

export default function GCRTrigger({ orderData }: GCRProps) {
  const searchParams = useSearchParams()
  const shouldTrigger = searchParams.get('review_trigger') === 'true'

  useEffect(() => {
    // Chỉ chạy nếu có cờ review_trigger và window.gapi đã sẵn sàng
    if (shouldTrigger && typeof window !== 'undefined' && window.gapi) {
      const gapi = window.gapi

      gapi.load('surveyoptin', function() {
        gapi.surveyoptin.render({
          "merchant_id": 123456789, // TODO: Thay bằng ID thật từ anh Đức
          "order_id": orderData.id,
          "email": orderData.email,
          "delivery_country": orderData.country,
          "estimated_delivery_date": orderData.deliveryDate,
          "opt_in_style": "CENTER_DIALOG"
        })
      })
    }
  }, [shouldTrigger, orderData])

  // Component này không hiển thị gì lên giao diện
  return null
}