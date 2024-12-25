import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Send, X } from 'lucide-react'
import { SendOptions } from "./send-options"

interface FileInfo {
  name: string
  size: number
}

export function FileUpload() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [showSendOptions, setShowSendOptions] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const totalSize = files.reduce((acc, file) => {
    try {
      return acc + (typeof file.size === 'number' ? file.size : 0)
    } catch {
      return acc
    }
  }, 0)

  if (showSendOptions) {
    return <SendOptions />
  }

  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList) return
    
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      size: file.size
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full border-rose-100 bg-gradient-to-b from-white to-rose-50/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center text-rose-600">
            <Plus className="mr-2 h-5 w-5" />
            Add Files
          </div>
          <span className="text-sm text-rose-600/80">
            Total {files.length} files • {(totalSize / (1024 * 1024)).toFixed(2)} MB
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`min-h-[200px] rounded-lg border-2 border-dashed ${
            isDragging 
              ? 'border-rose-400 bg-rose-50/50' 
              : 'border-rose-200 bg-white/50'
          } p-4 transition-colors hover:border-rose-400 hover:bg-rose-50/50 cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
            multiple
          />
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-rose-50/50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-rose-600/90">{file.name}</span>
                    <span className="text-xs text-rose-600/70">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-rose-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-4 w-4 text-rose-600" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-rose-600/70">
                Drag and drop files here or click to browse
              </p>
            </div>
          )}
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          onClick={() => setShowSendOptions(true)}
          disabled={files.length === 0}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Files
        </Button>
      </CardContent>
    </Card>
  )
}
