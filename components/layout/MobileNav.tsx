"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ChevronDown, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Category = {
  id: string
  name: string
  slug: string
  materials: { name: string; slug: string }[]
}

type Props = {
  categories: Category[]
  contactPhone: string
}

export function MobileNav({ categories, contactPhone }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [materialsOpen, setMaterialsOpen] = useState(false)

  // Lock body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const close = () => {
    setIsOpen(false)
    setMaterialsOpen(false)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Products" },
    { href: "/certificates", label: "Certifications" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact Us" },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-11 h-11 text-[#FAFAFA] shrink-0"
      >
        <span className="block w-6 h-[2px] bg-current transition-all" />
        <span className="block w-4 h-[2px] bg-current transition-all" />
        <span className="block w-6 h-[2px] bg-current transition-all" />
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-[#09090B] flex flex-col overflow-y-auto"
          >
            {/* Header bar inside overlay */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
              <Link href="/" onClick={close}>
                <Image
                  src="/Hason-Industries-Logo.png"
                  alt="Hason Industries"
                  width={160}
                  height={40}
                  className="h-9 w-auto object-contain brightness-0 invert"
                  priority
                />
              </Link>
              <button
                onClick={close}
                aria-label="Close menu"
                className="w-11 h-11 flex items-center justify-center text-[#FAFAFA]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-5 py-8 flex flex-col">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
                }}
                className="flex flex-col gap-1"
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block font-['Bebas_Neue'] text-4xl tracking-widest text-[#FAFAFA] py-3 border-b border-white/10 hover:text-[#10B981] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Materials accordion */}
                <motion.div
                  variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                >
                  <button
                    onClick={() => setMaterialsOpen(!materialsOpen)}
                    className="w-full flex items-center justify-between font-['Bebas_Neue'] text-4xl tracking-widest text-[#FAFAFA] py-3 border-b border-white/10 hover:text-[#10B981] transition-colors"
                  >
                    Materials
                    <ChevronDown className={`w-6 h-6 transition-transform ${materialsOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {materialsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="py-4 pl-4 flex flex-col gap-4">
                          {categories.map((cat) => (
                            <div key={cat.id}>
                              <p className="font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#10B981] mb-2">
                                {cat.name}
                              </p>
                              <div className="flex flex-col gap-1">
                                {cat.materials.map((m) => (
                                  <Link
                                    key={m.slug}
                                    href={`/materials/${m.slug}`}
                                    onClick={close}
                                    className="font-['DM_Mono'] text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors py-1"
                                  >
                                    {m.name}
                                  </Link>
                                ))}
                                <Link
                                  href={`/materials/category/${cat.slug}`}
                                  onClick={close}
                                  className="font-['DM_Mono'] text-[10px] text-[#10B981] uppercase tracking-widest mt-1"
                                >
                                  View all →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </nav>

            {/* Bottom contact strip */}
            <div className="px-5 py-6 border-t border-white/10 shrink-0">
              <a
                href={`tel:${contactPhone}`}
                className="flex items-center gap-3 bg-[#10B981] text-[#FAFAFA] font-['DM_Mono'] text-sm uppercase tracking-widest px-6 py-4 justify-center"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
