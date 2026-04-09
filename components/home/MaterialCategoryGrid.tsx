import { prisma } from "@/lib/db"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export async function MaterialCategoryGrid() {
    const categories = await prisma.materialCategory.findMany({
        orderBy: { order: "asc" }
    })

    // Fallback descriptions for category types
    const descriptions: Record<string, string> = {
        default: "Advanced electrical insulation materials and engineering plastics possessing outstanding thermal stability."
    }

    return (
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-tr from-[#FFFFFF] via-[#10B981]/5 to-[#10B981]/15 border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="font-['DM_Mono'] text-[#10B981] text-[10px] uppercase tracking-widest mb-3">Core Inventory</p>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Bebas_Neue'] tracking-wider text-[#09090B]">
                            Material <span className="text-[#10B981]">Showcase</span>
                        </h2>
                    </div>
                    <p className="font-['Lora'] text-[#52525B] text-sm md:text-base leading-relaxed max-w-sm">
                        High-performance substrates designed for structural integrity in extreme environments.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="py-16 text-center border border-neutral-200 bg-[#FAFAFA] font-['DM_Mono'] text-[#52525B] text-xs uppercase tracking-widest">
                        Missing Material Database Records
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {categories.map((cat, index) => (
                            <Link
                                key={cat.id}
                                href={`/materials/${cat.slug}`}
                                className="group block bg-[#FAFAFA] border border-neutral-200 p-6 md:p-8 hover:border-[#10B981] hover:bg-[#FFFFFF] transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Number identifier */}
                                <div className="absolute top-0 right-0 p-4 opacity-50 font-['Bebas_Neue'] text-5xl text-neutral-200 group-hover:text-[#10B981]/20 transition-colors pointer-events-none">
                                    M-{String(index + 1).padStart(2, "0")}
                                </div>

                                <div className="relative z-10">
                                    <div className="w-10 h-10 border border-[#10B981]/30 flex items-center justify-center shrink-0 mb-6 bg-[#FFFFFF] group-hover:scale-110 transition-transform">
                                        <div className="w-4 h-4 bg-[#10B981]" />
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-3 group-hover:text-[#10B981] transition-colors pr-10">
                                        {cat.name}
                                    </h3>
                                    <p className="font-['Lora'] text-[#52525B] text-xs leading-relaxed mb-6">
                                        {descriptions[cat.slug] || descriptions.default}
                                    </p>

                                    <div className="flex items-center gap-2 text-[#09090B] font-['DM_Mono'] text-[10px] uppercase tracking-widest group-hover:text-[#10B981] transition-colors">
                                        Access Specs
                                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-8 md:mt-12 text-center">
                    <Link
                        href="/materials"
                        className="inline-flex items-center gap-2 font-['DM_Mono'] text-xs uppercase tracking-widest text-[#52525B] hover:text-[#10B981] transition-colors pb-1 border-b border-transparent hover:border-[#10B981]"
                    >
                        Access Full Material Database
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
