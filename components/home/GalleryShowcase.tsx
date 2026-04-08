import Image from "next/image"
import Link from "next/link"

export function GalleryShowcase({ keys }: { keys: string[] }) {
  if (!keys || keys.length === 0) return null

  // Ensure even layout blocks by trimming gracefully to 6 if massive arrays fed
  const displaySet = keys.slice(0, 6)

  return (
    <section className="py-24 bg-transparent border-t border-neutral-200/60 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-2">Visual <span className="text-[#10B981]">Excellence</span></h2>
            <p className="font-['DM_Mono'] text-sm tracking-widest text-[#52525B] uppercase">Manufactured Reality</p>
          </div>
          <Link href="/gallery" className="mt-6 md:mt-0 font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#10B981] hover:text-[#09090B] pb-1 border-b border-[#10B981] hover:border-[#09090B] transition-colors">
            View Full Archive
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {displaySet.map((key, i) => (
            <div key={key} className={`relative overflow-hidden group bg-neutral-100 ${i === 0 ? "col-span-2 md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}>
              <img 
                src={`https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev/${key}`} 
                alt="Engineering Visual"
                className="w-full h-full object-cover filter brightness-[0.85] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 border border-transparent group-hover:border-[#10B981]/50 pointer-events-none transition-colors duration-500 z-10 flex items-end p-6">
                 <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <span className="bg-[#10B981] text-[#FAFAFA] font-['DM_Mono'] text-[10px] uppercase tracking-widest px-3 py-1">Precision Class</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
