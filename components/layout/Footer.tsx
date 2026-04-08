"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function Footer({ contactInfo }: { contactInfo: any }) {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  return (
    <footer className="bg-[#FAFAFA] border-t border-neutral-300 py-16 mt-auto shrink-0 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-block mb-6">
            <Image 
              src="/Hason-Industries-Logo.png" 
              alt="Hason Industries Logo" 
              width={200} 
              height={50} 
              className="w-auto h-12 object-contain"
            />
          </Link>
          <p className="font-['Lora'] text-[#52525B] text-sm max-w-sm leading-relaxed">
            Precision-engineered thermal, structural, and mechanical solutions for elite industrial applications worldwide.
          </p>
        </div>
        
        <div>
          <h3 className="font-['DM_Mono'] text-[#09090B] uppercase tracking-widest text-[10px] mb-4">Navigation</h3>
          <div className="flex flex-col gap-3 font-['DM_Mono'] uppercase lg:text-[10px] text-xs text-[#52525B] tracking-widest">
            <Link href="/" className="hover:text-[#10B981] transition-colors w-fit">Home</Link>
            <Link href="/about" className="hover:text-[#10B981] transition-colors w-fit">About Us</Link>
            <Link href="/materials" className="hover:text-[#10B981] transition-colors w-fit">Materials</Link>
            <Link href="/products" className="hover:text-[#10B981] transition-colors w-fit">Products</Link>
            <Link href="/gallery" className="hover:text-[#10B981] transition-colors w-fit">Gallery</Link>
            <Link href="/contact" className="hover:text-[#10B981] transition-colors w-fit">Contact Us</Link>
            
            <Link href="/admin/login" className="hover:text-[#10B981] mt-6 opacity-30 w-fit">[Admin Portal]</Link>
          </div>
        </div>
        
        <div>
          <h3 className="font-['DM_Mono'] text-[#09090B] uppercase tracking-widest text-[10px] mb-4">Headquarters</h3>
          <address className="font-['DM_Mono'] text-[#52525B] text-[10px] uppercase tracking-widest not-italic leading-loose whitespace-pre-wrap">
            {contactInfo.address}
            <br /><br />
            {contactInfo.phone1 && <><a href={`tel:${contactInfo.phone1}`} className="hover:text-[#10B981] transition-colors">{contactInfo.phone1}</a><br/></>}
            {contactInfo.phone2 && <><a href={`tel:${contactInfo.phone2}`} className="hover:text-[#10B981] transition-colors">{contactInfo.phone2}</a><br/></>}
            <a href={`mailto:${contactInfo.email}`} className="hover:text-[#10B981] decoration-[#10B981] transition-colors underline underline-offset-4 mt-2 inline-block">{contactInfo.email}</a>
          </address>
        </div>

      </div>
    </footer>
  )
}
