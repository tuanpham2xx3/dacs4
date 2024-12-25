import { SiteHeader } from "@/components/site-header"
import { FileUpload } from "@/components/file-upload"
import { ReceiveSection } from "@/components/receive-section"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from "react-router-dom";

// Component để xử lý redirect từ QR code
function ReceiveRedirect() {
  const { code } = useParams()
  return <Navigate to={`/?code=${code}`} replace />
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/30 to-white">
        <SiteHeader />
        <main className="flex-1 container py-12 flex items-center">
          <Routes>
            <Route path="/" element={
              <div className="w-full max-w-xl mx-auto space-y-8">
                <FileUpload />
                <ReceiveSection />
              </div>
            } />
            <Route path="/receive/:code" element={<ReceiveRedirect />} />
          </Routes>
        </main>
        <SiteFooter />
        <Toaster />
      </div>
    </Router>
  );
}
