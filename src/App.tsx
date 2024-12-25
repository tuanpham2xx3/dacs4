import { SiteHeader } from "@/components/site-header"
import { FileUpload } from "@/components/file-upload"
import { ReceiveSection } from "@/components/receive-section"
import { SiteFooter } from "@/components/site-footer"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </Router>
  );
}
