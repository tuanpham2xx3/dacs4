import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-rose-500 to-pink-500">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-white">SendAnywhere</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
          <Link to="/transfer" className="text-white/90 transition-colors hover:text-white">Transfer</Link>
          <Link to="/product" className="text-white/90 transition-colors hover:text-white">Product</Link>
          <Link to="/pricing" className="text-white/90 transition-colors hover:text-white">Pricing</Link>
          <Link to="/download" className="text-white/90 transition-colors hover:text-white">Download</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" className="bg-white text-rose-600 hover:bg-rose-50">Contact Us</Button>
          <Button variant="ghost" className="text-white hover:bg-white/20">Sign in</Button>
        </div>
      </div>
    </header>
  )
}
