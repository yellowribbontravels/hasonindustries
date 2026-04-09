"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const highlights = [
  "20,000 Sq Ft Controlled Environment",
  "5-Axis CNC Milling Terminals",
  "Automated Quality Control Scanning",
  "Thermal Treatment Zones",
]

export function FacilityHighlights() {
  const container = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from(".facility-text", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        x: -40, opacity: 0, duration: 1, ease: "power3.out"
      })
      gsap.from(".facility-image", {
        scrollTrigger: { trigger: container.current, start: "top 65%" },
        scale: 1.05, opacity: 0, duration: 1.5, ease: "power2.out"
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-[#FFFFFF] via-[#10B981]/5 to-[#10B981]/20 border-y border-neutral-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#10B981] via-[#10B981]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

        {/* Text */}
        <div className="facility-text">
          <p className="font-['DM_Mono'] text-[#10B981] text-[10px] uppercase tracking-widest mb-3">Our Facility</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Bebas_Neue'] tracking-wider text-[#09090B] mb-4 md:mb-6">
            Infrastructure<br /><span className="text-[#10B981]">Capabilities</span>
          </h2>
          <p className="font-['Lora'] text-[#52525B] text-sm md:text-base leading-relaxed mb-8 max-w-lg">
            Equipped with state-of-the-art multi-axis CNC machines and dedicated thermal treatment zones. Our facility operates continuously to guarantee precision tolerances on all engineered plastics and epoxy sheets.
          </p>
          <ul className="flex flex-col gap-4">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-center gap-4 font-['DM_Mono'] text-xs sm:text-sm tracking-wider uppercase text-[#09090B]">
                <span className="w-2 h-2 bg-[#10B981] inline-block shrink-0 shadow-[0_0_10px_#10B981]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Image placeholder */}
        <div className="facility-image relative aspect-[4/3] bg-[#FAFAFA] border border-neutral-200 p-3 w-full">
          <div className="w-full h-full bg-[#FFFFFF] flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#10B981] opacity-0 group-hover:opacity-10 transition-opacity duration-700 mix-blend-overlay" />
            <div className="w-24 h-24 sm:w-32 sm:h-32 border border-neutral-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border border-[#10B981] rounded-full animate-spin flex items-center justify-center"
                style={{ animationDuration: "8s" }}>
                <div className="w-2 h-2 bg-[#09090B] rounded-full" />
              </div>
            </div>
            <p className="mt-6 text-[#52525B] font-['DM_Mono'] text-[9px] uppercase tracking-widest border border-neutral-200 px-4 py-2 bg-[#FAFAFA]">
              Facility Image Coming Soon
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
