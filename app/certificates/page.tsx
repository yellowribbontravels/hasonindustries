import { prisma } from "@/lib/db"
import Image from "next/image"
import { ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Certifications & Compliance | Hason Industries",
}

export default async function CertificatesPage() {
  const certs = await prisma.certificate.findMany({
    orderBy: { order: "asc" }
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] pt-24 md:pt-32 pb-16 md:pb-24">
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

        {certs.length === 0 ? (
          <div className="text-center py-16 md:py-20 bg-[#FFFFFF] border border-neutral-200">
            <p className="font-['DM_Mono'] text-[10px] md:text-xs uppercase tracking-widest text-[#52525B]">No compliance certificates publicly active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {certs.map(cert => (
              <div key={cert.id} className="bg-[#FFFFFF] border border-neutral-200 p-6 md:p-8 hover:border-[#10B981] transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>

                <h3 className="text-lg md:text-xl font-bold font-['DM_Mono'] text-[#09090B] uppercase tracking-wide mb-4 md:mb-6 group-hover:text-[#10B981] transition-colors">
                  {cert.title}
                </h3>

                <div className="relative aspect-[3/4] w-full border border-neutral-100 bg-neutral-50 p-2 shadow-sm">
                  <img
                    src={`https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev/${cert.imageKey}`}
                    alt={cert.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
