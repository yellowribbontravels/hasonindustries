"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const stats = [
  { num: "25+", label: "Years of Excellence" },
  { num: "400+", label: "Projects Completed" },
  { num: "50+", label: "Global Clients" },
  { num: "0.1%", label: "Defect Tolerance" }
]

export function StatCounter() {
  const container = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-14 md:py-20 lg:py-28 bg-gradient-to-br from-[#FAFAFA] via-[#10B981]/5 to-[#10B981]/20 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item flex flex-col items-center justify-center text-center py-10 md:py-12 px-4 bg-gradient-to-b from-[#FFFFFF] to-[#FAFAFA] hover:to-[#10B981]/5 transition-colors">
              <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-['Bebas_Neue'] text-[#09090B] tracking-widest leading-none mb-3">
                {stat.num}
              </h3>
              <p className="font-['DM_Mono'] text-[#10B981] text-[9px] sm:text-[10px] uppercase tracking-widest leading-relaxed max-w-[100px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
