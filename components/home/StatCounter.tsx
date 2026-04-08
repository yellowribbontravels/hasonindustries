"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function StatCounter() {
  const container = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-24 md:py-32 bg-[#FAFAFA] border-y border-neutral-300 border-opacity-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center md:text-left">
        {[
          { num: "25+", label: "Years Excellence" },
          { num: "400+", label: "Projects Completed" },
          { num: "50+", label: "Global Clients" },
          { num: "0.1%", label: "Defect Tolerance" }
        ].map((stat, i) => (
          <div key={i} className="stat-item flex flex-col items-center md:items-start md:border-l border-neutral-200 md:pl-8">
            <h3 className="text-5xl md:text-6xl lg:text-8xl font-['Bebas_Neue'] text-[#09090B] tracking-widest mb-2">{stat.num}</h3>
            <p className="font-['DM_Mono'] text-[#10B981] text-[10px] md:text-xs uppercase tracking-widest leading-relaxed max-w-[120px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
