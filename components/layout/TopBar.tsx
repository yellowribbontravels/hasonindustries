import { Phone, CheckCircle2, ShieldCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function TopBar({ contactInfo }: { contactInfo: any }) {
  return (
    <div className="hidden lg:block w-full bg-[#FFFFFF] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left spacing for balance or secondary logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="shrink-0 group">
            <Image 
              src="/Hason-Industries-Logo.png" 
              alt="Hason Industries Logo" 
              width={260} 
              height={65} 
              className="w-auto h-12 md:h-14 object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>
        </div>

        {/* Right Info Section */}
        <div className="flex items-center space-x-12">
          
          {/* Phone Block */}
          <div className="flex items-center gap-4">
            <div className="text-[#10B981]">
              <Phone className="w-8 h-8" />
            </div>
            <div className="flex flex-col font-['DM_Mono'] text-sm text-[#09090B]">
              <span>{contactInfo?.phone1 || "+91-9533220698"}</span>
              <span>{contactInfo?.phone2 || "+91-9533693241"}</span>
            </div>
          </div>

          <div className="h-10 border-l border-neutral-300"></div>

          {/* Supplier Block */}
          <div className="flex items-center gap-4">
            <div className="text-[#10B981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="flex flex-col font-['DM_Mono'] text-sm text-[#09090B]">
              <span className="font-bold">Number #1</span>
              <span className="text-[#52525B]">Supplier in Quality</span>
            </div>
          </div>

          <div className="h-10 border-l border-neutral-300"></div>

          {/* ISO Block */}
          <div className="flex items-center gap-4">
            <div className="text-[#10B981]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="flex flex-col font-['DM_Mono'] text-sm text-[#09090B]">
              <span className="font-bold">Certified</span>
              <span className="text-[#52525B]">ISO 9001 : 2015</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
