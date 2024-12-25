import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download } from 'lucide-react'
import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function ReceiveSectionComponent() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const downloadStarted = useRef(false)
  const previousCode = useRef<string | null>(null)

  // Tự động điền mã từ URL parameter
  useEffect(() => {
    const codeFromUrl = searchParams.get('code')
    
    // Kiểm tra nếu mã mới khác mã cũ
    if (codeFromUrl && codeFromUrl !== previousCode.current && !downloadStarted.current) {
      previousCode.current = codeFromUrl
      setCode(codeFromUrl)
      downloadStarted.current = true
      // Tự động tải file nếu có mã
      handleDownload(codeFromUrl)
      toast({
        title: "Đang tải file",
        description: "File sẽ tự động tải xuống trong giây lát...",
      })
    }
    
    // Reset downloadStarted khi URL thay đổi
    return () => {
      if (!searchParams.get('code')) {
        downloadStarted.current = false
        previousCode.current = null
      }
    }
  }, [searchParams, toast])

  const handleDownload = useCallback(async (downloadCode?: string) => {
    const codeToUse = downloadCode || code
    if (!codeToUse.trim()) {
      toast({
        variant: "destructive",
        title: "Chưa nhập mã",
        description: "Vui lòng nhập mã chia sẻ để tải file",
      })
      return
    }

    if (isLoading) {
      toast({
        variant: "destructive",
        title: "Đang tải",
        description: "Vui lòng đợi file đang tải xuống hoàn tất",
      })
      return // Tránh tải nhiều lần khi đang tải
    }

    try {
      setIsLoading(true)
      toast({
        title: "Đang kiểm tra mã",
        description: "Vui lòng đợi trong giây lát...",
      })
      
      // Kiểm tra mã và lấy thông tin file
      const checkResponse = await fetch(`${API_URL}/api/files/check/${encodeURIComponent(codeToUse.trim())}`)
      if (!checkResponse.ok) {
        const errorData = await checkResponse.json()
        throw new Error(errorData.message || 'Mã không hợp lệ hoặc đã hết hạn')
      }

      const fileInfo = await checkResponse.json()
      toast({
        title: "Đã tìm thấy file",
        description: `Đang tải xuống: ${fileInfo.originalName}`,
      })
      
      // Tải file
      const response = await fetch(`${API_URL}/api/files/download/${encodeURIComponent(codeToUse.trim())}`)
      
      if (!response.ok) {
        throw new Error('Không thể tải file. Vui lòng thử lại sau.')
      }

      // Lấy tên file từ header Content-Disposition
      const contentDisposition = response.headers.get('content-disposition')
      let fileName = fileInfo.filename // Sử dụng tên file từ fileInfo làm backup

      if (contentDisposition) {
        // Xử lý filename*=UTF-8'' encoding
        const matches = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
        if (matches && matches[1]) {
          fileName = decodeURIComponent(matches[1])
        } else {
          // Fallback cho filename thường
          const filenameMatches = contentDisposition.match(/filename="?([^";\n]*)"?/i)
          if (filenameMatches && filenameMatches[1]) {
            fileName = filenameMatches[1]
          }
        }
      }

      // Tải file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Tải xuống thành công",
        description: `Đã tải file: ${fileName}. Mã chia sẻ đã hết hạn và không thể sử dụng lại.`,
      })

      // Reset form và các trạng thái
      setCode("")
      downloadStarted.current = false
      previousCode.current = null
      
      // Xóa code khỏi URL nếu đang ở trang download
      if (searchParams.has('code')) {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.delete('code')
        window.history.replaceState({}, '', `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`)
      }
    } catch (error) {
      console.error('Download error:', error)
      toast({
        variant: "destructive",
        title: "Lỗi tải xuống",
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải file. Vui lòng thử lại sau.',
      })
      
      // Reset trạng thái nếu lỗi
      downloadStarted.current = false
      previousCode.current = null
    } finally {
      setIsLoading(false)
    }
  }, [code, isLoading, toast, searchParams])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value)
  }, [])

  return (
    <Card className="w-full border-rose-100 bg-gradient-to-b from-white to-rose-50/50">
      <CardHeader>
        <CardTitle className="text-rose-600">Nhận File</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Nhập mã chia sẻ để tải file..."
            value={code}
            onChange={handleInputChange}
            className="border-rose-200 focus-visible:ring-rose-500"
          />
          <Button
            onClick={() => handleDownload()}
            disabled={isLoading || !code.trim()}
            className="bg-rose-500 hover:bg-rose-600"
          >
            {isLoading ? (
              "Đang tải..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Tải File
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-400">
          * Nhập mã chia sẻ 6 chữ số để tải file
        </p>
      </CardContent>
    </Card>
  )
}

// Wrap component với React.memo
export const ReceiveSection = memo(ReceiveSectionComponent)
