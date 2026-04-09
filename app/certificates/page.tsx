import { prisma } from "@/lib/db"
import Image from "next/image"
import { ShieldCheck } from "lucide-react"
import { CertificateGrid } from "@/components/certificates/CertificateGrid"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Certifications & Compliance | Hason Industries",
}

export default async function CertificatesPage() {
  const certs = await prisma.certificate.findMany({
    orderBy: { order: "asc" }
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] pt-10 md:pt-16 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">

        <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
          <div className="flex justify-center mb-4 md:mb-6 text-[#10B981]">
            <ShieldCheck className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-4 md:mb-6 leading-tight">
            REGULATORY <span className="text-[#10B981] block sm:inline">COMPLIANCE</span>
          </h1>
          <p className="font-['Lora'] text-[#52525B] text-sm md:text-lg leading-relaxed px-2">
            Hason Industries operates strictly under globally recognized quality assurance frameworks. Our infrastructural, structural, and thermal integrations are certified to meet the highest threshold of industrial performance.
          </p>
        </div>

        <CertificateGrid certs={certs} />

      </div>
    </div>
  )
}
