"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Hero({ slides }: { slides: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance
  useEffect(() => {
    if (!slides || slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides])

  const handleNext = () => {
    if (!slides || slides.length <= 1) return
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const handlePrev = () => {
    if (!slides || slides.length <= 1) return
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const currentSlide = slides?.[currentIndex] || "/placeholder-hero.jpg"

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-[#FAFAFA]">
      
      {/* Background Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${currentSlide})` }} 
          />
          <div className="absolute inset-0 bg-[#09090B]/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay without harsh shadow as requested, utilizing crisp high-contrast layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-5xl lg:text-5xl font-['Bebas_Neue'] tracking-widest text-[#FAFAFA] mb-6">
          Where Engineering Plastics Replace Heavy Metal Problems.
        </h1>
        
        <p className="font-['Lora'] text-[#FAFAFA] text-lg md:text-xl max-w-3xl mb-10 leading-relaxed font-semibold">
          Reduce corrosion, noise, and maintenance — upgrade to smarter materials.
        </p>
        
        <Link 
          href="/materials" 
          className="inline-block bg-transparent border-2 border-[#FAFAFA] text-[#FAFAFA] px-10 py-4 font-['DM_Mono'] uppercase tracking-widest text-sm hover:bg-[#10B981] hover:border-[#10B981] transition-colors"
        >
          VIEW PRODUCTS & MATERIALS
        </Link>
      </div>

      {/* Carousel Controls */}
      {slides && slides.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border border-[#FAFAFA]/50 rounded-full hover:bg-[#FAFAFA]/10 transition-colors text-[#FAFAFA]"
          >
            <ChevronLeft />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border border-[#FAFAFA]/50 rounded-full hover:bg-[#FAFAFA]/10 transition-colors text-[#FAFAFA]"
          >
            <ChevronRight />
          </button>
        </>
      )}
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#FAFAFA] opacity-70">Scroll Down</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#FAFAFA]/50 to-transparent"></div>
      </div>

    </section>
  )
}
