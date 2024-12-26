import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2 } from 'lucide-react'
import { ShareCode } from "./share-code"

export function SendOptions() {
  const [showShareCode, setShowShareCode] = useState(false)
  const [shareCode] = useState<string | null>(null)

  if (showShareCode && shareCode) {
    return <ShareCode code={shareCode} onBack={() => setShowShareCode(false)} />
  }

  return (
    <Card className="w-full border-rose-100 bg-gradient-to-b from-white to-rose-50/50">
      <CardHeader>
        <CardTitle className="text-rose-600">Send Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Button 
            variant="outline" 
            className="w-full border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            onClick={() => setShowShareCode(true)}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Generate Share Code
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-rose-100" />
            </div>
            
          </div>
          
          <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            Send Files
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
