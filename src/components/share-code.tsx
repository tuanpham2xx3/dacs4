import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Check, Download } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { QRCodeSVG } from "qrcode.react"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface ShareCodeProps {
  code: string
  onBack: () => void
}

export function ShareCode({ code, onBack }: ShareCodeProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // URL cho QR code
  const qrUrl = `${window.location.origin}/receive/${code}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast({
        title: "Đã sao chép mã",
        description: "Mã chia sẻ đã được sao chép vào clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast({
        variant: "destructive",
        title: "Không thể sao chép",
        description: "Vui lòng thử sao chép mã thủ công",
      })
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      toast({
        title: "Đã sao chép đường dẫn",
        description: "Đường dẫn đã được sao chép vào clipboard. Bạn có thể chia sẻ trực tiếp.",
      })
    } catch (err) {
      console.error('Failed to copy link:', err)
      toast({
        variant: "destructive",
        title: "Không thể sao chép",
        description: "Vui lòng thử sao chép đường dẫn thủ công",
      })
    }
  }

  const handleBack = () => {
    toast({
      title: "Quay lại",
      description: "Bạn có thể tải lên file mới",
    })
    onBack()
  }

  return (
    <Card className="w-full border-rose-100 bg-gradient-to-b from-white to-rose-50/50">
      <CardHeader className="flex flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="mr-2"
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="text-rose-600">Mã Chia Sẻ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mã chia sẻ */}
        <div className="flex items-center justify-between p-4 bg-rose-50 rounded-lg">
          <span className="text-2xl font-mono font-bold text-rose-600">
            {code}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className={copied ? "text-green-500" : "text-rose-500"}
            aria-label={copied ? "Đã sao chép" : "Sao chép mã"}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <QRCodeSVG
              value={qrUrl}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#E11D48" // rose-600
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Quét mã QR hoặc click vào nút bên dưới để sao chép đường dẫn
            </p>
            <Button
              variant="outline"
              onClick={copyLink}
              className="border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <Copy className="mr-2 h-4 w-4" />
              Sao chép đường dẫn
            </Button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Chia sẻ mã này với người nhận để họ có thể tải file của bạn
          </p>
          <p className="text-xs text-gray-400">
            * Mã sẽ hết hạn sau khi file được tải về
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
