'use client'

import { useEffect, useState } from 'react'
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
    renderOptIn?: () => void
  }
}

export default function GCRTrigger({ orderData }: GCRProps) {
  const searchParams = useSearchParams()
  const shouldTrigger = searchParams.get('review_trigger') === 'true'
  const [gapiReady, setGapiReady] = useState(false)

  useEffect(() => {
    const checkGapi = () => {
      if (typeof window !== 'undefined' && window.gapi) {
        console.log('Google API ready!')
        setGapiReady(true)
        return true
      }
      return false
    }

    if (checkGapi()) return

    const interval = setInterval(() => {
      if (checkGapi()) {
        clearInterval(interval)
      }
    }, 100)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      console.log('Google API load timeout')
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    console.log('GCR Debug:', { shouldTrigger, gapiReady, orderData })
    
    if (shouldTrigger && gapiReady && typeof window !== 'undefined' && window.gapi) {
      const gapi = window.gapi

      console.log('Loading GCR surveyoptin...')
      gapi.load('surveyoptin', function() {
        console.log('GCR surveyoptin loaded, rendering popup...')
        
        const config = {
          "merchant_id": 123456789,
          "order_id": orderData.id,
          "email": orderData.email,
          "delivery_country": orderData.country,
          "estimated_delivery_date": orderData.deliveryDate,
          "opt_in_style": "CENTER_DIALOG"
        }
        
        console.log('GCR Config:', config)
        gapi.surveyoptin.render(config)
      })
    } else {
      console.log('GCR not triggered:', { 
        shouldTrigger, 
        gapiReady,
        hasWindow: typeof window !== 'undefined',
        hasGapi: !!(typeof window !== 'undefined' && window.gapi)
      })
    }
  }, [shouldTrigger, gapiReady, orderData])

  return null
}