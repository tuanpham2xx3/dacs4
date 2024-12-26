import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Globe } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-rose-100 bg-gradient-to-b from-rose-50/50 to-white pl-10">
      <div className="container flex justify-between items-center h-14 text-sm">
        <div className="flex space-x-4">
          <Link to="/about" className="text-rose-600/70 hover:text-rose-600">
            About Us
          </Link>
          <Link to="/help" className="text-rose-600/70 hover:text-rose-600">
            Help Center
          </Link>
          <Link to="/notice" className="text-rose-600/70 hover:text-rose-600">
            Notice
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50">
            <Globe className="mr-2 h-4 w-4" />
            Language
          </Button>
          <div className="text-sm text-rose-600/70">
            Rakuten Symphony Korea, Inc.
          </div>
        </div>
      </div>
    </footer>
  )
}

