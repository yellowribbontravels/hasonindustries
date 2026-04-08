import type { Metadata } from "next"
import { Lora, Bebas_Neue, DM_Mono } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { Navbar } from "@/components/layout/Navbar"
import { TopBar } from "@/components/layout/TopBar"
import { Footer } from "@/components/layout/Footer"
import { JsonLd } from "@/components/seo/JsonLd"
import { getSetting } from "@/lib/settings"
import "./globals.css"

const lora = Lora({ 
  subsets: ["latin"], 
  variable: "--font-lora" 
})
const bebas = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-bebas" 
})
const dmMono = DM_Mono({ 
  weight: ["400", "500"], 
  subsets: ["latin"], 
  variable: "--font-dm-mono" 
})

export const metadata: Metadata = {
  title: "Hason Industries",
  description: "Advanced precision manufacturing and industrial solutions engineered for global performance.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contactInfo = await getSetting("contact_info", { 
    phone1: "+91-9533220698", 
    phone2: "+91-9533693241", 
    email: "info@hasonindustries.com", 
    address: "Hason Industrial Estate\nPhase 2, Sector 4\nGlobal Tech Hub" 
  })

  return (
    <html lang="en" className={`${lora.variable} ${bebas.variable} ${dmMono.variable}`}>
      <body className="antialiased selection:bg-[#10B981] selection:text-[#FAFAFA]">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Hason Industries",
          "url": "https://hason.com",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-800-555-0199",
            "contactType": "industrial engineering support"
          }
        }} />
        <div className="fixed inset-0 z-[-2] bg-[#FAFAFA] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(250,250,250,1))]" />
        <div className="noise-overlay" />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#09090B',
              border: '1px solid #262626',
              borderRadius: '0',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#FFFFFF' }
            }
          }}
        />
        <div className="flex flex-col min-h-screen">
          <TopBar contactInfo={contactInfo} />
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer contactInfo={contactInfo} />
        </div>
      </body>
    </html>
  )
}
