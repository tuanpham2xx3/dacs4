import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download } from 'lucide-react'
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function ReceiveSection() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a code first",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/files/download/${encodeURIComponent(code.trim())}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to download file' }))
        throw new Error(errorData.message || 'Invalid code or file not found')
      }

      const blob = await response.blob()
      const contentDisposition = response.headers.get('content-disposition')
      let fileName = 'downloaded-file'
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
        if (fileNameMatch?.[1]) {
          fileName = fileNameMatch[1]
        }
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "File downloaded successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to download file',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-rose-100 bg-gradient-to-b from-white to-rose-50/50">
      <CardHeader className="text-center">
        <CardTitle className="text-rose-600">Receive</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 max-w-md mx-auto">
          <Input 
            placeholder="Input key" 
            className="border-rose-200 focus-visible:ring-rose-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            variant="outline" 
            className="border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
