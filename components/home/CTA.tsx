"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"

export function CTA() {
  const container = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        y: 40, opacity: 0, duration: 1, ease: "power3.out"
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-32 bg-[#10B981] text-[#FAFAFA] text-center px-6 border-y border-[#10B981]">
      <div className="max-w-5xl mx-auto cta-content flex flex-col items-center">
        <h2 className="text-6xl md:text-[100px] font-['Bebas_Neue'] tracking-widest mb-6 leading-[0.85]">
          ENGINEER YOUR NEXT BREAKTHROUGH
        </h2>
        <p className="font-['Lora'] text-lg mb-10 max-w-2xl font-medium leading-relaxed">
          Collaborate with our technical specialists to design, prototype, and manufacture components that withstand the most extreme operating conditions.
        </p>
        <Link href="/contact" className="bg-[#FAFAFA] text-[#10B981] font-['DM_Mono'] text-sm tracking-widest uppercase px-12 py-5 border-2 border-[#FAFAFA] hover:bg-transparent hover:text-[#FAFAFA] transition-colors font-bold">
          Request Technical Consultation
        </Link>
      </div>
    </section>
  )
}
