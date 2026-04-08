import { ContactForm } from "@/components/contact/ContactForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Portal | Hason Industries",
  description: "Initiate contact for bulk orders, specialized structural fabrications, and global supply chain requests."
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24 lg:pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-6 md:mb-8 pb-6 md:pb-8 border-b border-neutral-300 leading-none lg:leading-[0.85]">
          SECURE <span className="text-[#10B981] block sm:inline">CONNECTION</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mt-8 md:mt-12">
          <div className="flex flex-col gap-8 md:gap-12">
            <p className="font-['Lora'] text-[#52525B] text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
              Our global sales and engineering teams monitor incoming telemetries continuously. Transmit your requirements for custom CNC fabrication, bulk component orders, or specialized material sourcing below.
            </p>

            <div className="flex flex-col gap-6 md:gap-8 font-['DM_Mono'] text-xs sm:text-sm tracking-widest uppercase">
              <div className="border-l-2 border-[#10B981] pl-4">
                <p className="text-[#10B981] text-[10px] mb-2 font-bold">Global Headquarters</p>
                <p className="text-[#09090B]">Hason Industrial Estate</p>
                <p className="text-[#09090B]">Phase 2, Sector 4</p>
              </div>

              <div className="border-l-2 border-neutral-200 pl-4 hover:border-[#10B981] transition-colors">
                <p className="text-[#52525B] text-[10px] mb-2">Direct Lines</p>
                <a href="tel:+18005550199" className="text-[#10B981] hover:text-[#09090B] transition-colors block">+1 (800) 555-0199</a>
                <a href="mailto:info@hason.com" className="text-[#10B981] hover:text-[#09090B] transition-colors block mt-1">info@hason.com</a>
              </div>

              <div className="border-l-2 border-neutral-200 pl-4 hover:border-[#10B981] transition-colors">
                <p className="text-[#52525B] text-[10px] mb-2">Operating Parameters</p>
                <p className="text-[#09090B]">Mon-Fri // 08:00 - 18:00 EST</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
