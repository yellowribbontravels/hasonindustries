import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CTA } from "@/components/home/CTA"
import { JsonLd } from "@/components/seo/JsonLd"
import type { Metadata } from "next"

export const dynamic = "force-static" // Ensuring true SSG
export const fetchCache = "force-cache"
export const revalidate = 3600 // Revalidate every hour

type Params = Promise<{ categoryId: string; productId: string }>

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true, categoryId: true, parentCat: { select: { slug: true } } }
  })

  return products.map((product) => ({
    categoryId: product.parentCat?.slug || "uncategorized",
    productId: product.slug,
  }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { productId } = await params
  const product = await prisma.product.findUnique({ where: { slug: productId }, include: { parentCat: true } })
  if (!product) return {}
  return {
    title: `${product.name} | Component Specs | Hason Industries`,
    description: product.description.substring(0, 160)
  }
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { productId } = await params
  const product = await prisma.product.findUnique({
    where: { slug: productId },
    include: { parentCat: true }
  })

  if (!product) {
    notFound()
  }

  const specs = product.specs as Record<string, string>

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "category": product.parentCat?.name || "Uncategorized",
    "image": product.imageKeys && product.imageKeys.length > 0 ? `https://hason.com/assets/${product.imageKeys[0]}` : undefined
  }

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={productJsonLd} />

      <div className="pb-16 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full pt-10">
        <Link href={`/products/${product.parentCat?.slug || "uncategorized"}`} className="text-[#52525B] font-['DM_Mono'] text-[10px] md:text-xs uppercase tracking-widest hover:text-[#10B981] transition-colors mb-6 md:mb-8 inline-block select-none">
          ← Return to {product.parentCat?.name || "Uncategorized"} Category
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mt-4 md:mt-8">
          {/* Visuals */}
          <div className="flex flex-col gap-4 md:gap-6 min-w-0">
            <div className="aspect-square bg-[#FFFFFF] border border-neutral-200 flex items-center justify-center p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/10 to-transparent pointer-events-none" />
              {product.imageKeys && product.imageKeys.length > 0 ? (
                <p className="font-['DM_Mono'] text-[10px] md:text-xs text-[#52525B] break-all text-center">{product.imageKeys[0]}</p>
              ) : (
                <p className="font-['DM_Mono'] text-[10px] md:text-xs text-[#52525B] uppercase border border-neutral-200 p-4">Asset Missing</p>
              )}
              <div className="absolute bottom-4 right-4 text-[#52525B] font-['DM_Mono'] text-[9px] md:text-[10px] uppercase font-bold tracking-widest border border-neutral-200 px-3 py-1 bg-[#FAFAFA]">Fig. 1</div>
            </div>

            {product.imageKeys && product.imageKeys.length > 1 && (
              <div className="flex overflow-x-auto gap-3 md:grid md:grid-cols-4 md:gap-4 pb-2 scrollbar-hide md:pb-0">
                {product.imageKeys.slice(1).map((key, i) => (
                  <div key={i} className="shrink-0 w-24 md:w-auto aspect-square bg-[#FFFFFF] border border-neutral-200 flex flex-col items-center justify-center overflow-hidden p-2 hover:border-[#10B981] transition-colors cursor-pointer relative">
                    <p className="font-['DM_Mono'] text-[8px] text-[#52525B] break-all truncate text-center w-full px-1">{key}</p>
                    <span className="absolute bottom-1 right-1 text-[8px] font-['DM_Mono'] tracking-widest text-[#10B981]">0{i + 2}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="flex flex-col min-w-0 break-words">
            <div className="border-b border-neutral-200 pb-8 md:pb-10 mb-8 md:mb-10">
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <p className="font-['DM_Mono'] text-[10px] md:text-xs text-[#FAFAFA] bg-[#10B981] px-2 md:px-3 py-1 font-bold uppercase tracking-widest inline-block">
                  {product.parentCat ? product.parentCat.name : "UNCATEGORIZED"}
                </p>
                <p className="font-['DM_Mono'] text-[9px] md:text-[10px] text-[#52525B] uppercase tracking-widest border border-neutral-200 px-2 md:px-3 py-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full inline-block animate-pulse" /> Active Standard
                </p>
              </div>
              <h1 className="font-['Bebas_Neue'] text-4xl sm:text-5xl md:text-7xl lg:text-[80px] tracking-widest text-[#09090B] mb-4 md:mb-6 leading-[0.9]">
                {product.name}
              </h1>
              <div
                className="font-['Lora'] text-[#52525B] text-sm md:text-base leading-relaxed break-words overflow-hidden [&>p]:break-words [&>p]:mb-4 [&>h1]:text-3xl [&>h1]:font-['Bebas_Neue'] [&>h1]:tracking-widest [&>h1]:text-[#09090B] [&>h1]:mb-4 [&>h1]:mt-8 [&>h2]:text-2xl [&>h2]:font-['Bebas_Neue'] [&>h2]:tracking-widest [&>h2]:text-[#09090B] [&>h2]:mb-3 [&>h2]:mt-6 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>a]:text-[#10B981] [&>a]:underline [&>img]:w-full [&>img]:h-auto [&>img]:border [&>img]:border-neutral-200 [&>img]:p-2 [&>img]:mb-4"
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />
            </div>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div className="flex flex-col gap-4 md:gap-6 mb-10 md:mb-12">
                <h3 className="font-['Bebas_Neue'] text-3xl md:text-4xl tracking-widest text-[#09090B]">Technical Specifications</h3>
                <div className="bg-[#FFFFFF] border border-neutral-200 flex flex-col pt-1">
                  {Object.entries(specs).map(([k, v], i) => (
                    <div key={k} className={`flex justify-between px-4 md:px-6 py-3 md:py-4 ${i !== Object.entries(specs).length - 1 ? 'border-b border-neutral-200' : ''}`}>
                      <span className="font-['DM_Mono'] text-[10px] md:text-xs text-[#52525B] uppercase tracking-widest w-1/3">{k}</span>
                      <span className="font-['DM_Mono'] text-[10px] md:text-[11px] text-[#09090B] text-right font-bold tracking-wide break-words w-2/3">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col sm:grid sm:grid-cols-2 gap-3 md:gap-4">
              <Link href="/contact" className="w-full bg-[#10B981] text-[#FAFAFA] font-['DM_Mono'] text-xs md:text-sm tracking-widest font-bold uppercase py-4 md:py-5 text-center transition-colors hover:bg-[#09090B]">
                Inquire Volume Order
              </Link>
              <Link href="/contact" className="w-full border border-neutral-300 text-[#09090B] font-['DM_Mono'] text-xs md:text-sm tracking-widest font-bold uppercase py-4 md:py-5 text-center transition-colors hover:border-[#10B981] hover:text-[#10B981]">
                Custom Fabrication
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CTA />
    </div>
  )
}
