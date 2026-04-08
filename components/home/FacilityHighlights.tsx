"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function FacilityHighlights() {
  const container = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".facility-text", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        x: -50, opacity: 0, duration: 1, ease: "power3.out"
      })
      gsap.from(".facility-image", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        scale: 1.05, opacity: 0, duration: 1.5, ease: "power2.out"
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-32 bg-[#FFFFFF] border-y border-neutral-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#10B981] via-[#FAFAFA] to-[#FAFAFA] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="facility-text">
          <h2 className="text-5xl md:text-7xl font-['Bebas_Neue'] tracking-wider text-[#09090B] mb-6">
            INFRASTRUCTURE <br/><span className="text-[#10B981]">CAPABILITIES</span>
          </h2>
          <p className="font-['Lora'] text-[#52525B] text-base leading-relaxed mb-10 max-w-lg">
            Equipped with state-of-the-art multi-axis CNC machines and dedicated thermal treatment zones. Our facility operates continuously to guarantee precision tolerances on all engineered plastics and epoxy sheets.
          </p>
          <ul className="flex flex-col gap-6 font-['DM_Mono'] text-sm tracking-wider uppercase text-[#09090B]">
            <li className="flex items-center gap-4"><span className="w-2 h-2 bg-[#10B981] inline-block shadow-[0_0_10px_#10B981]" /> 20,000 Sq Ft Controlled Environment</li>
            <li className="flex items-center gap-4"><span className="w-2 h-2 bg-[#10B981] inline-block shadow-[0_0_10px_#10B981]" /> 5-Axis CNC Milling Terminals</li>
            <li className="flex items-center gap-4"><span className="w-2 h-2 bg-[#10B981] inline-block shadow-[0_0_10px_#10B981]" /> Automated Quality Control Scanning</li>
          </ul>
        </div>
        
        <div className="facility-image relative aspect-square lg:aspect-[4/3] bg-[#FAFAFA] border border-neutral-200 p-3">
          <div className="w-full h-full bg-[#FFFFFF] flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#10B981] opacity-0 group-hover:opacity-10 transition-opacity duration-700 mix-blend-overlay"></div>
            
            {/* Minimalist Tech Representation pending real image injection */}
            <div className="w-32 h-32 border border-neutral-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <div className="w-16 h-16 border border-[#10B981] rounded-full animate-spin-slow flex items-center justify-center">
                 <div className="w-2 h-2 bg-[#09090B] rounded-full"></div>
              </div>
            </div>
            
            <p className="mt-8 text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest border border-neutral-200 px-4 py-2 bg-[#FAFAFA]">Facility Visual Asset Core</p>
          </div>
        </div>
      </div>
    </section>
  )
}
