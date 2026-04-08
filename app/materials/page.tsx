import { prisma } from "@/lib/db"
import Link from "next/link"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Industrial Materials | Hason Industries",
  description: "Advanced electrical insulation materials and engineering plastics.",
}

export default async function Materials() {
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: "desc" }
  })

  // Group by category
  const grouped: Record<string, typeof materials> = {}
  materials.forEach(m => {
    if (!grouped[m.category]) grouped[m.category] = []
    grouped[m.category].push(m)
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <h1 className="text-6xl md:text-8xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-6">
          MATERIALS<span className="text-[#10B981]">.</span>
        </h1>
        <p className="font-['Lora'] text-[#52525B] max-w-2xl text-lg mb-16 leading-relaxed">
          At Hason Industries, we specialize in a complete range of industrial grade plastics and insulating materials, combining excellent dielectric strength, high mechanical stability, and superior flame resistance.
        </p>

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-[#52525B] border border-neutral-200 rounded-lg">
            No materials cataloged yet.
          </div>
        ) : (
          <div className="space-y-24">
            {Object.entries(grouped).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-3xl font-['Bebas_Neue'] text-[#10B981] mb-8 border-b border-neutral-200 pb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map(m => (
                    <Link href={`/materials/${m.slug}`} key={m.id} className="group flex flex-col h-full bg-[#FFFFFF] border border-neutral-200 p-6 hover:border-[#10B981] transition-color transition-colors relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#FAFAFA] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                      <h3 className="text-xl font-bold font-['DM_Mono'] text-[#09090B] uppercase tracking-wide mb-2 group-hover:text-[#10B981] transition-colors">{m.name}</h3>
                      <p className="text-xs text-[#52525B] line-clamp-3 mb-6 relative z-10">{m.description || "Specifications available for industrial deployment."}</p>
                      
                      <div className="mt-auto flex items-center justify-between z-10">
                        <span className="text-[10px] uppercase font-['DM_Mono'] tracking-widest text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity">View Spec</span>
                        <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-[#10B981] group-hover:bg-[#10B981]">
                          <span className="w-1.5 h-1.5 bg-[#52525B] rounded-full group-hover:bg-[#FAFAFA]"></span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
