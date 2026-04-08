import { Phone, CheckCircle2, ShieldCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function TopBar({ contactInfo }: { contactInfo: any }) {
  const phone1 = contactInfo?.phone1 || "+91-9533220698"
  const phone2 = contactInfo?.phone2 || "+91-9533693241"

  return (
    <>
      {/* Mobile: thin call strip */}
      <div className="lg:hidden w-full bg-[#09090B] border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-9">
          <span className="font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#A1A1AA]">
            ISO 9001:2015 Certified
          </span>
          <a
            href={`tel:${phone1}`}
            className="flex items-center gap-2 text-[#10B981] font-['DM_Mono'] text-[10px] uppercase tracking-widest font-bold"
          >
            <Phone className="w-3 h-3" />
            {phone1}
          </a>
        </div>
      </div>

      {/* Desktop: full top bar */}
      <div className="hidden lg:block w-full bg-[#FFFFFF] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <div className="flex-1 flex items-center">
            <Link href="/" className="shrink-0 group">
              <Image
                src="/Hason-Industries-Logo.png"
                alt="Hason Industries Logo"
                width={260}
                height={65}
                className="w-auto h-12 xl:h-14 object-contain group-hover:opacity-90 transition-opacity"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center space-x-8 xl:space-x-12">
            <div className="flex items-center gap-3 xl:gap-4">
              <div className="text-[#10B981]">
                <Phone className="w-7 h-7 xl:w-8 xl:h-8" />
              </div>
              <div className="flex flex-col font-['DM_Mono'] text-sm text-[#09090B]">
                <span>{phone1}</span>
                <span>{phone2}</span>
              </div>
            </div>

            <div className="h-10 border-l border-neutral-300" />

            <div className="flex items-center gap-3 xl:gap-4">
              <div className="text-[#10B981]">
                <CheckCircle2 className="w-7 h-7 xl:w-8 xl:h-8" />
              </div>
              <div className="flex flex-col font-['DM_Mono'] text-sm text-[#09090B]">
                <span className="font-bold">Number #1</span>
                <span className="text-[#52525B]">Supplier in Quality</span>
              </div>
            </div>

            <div className="h-10 border-l border-neutral-300" />

            <div className="flex items-center gap-3 xl:gap-4">
              <div className="text-[#10B981]">
                <ShieldCheck className="w-7 h-7 xl:w-8 xl:h-8" />
              </div>
              <div className="flex flex-col font-['DM_Mono'] text-sm text-[#09090B]">
                <span className="font-bold">Certified</span>
                <span className="text-[#52525B]">ISO 9001 : 2015</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
