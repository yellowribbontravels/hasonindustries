import { CTA } from "@/components/home/CTA"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Hason Industries",
  description: "Learn about the engineering legacy and infrastructure behind Hason's global manufacturing.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-8 pb-6 md:pb-8 border-b border-neutral-300 leading-none">
          THE <span className="text-[#10B981]">ENGINEERING</span> CORE
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 font-['Lora'] text-[#52525B] leading-relaxed text-sm sm:text-base md:text-lg">
          <div>
            <p className="mb-6 first-letter:text-5xl md:first-letter:text-6xl first-letter:font-['Bebas_Neue'] first-letter:text-[#10B981] first-letter:mr-2 md:first-letter:mr-3 first-letter:float-left">
              Founded in 1999, Hason Industries emerged from a single mission: to eliminate thermal and mechanical failure points in extreme-stress industrial environments. What began as a boutique engineering outfit has evolved into a global powerhouse in the production of glass epoxy sheets, insulation materials, and CNC-machined components.
            </p>
            <p>
              We don't just manufacture parts; we engineer reliability. Our advanced composites and polymers form the structural backbone of critical infrastructure across aerospace, heavy machinery, power generation, and specialized automation sectors.
            </p>
          </div>
          <div>
            <p className="mb-6">
              With a state-of-the-art 20,000 square-foot controlled-environment facility, our operations are driven by exact CAD telemetries and 5-axis CNC machining centers. This allows us to maintain the tightest tolerances in the industry, offering a 0.1% defect rate across millions of shipped units.
            </p>
            <p>
              Every material that leaves our floor is subjected to rigorous electrical and thermal load testing. You don't compromise on your operations, and we don't compromise on our materials.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-[#FFFFFF] border-y border-neutral-300 relative">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#10B981] via-[#FAFAFA] to-[#FAFAFA] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
          <div className="border hover:border-[#10B981] border-neutral-200 p-8 lg:p-10 transition-colors bg-[#FAFAFA] group">
            <span className="text-[#10B981] font-['DM_Mono'] text-xs tracking-widest uppercase mb-4 block group-hover:translate-x-2 transition-transform">01 //</span>
            <h3 className="font-['Bebas_Neue'] tracking-widest text-3xl md:text-4xl text-[#09090B] mb-3 md:mb-4">Precision First</h3>
            <p className="font-['Lora'] text-[#52525B] text-xs sm:text-sm leading-relaxed">Every cut, mold, and cure is calculated to exact specifications, ensuring zero variance in structural integrity.</p>
          </div>
          <div className="border hover:border-[#10B981] border-neutral-200 p-8 lg:p-10 transition-colors bg-[#FAFAFA] group">
            <span className="text-[#10B981] font-['DM_Mono'] text-xs tracking-widest uppercase mb-4 block group-hover:translate-x-2 transition-transform">02 //</span>
            <h3 className="font-['Bebas_Neue'] tracking-widest text-3xl md:text-4xl text-[#09090B] mb-3 md:mb-4">Material Superiority</h3>
            <p className="font-['Lora'] text-[#52525B] text-xs sm:text-sm leading-relaxed">Sourcing only the highest-grade raw resins and synthetics to withstand extreme temperatures and electrical loads.</p>
          </div>
          <div className="border hover:border-[#10B981] border-neutral-200 p-8 lg:p-10 transition-colors bg-[#FAFAFA] group sm:col-span-2 md:col-span-1">
            <span className="text-[#10B981] font-['DM_Mono'] text-xs tracking-widest uppercase mb-4 block group-hover:translate-x-2 transition-transform">03 //</span>
            <h3 className="font-['Bebas_Neue'] tracking-widest text-3xl md:text-4xl text-[#09090B] mb-3 md:mb-4">Global Reach</h3>
            <p className="font-['Lora'] text-[#52525B] text-xs sm:text-sm leading-relaxed">Efficient logistics networks allowing fast, secure deployment of industrial components worldwide.</p>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  )
}
