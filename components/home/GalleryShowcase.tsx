import Image from "next/image"
import Link from "next/link"

const R2_BASE = "https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev"

export function GalleryShowcase({ keys }: { keys: string[] }) {
  if (!keys || keys.length === 0) return null

  const displaySet = keys.slice(0, 6)

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] border-t border-neutral-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <p className="font-['DM_Mono'] text-[#10B981] text-[10px] uppercase tracking-widest mb-2">Portfolio</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Bebas_Neue'] tracking-widest text-[#09090B]">
              Visual <span className="text-[#10B981]">Excellence</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="self-start sm:self-auto font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#10B981] hover:text-[#09090B] pb-1 border-b border-[#10B981] hover:border-[#09090B] transition-colors whitespace-nowrap"
          >
            View Full Gallery →
          </Link>
        </div>

        {/* Grid — 2 cols on mobile, 3 on md */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {displaySet.map((key, i) => {
            const src = key.startsWith("http") || key.startsWith("/") ? key : `${R2_BASE}/${key}`
            const isFirst = i === 0
            return (
              <div
                key={key}
                className={`relative overflow-hidden group bg-neutral-200 ${isFirst ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
              >
                <img
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                  loading={isFirst ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#10B981]/40 pointer-events-none transition-colors duration-500 z-10 flex items-end p-3 sm:p-5">
                  <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <span className="bg-[#10B981] text-[#FAFAFA] font-['DM_Mono'] text-[9px] uppercase tracking-widest px-2 py-1">
                      Precision Class
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
