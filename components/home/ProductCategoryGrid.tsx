"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"

const categories = [
  { id: "glass-epoxy", title: "Glass Epoxy", desc: "High mechanical strength and superior dielectric properties under extreme thermal stress." },
  { id: "insulation", title: "Insulation Materials", desc: "Thermal and electrical barriers engineered for heavy industrial machinery." },
  { id: "engineering-plastics", title: "Engineering Plastics", desc: "Custom-formulated polymers designed for high-wear and structural applications." },
  { id: "cnc-components", title: "CNC Components", desc: "Micro-precision machined parts tailored exactly to CAD telemetry." }
]

export function ProductCategoryGrid() {
  const container = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".cat-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-32 relative bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-['Bebas_Neue'] tracking-wider text-[#09090B] mb-16 text-center md:text-left">
          MATRIX <span className="text-[#10B981]">CATEGORIES</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.id}`} className="cat-card group block bg-[#FFFFFF] border border-neutral-200 p-8 md:p-12 hover:border-[#10B981] transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-[#10B981] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out opacity-[0.03]" />
              
              <h3 className="text-3xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-4 group-hover:text-[#10B981] transition-colors">{cat.title}</h3>
              <p className="font-['Lora'] text-[#52525B] text-sm leading-relaxed mb-8 max-w-sm">
                {cat.desc}
              </p>
              
              <div className="flex items-center text-[#10B981] font-['DM_Mono'] text-xs uppercase tracking-widest mt-auto">
                Explore Matrix <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
