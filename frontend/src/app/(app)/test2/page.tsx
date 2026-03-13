'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

declare global {
  interface Window {
    ___gcfg: {
      lang: string
    }
  }
}

export default function Test2Page() {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [followModuleReady, setFollowModuleReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [followButtonsVisible, setFollowButtonsVisible] = useState(false)

  const handleTriggerGoogleScript = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Configure Google API
      window.___gcfg = {
        lang: 'vi'
      }

      // Load Google Platform API script
      const loadGoogleScript = () => {
        return new Promise<void>((resolve, reject) => {
          // Check if script already exists
          if (document.querySelector('script[src*="apis.google.com/js/platform.js"]')) {
            setScriptLoaded(true)
            resolve()
            return
          }

          const script = document.createElement('script')
          script.src = 'https://apis.google.com/js/platform.js'
          script.async = true
          script.defer = true
          
          script.onload = () => {
            console.log('✅ Google Platform script loaded')
            setScriptLoaded(true)
            resolve()
          }
          
          script.onerror = () => {
            console.error('❌ Failed to load Google Platform script')
            reject(new Error('Không thể tải Google Platform script'))
          }

          document.head.appendChild(script)
        })
      }

      // Load Follow module
      const loadFollowModule = () => {
        return new Promise<void>((resolve) => {
          const checkAndLoad = () => {
            if (typeof window.gapi !== 'undefined' && window.gapi) {
              window.gapi.load('follow', () => {
                console.log('✅ Google Follow module loaded')
                setFollowModuleReady(true)
                resolve()
              })
            } else {
              // Retry after a short delay
              setTimeout(checkAndLoad, 100)
            }
          }
          checkAndLoad()
        })
      }

      // Load script first, then module
      await loadGoogleScript()
      await loadFollowModule()

      // Show follow buttons after successful loading
      setFollowButtonsVisible(true)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const testUrls = [
    {
      name: 'Google Vietnam (Example)',
      url: 'https://plus.google.com/+GoogleVn',
      description: 'URL mẫu từ Google Vietnam'
    },
    {
      name: 'Custom URL Test',
      url: 'https://example.com',
      description: 'URL tùy chỉnh để test'
    },
    {
      name: 'Finance Tracker',
      url: 'https://finance-tracker.example.com',
      description: 'URL giả định của dự án'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test 2 - Google+ Follow Button</h1>
        <p className="text-muted-foreground">
          Testing Google+ Follow button integration (Legacy API)
        </p>
      </div>

      {/* Trigger Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🚀</span>
            Trigger Google+ Integration
          </CardTitle>
          <CardDescription>
            Click để load Google Platform script và hiển thị Follow buttons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTriggerGoogleScript}
            disabled={isLoading || followButtonsVisible}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Đang tải Google Script...
              </>
            ) : followButtonsVisible ? (
              <>
                <span className="mr-2">✅</span>
                Google+ Follow Buttons Đã Sẵn Sàng
              </>
            ) : (
              <>
                <span className="mr-2">🔥</span>
                Trigger Google+ Follow Integration
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={scriptLoaded ? "default" : "secondary"}>
                {scriptLoaded ? "✅" : "⏳"} Google Platform Script
              </Badge>
              <span className="text-sm text-muted-foreground">
                {scriptLoaded ? "Loaded" : "Chưa load"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={followModuleReady ? "default" : "secondary"}>
                {followModuleReady ? "✅" : "⏳"} Follow Module
              </Badge>
              <span className="text-sm text-muted-foreground">
                {followModuleReady ? "Ready" : "Chưa sẵn sàng"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={followButtonsVisible ? "default" : "secondary"}>
                {followButtonsVisible ? "✅" : "⏳"} Follow Buttons UI
              </Badge>
              <span className="text-sm text-muted-foreground">
                {followButtonsVisible ? "Hiển thị" : "Chưa hiển thị"}
              </span>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Follow Buttons Test - Only show after trigger */}
      {followButtonsVisible && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>👥</span>
              Google+ Follow Buttons
            </CardTitle>
            <CardDescription>
              Test các nút Follow với URL khác nhau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {testUrls.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="mb-3">
                    <h4 className="font-semibold text-green-900">{item.name}</h4>
                    <p className="text-sm text-green-700">{item.description}</p>
                    <code className="text-xs bg-green-100 px-2 py-1 rounded mt-1 inline-block text-green-800">
                      {item.url}
                    </code>
                  </div>
                  
                  {/* Google+ Follow Button */}
                  <div 
                    className="g-follow" 
                    data-href={item.url}
                    data-rel="publisher"
                    data-height="20"
                  ></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Implementation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💻</span>
            Implementation Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Button Trigger Flow:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Click button để trigger</li>
                <li>2. Load Google Platform script</li>
                <li>3. Initialize Follow module</li>
                <li>4. Hiển thị Follow buttons UI</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Script Code:</h4>
              <pre className="text-sm text-green-800 bg-green-100 p-2 rounded overflow-x-auto">
{`<script src="https://apis.google.com/js/platform.js" async defer></script>
<script>
  window.___gcfg = { lang: 'vi' };
  
  window.gapi.load('follow', function() {
    console.log('✅ Module follow đã sẵn sàng');
  });
</script>`}
              </pre>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">HTML Button:</h4>
              <pre className="text-sm text-purple-800 bg-purple-100 p-2 rounded overflow-x-auto">
{`<div class="g-follow" 
     data-href="https://plus.google.com/+GoogleVn" 
     data-rel="publisher">
</div>`}
              </pre>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Lưu ý quan trọng:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Google+ đã ngừng hoạt động từ 2019</li>
                <li>• API này chỉ để test cơ chế tải module</li>
                <li>• Nút có thể hiển thị lỗi hoặc không hoạt động</li>
                <li>• Không cần Merchant Center cho module này</li>
                <li>• Tương tự như GCR trigger mechanism</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Console Logs */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <span>🔍</span>
            Debug Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Mở <strong>Developer Console</strong> để xem logs</p>
            <p>• Script status: <Badge variant="outline">{scriptLoaded ? "Loaded" : "Not Loaded"}</Badge></p>
            <p>• Follow module: <Badge variant="outline">{followModuleReady ? "Ready" : "Not Ready"}</Badge></p>
            <p>• UI visible: <Badge variant="outline">{followButtonsVisible ? "Yes" : "No"}</Badge></p>
            <p>• Language: <Badge variant="outline">Vietnamese (vi)</Badge></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}