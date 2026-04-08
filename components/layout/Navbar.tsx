import Link from "next/link"
import { prisma } from "@/lib/db"

export async function Navbar() {
  // Fetch active operational material clusters dynamically
  const rawCategories = await prisma.materialCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      materials: {
        select: { name: true, slug: true },
        orderBy: { name: "asc" }
      }
    }
  })

  // Ensure robust fallback since the DB might be empty on initialization
  const categoriesToRender = rawCategories.length > 0 ? rawCategories : []

  return (
    <nav className="w-full bg-[#0F9D58] shadow-md z-40 relative">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        <div className="flex items-center gap-8 font-['DM_Mono'] text-[13px] tracking-widest uppercase font-bold text-[#FAFAFA]">
          <Link href="/" className="hover:text-white/80 transition-colors">HOME</Link>
          <Link href="/about" className="hover:text-white/80 transition-colors">ABOUT US</Link>
          
          <div className="relative group h-14 flex items-center z-50">
            <Link href="/materials" className="hover:text-white/80 transition-colors flex items-center gap-1 cursor-default">
              MATERIALS
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            
            {/* Mega Menu Dropdown */}
            {categoriesToRender.length > 0 && (
              <div className="absolute top-14 left-0 w-[800px] bg-[#FFFFFF] shadow-xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top pt-6 pb-8 px-8 grid grid-cols-1 md:grid-cols-3 gap-12 font-['DM_Mono'] text-xs normal-case tracking-normal z-50">
                
                {categoriesToRender.map(cat => (
                  <div key={cat.id}>
                    <h3 className="uppercase font-bold tracking-widest text-[#09090B] mb-4 border-b border-neutral-200 pb-2 flex justify-between items-end">
                      {cat.name}
                      <Link href={`/materials/category/${cat.slug}`} className="text-[9px] text-[#10B981] opacity-70 hover:opacity-100 font-normal">VIEW ALL</Link>
                    </h3>
                    <ul className="space-y-3 text-[#52525B]">
                      {cat.materials.map(m => (
                        <li key={m.slug}>
                          <Link href={`/materials/${m.slug}`} className="hover:text-[#0F9D58] transition-colors">{m.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              </div>
            )}
          </div>
          
          <Link href="/certificates" className="hover:text-white/80 transition-colors">CERTIFICATE OF REGISTRATION</Link>
          <Link href="/about" className="hover:text-white/80 transition-colors">FACILITIES</Link>
          <Link href="/contact" className="hover:text-white/80 transition-colors">CONTACT US</Link>
        </div>
        
        {/* Search Icon */}
        <button className="text-[#FAFAFA] hover:text-white/80 cursor-pointer p-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

      </div>
    </nav>
  )
}
