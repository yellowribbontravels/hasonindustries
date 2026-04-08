"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"

export function CTA() {
  const container = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-16 md:py-24 lg:py-32 bg-[#10B981] text-[#FAFAFA] px-4 sm:px-6">
      <div className="max-w-5xl mx-auto cta-content flex flex-col items-center text-center">
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[88px] font-['Bebas_Neue'] tracking-widest mb-5 md:mb-6 leading-[1] md:leading-[0.9]">
          Engineer Your Next Breakthrough
        </h2>
        <p className="font-['Lora'] text-sm sm:text-base md:text-lg mb-8 md:mb-10 max-w-2xl font-medium leading-relaxed opacity-90">
          Collaborate with our technical specialists to design, prototype, and manufacture components that withstand the most extreme operating conditions.
        </p>
        <Link
          href="/contact"
          className="w-full sm:w-auto inline-flex items-center justify-center bg-[#FAFAFA] text-[#10B981] font-['DM_Mono'] text-xs sm:text-sm tracking-widest uppercase px-10 py-4 sm:py-5 border-2 border-[#FAFAFA] hover:bg-transparent hover:text-[#FAFAFA] transition-colors font-bold"
        >
          Request a Consultation
        </Link>
      </div>
    </section>
  )
}
