import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ShareCode } from "./share-code"

const API_URL = import.meta.env.VITE_API_URL || 'https://dacs4-server.onrender.com/'

interface FileInfo {
  name: string
  size: number
}

export function FileUpload() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [shareCode, setShareCode] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  
  const handleFileChange = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    
    const file = fileList[0] // Chỉ xử lý 1 file
    
    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${API_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Tải lên thất bại')
      }
      
      const data = await response.json()
      setShareCode(data.code)
      setFiles([{ name: file.name, size: file.size }])
      
      toast({
        title: "Tải lên thành công",
        description: `Mã chia sẻ của bạn là: ${data.code}`,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        variant: "destructive",
        title: "Lỗi tải lên",
        description: "Có lỗi xảy ra khi upload file",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }

  const removeFile = () => {
    setFiles([])
    setShareCode('')
    toast({
      title: "Đã hủy chia sẻ",
      description: "Bạn có thể tải lên file mới",
    })
  }

  if (shareCode) {
    return <ShareCode code={shareCode} onBack={removeFile} />
  }

  return (
    <Card className={`w-full border-rose-100 bg-gradient-to-b from-white to-rose-50/50 ${
      isDragging ? 'border-rose-500 border-2' : ''
    }`}>
      <CardHeader>
        <CardTitle className="text-rose-600">Tải File Lên</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-rose-200 rounded-lg p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
          />
          {files.length > 0 ? (
            <div className="space-y-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-500"
                  >
                    Xóa
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-rose-600 mb-2">
                Kéo thả file vào đây hoặc click để chọn file
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                {isUploading ? 'Đang tải...' : 'Chọn File'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
