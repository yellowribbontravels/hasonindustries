"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/categories", label: "Product Categories" },
  { href: "/admin/materials", label: "Materials" },
  { href: "/admin/materials/categories", label: "Material Categories" },
  { href: "/admin/team", label: "Team Directory" },
  { href: "/admin/certificates", label: "Compliance" },
  { href: "/admin/gallery", label: "Gallery Assets" },
  { href: "/admin/users", label: "User Accounts" },
  { href: "/admin/settings", label: "Global Settings" },
  { href: "/admin/contact", label: "Contact Submissions" }
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-neutral-200 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-2xl font-['Bebas_Neue'] text-[#09090B] tracking-widest">HASON<span className="text-[#10B981]">ADMIN</span></h2>
        <p className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-wider mt-1">Terminal Active</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        {navLinks.map((link) => {
          // Precise matching for parents vs children
          const isExact = pathname === link.href
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`px-4 py-3 font-['DM_Mono'] text-sm tracking-wide transition-colors ${
                isExact 
                  ? "bg-[#10B981] text-[#FAFAFA] font-bold" 
                  : "text-[#52525B] hover:bg-neutral-200 hover:text-[#09090B]"
              } ${link.href.includes("categories") ? 'ml-4 border-l-2 border-neutral-300' : ''}`}
            >
              {link.href.includes("categories") ? `↳ ${link.label}` : link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 text-[#52525B] font-['DM_Mono'] text-xs hover:text-[#09090B] border border-neutral-200 hover:border-neutral-600 transition-colors">
          View Live Site ➚
        </Link>
      </div>
    </aside>
  )
}
