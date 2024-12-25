import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCcw, ArrowLeft } from 'lucide-react'

interface ShareCodeProps {
  onBack: () => void;
}

export function ShareCode({ onBack }: ShareCodeProps) {
  const [shareCode, setShareCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Giả lập tạo mã ngẫu nhiên 6 chữ số
  const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setShareCode(code)
  }

  useEffect(() => {
    generateCode()
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card className="w-full border-rose-100 bg-gradient-to-b from-white to-rose-50/50">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4 text-rose-600 hover:bg-rose-50"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-center text-rose-600 mt-2">Share Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold tracking-wider text-rose-600 bg-rose-50 px-6 py-3 rounded-lg">
            {shareCode}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button
              variant="outline"
              className="border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              onClick={generateCode}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              New Code
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <QRCodeSVG
              value={`https://your-domain.com/receive/${shareCode}`}
              size={200}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/qr-logo.png",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          <p className="text-sm text-rose-600/70 text-center">
            Scan this QR code or share the code above<br />
            to let others receive your files
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
