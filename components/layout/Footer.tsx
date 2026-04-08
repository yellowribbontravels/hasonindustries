"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Phone, Mail, MapPin, ArrowUp } from "lucide-react"

export function Footer({ contactInfo }: { contactInfo: any }) {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="bg-[#09090B] text-[#FAFAFA] mt-auto shrink-0 relative z-10">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Link href="/" className="inline-block mb-5">
            <Image
              src="/Hason-Industries-Logo.png"
              alt="Hason Industries Logo"
              width={200}
              height={50}
              className="w-auto h-10 object-contain brightness-0 invert"
            />
          </Link>
          <p className="font-['Lora'] text-[#A1A1AA] text-sm max-w-sm leading-relaxed mb-6">
            Precision-engineered thermal, structural, and mechanical solutions for elite industrial applications worldwide.
          </p>
          {/* Contact info on mobile */}
          <div className="flex flex-col gap-3">
            {contactInfo?.phone1 && (
              <a href={`tel:${contactInfo.phone1}`} className="flex items-center gap-3 font-['DM_Mono'] text-xs text-[#A1A1AA] hover:text-[#10B981] transition-colors">
                <Phone className="w-4 h-4 text-[#10B981] shrink-0" />
                {contactInfo.phone1}
              </a>
            )}
            {contactInfo?.phone2 && (
              <a href={`tel:${contactInfo.phone2}`} className="flex items-center gap-3 font-['DM_Mono'] text-xs text-[#A1A1AA] hover:text-[#10B981] transition-colors">
                <Phone className="w-4 h-4 text-[#10B981] shrink-0" />
                {contactInfo.phone2}
              </a>
            )}
            {contactInfo?.email && (
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 font-['DM_Mono'] text-xs text-[#A1A1AA] hover:text-[#10B981] transition-colors">
                <Mail className="w-4 h-4 text-[#10B981] shrink-0" />
                {contactInfo.email}
              </a>
            )}
            {contactInfo?.address && (
              <p className="flex items-start gap-3 font-['DM_Mono'] text-xs text-[#A1A1AA]">
                <MapPin className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span className="whitespace-pre-wrap">{contactInfo.address}</span>
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-['DM_Mono'] text-[#FAFAFA] uppercase tracking-widest text-[10px] mb-5 pb-2 border-b border-white/10">
            Navigation
          </h3>
          <div className="flex flex-col gap-3 font-['DM_Mono'] text-xs text-[#A1A1AA] tracking-wide uppercase">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Us" },
              { href: "/materials", label: "Materials" },
              { href: "/products", label: "Products" },
              { href: "/certificates", label: "Certifications" },
              { href: "/gallery", label: "Gallery" },
              { href: "/contact", label: "Contact Us" },
            ].map(link => (
              <Link key={link.href} href={link.href} className="hover:text-[#10B981] transition-colors w-fit">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal / Admin */}
        <div>
          <h3 className="font-['DM_Mono'] text-[#FAFAFA] uppercase tracking-widest text-[10px] mb-5 pb-2 border-b border-white/10">
            Legal
          </h3>
          <div className="flex flex-col gap-3 font-['DM_Mono'] text-xs text-[#A1A1AA] tracking-wide uppercase">
            <span className="text-[#3F3F46]">Privacy Policy</span>
            <span className="text-[#3F3F46]">Terms of Service</span>
            <Link href="/admin/login" className="text-[#3F3F46] hover:text-[#10B981] transition-colors mt-4 w-fit">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <p className="font-['DM_Mono'] text-[#3F3F46] text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} Hason Industries. All rights reserved.
          </p>
          <button
            onClick={scrollTop}
            aria-label="Back to top"
            className="w-9 h-9 flex items-center justify-center border border-white/10 hover:border-[#10B981] hover:text-[#10B981] text-[#A1A1AA] transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

    </footer>
  )
}
