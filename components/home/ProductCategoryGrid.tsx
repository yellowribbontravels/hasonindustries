import { prisma } from "@/lib/db"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export async function ProductCategoryGrid() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { order: "asc" }
  })

  // Fallback descriptions for category types
  const descriptions: Record<string, string> = {
    default: "Engineered solutions built to exact specifications for heavy industrial applications."
  }

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="mb-10 md:mb-16">
          <p className="font-['DM_Mono'] text-[#10B981] text-[10px] uppercase tracking-widest mb-3">Our Range</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Bebas_Neue'] tracking-wider text-[#09090B]">
            Product <span className="text-[#10B981]">Categories</span>
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="py-16 text-center font-['DM_Mono'] text-[#52525B] text-xs uppercase tracking-widest">
            Categories coming soon
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group block bg-[#FFFFFF] border border-neutral-200 p-6 md:p-8 lg:p-10 hover:border-[#10B981] transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover fill */}
                <div className="absolute inset-0 bg-[#10B981] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out opacity-[0.04]" />

                <span className="font-['DM_Mono'] text-[9px] text-[#10B981] uppercase tracking-widest mb-4 block">
                  {String(index + 1).padStart(2, "0")} //
                </span>
                <h3 className="text-2xl sm:text-3xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-3 group-hover:text-[#10B981] transition-colors">
                  {cat.name}
                </h3>
                <p className="font-['Lora'] text-[#52525B] text-sm leading-relaxed mb-6 max-w-xs">
                  {descriptions[cat.slug] || descriptions.default}
                </p>

                <div className="flex items-center gap-2 text-[#10B981] font-['DM_Mono'] text-[10px] uppercase tracking-widest">
                  Explore Range
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View all products link */}
        <div className="mt-8 md:mt-12 text-center sm:text-right">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-['DM_Mono'] text-xs uppercase tracking-widest text-[#52525B] hover:text-[#10B981] transition-colors border-b border-neutral-300 hover:border-[#10B981] pb-1"
          >
            View All Products
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
