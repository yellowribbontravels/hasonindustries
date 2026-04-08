"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const R2_BASE = "https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev"

function resolveSlide(src: string) {
  if (!src || src.startsWith("/") || src.startsWith("http")) return src
  return `${R2_BASE}/${src}`
}

export function Hero({ slides }: { slides: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const currentSlide = resolveSlide(slides?.[currentIndex] || "/placeholder-hero.jpg")

  return (
    <section className="relative w-full h-[65vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-[#09090B]">

      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide})` }}
          />
          <div className="absolute inset-0 bg-[#09090B]/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 flex flex-col items-center text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['Bebas_Neue'] tracking-widest text-[#FAFAFA] mb-4 sm:mb-6 leading-[1.1]"
        >
          Where Engineering Plastics<br className="hidden sm:block" /> Replace Heavy Metal Problems.
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-['Lora'] text-[#FAFAFA]/90 text-sm sm:text-base md:text-lg max-w-2xl mb-8 sm:mb-10 leading-relaxed"
        >
          Reduce corrosion, noise, and maintenance — upgrade to smarter materials.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Link
            href="/materials"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#10B981] text-[#FAFAFA] px-8 py-4 font-['DM_Mono'] uppercase tracking-widest text-xs sm:text-sm hover:bg-[#0B8A4C] transition-colors"
          >
            View Materials
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-[#FAFAFA] text-[#FAFAFA] px-8 py-4 font-['DM_Mono'] uppercase tracking-widest text-xs sm:text-sm hover:bg-[#FAFAFA]/10 transition-colors"
          >
            Get a Quote
          </Link>
        </motion.div>
      </div>

      {/* Carousel Controls — desktop only */}
      {slides && slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 items-center justify-center border border-[#FAFAFA]/40 rounded-full hover:bg-[#FAFAFA]/10 transition-colors text-[#FAFAFA]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 items-center justify-center border border-[#FAFAFA]/40 rounded-full hover:bg-[#FAFAFA]/10 transition-colors text-[#FAFAFA]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide dots — always visible when multiple slides */}
      {slides && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-6 bg-[#10B981]" : "w-1.5 bg-[#FAFAFA]/50"}`}
            />
          ))}
        </div>
      )}

    </section>
  )
}
