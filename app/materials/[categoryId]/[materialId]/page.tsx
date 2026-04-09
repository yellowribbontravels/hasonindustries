import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { JsonLd } from "@/components/seo/JsonLd"
import type { Metadata } from "next"

export const dynamic = "force-static" // SSG route
export const fetchCache = "force-cache"
export const revalidate = 3600 // Regenerate every 1 hour

type Params = Promise<{ categoryId: string; materialId: string }>

export async function generateStaticParams() {
  const materials = await prisma.material.findMany({
    select: { slug: true, categoryId: true, parentCat: { select: { slug: true } } }
  })

  return materials.map((mat) => ({
    categoryId: mat.parentCat?.slug || "uncategorized",
    materialId: mat.slug,
  }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { materialId } = await params
  const material = await prisma.material.findUnique({ where: { slug: materialId } })
  if (!material) return {}
  return {
    title: `${material.name} | Material Specs | Hason Industries`,
    description: (material.description || "").substring(0, 160)
  }
}

export default async function MaterialDetail({ params }: { params: Params }) {
  const { materialId } = await params

  const material = await prisma.material.findUnique({
    where: { slug: materialId },
    include: { parentCat: true }
  })

  if (!material) notFound()

  const specs = material.specs as Record<string, string>

  const matJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": material.name,
    "description": material.description,
    "category": material.category,
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] pb-16 md:pb-24 text-[#09090B]">
      <JsonLd data={matJsonLd} />

      {/* Top Banner mapping screenshot */}
      <div className="bg-[#10B981] w-full py-6 md:py-8 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between md:items-center text-[#FAFAFA] gap-4">
          <h1 className="text-4xl sm:text-5xl font-['Bebas_Neue'] tracking-widest leading-none">{material.name}</h1>
          <div className="flex font-['DM_Mono'] text-[10px] md:text-xs tracking-widest uppercase gap-2 md:gap-4 opacity-80 flex-wrap">
            <Link href="/" className="hover:text-white">HOME</Link> /
            <Link href="/materials" className="hover:text-white">MATERIALS</Link> /
            <Link href={`/materials/${material.parentCat?.slug || "uncategorized"}`} className="hover:text-white uppercase">
              {material.parentCat?.name || "Uncategorized"}
            </Link> /
            <span className="font-bold text-white max-w-[150px] md:max-w-none truncate" title={material.name}>{material.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

        {/* Left Side: Specs matching screenshot */}
        <div className="min-w-0 break-words">
          <div
            className="font-['Lora'] text-[#52525B] text-base md:text-lg leading-relaxed mb-10 md:mb-12 break-words overflow-hidden [&>p]:break-words [&>p]:mb-4 [&>h1]:text-3xl [&>h1]:font-['Bebas_Neue'] [&>h1]:tracking-widest [&>h1]:text-[#09090B] [&>h1]:mb-4 [&>h1]:mt-8 [&>h2]:text-2xl [&>h2]:font-['Bebas_Neue'] [&>h2]:tracking-widest [&>h2]:text-[#09090B] [&>h2]:mb-3 [&>h2]:mt-6 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>a]:text-[#10B981] [&>a]:underline [&>img]:w-full [&>img]:h-auto [&>img]:border [&>img]:border-neutral-200 [&>img]:p-2 [&>img]:mb-4"
            dangerouslySetInnerHTML={{ __html: material.description || "" }}
          />

          {specs && Object.keys(specs).length > 0 && (
            <div className="space-y-6 md:space-y-8 font-['Lora'] text-[#09090B]">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="flex gap-4">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-2.5 shrink-0" />
                  <p className="leading-relaxed text-sm md:text-base">
                    <strong className="font-semibold text-[#09090B] mr-2 block sm:inline">{key}:</strong>
                    <span className="text-[#52525B] block sm:inline">{val}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 md:mt-16">
            <Link href="/contact" className="w-full sm:w-auto inline-block text-center bg-[#09090B] text-[#FAFAFA] px-10 py-4 md:py-5 font-['DM_Mono'] tracking-widest text-xs md:text-sm uppercase hover:bg-[#10B981] transition-colors rounded-full shadow-lg hover:shadow-xl">
              Request Custom Quote
            </Link>
          </div>
        </div>

        {/* Right Side: Images */}
        <div className="space-y-4 md:space-y-6 min-w-0">
          {material.imageKeys && material.imageKeys.length > 0 ? (
            material.imageKeys.map((key) => (
              <div key={key} className="border border-neutral-200 bg-[#FFFFFF] p-3 md:p-4 shadow-sm w-full">
                <img src={`https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev/${key}`} alt={material.name} className="w-full h-auto object-cover" />
              </div>
            ))
          ) : (
            <div className="h-64 md:h-96 bg-[#FFFFFF] border border-neutral-200 flex items-center justify-center shadow-sm">
              <p className="text-[#52525B] font-['DM_Mono'] uppercase tracking-widest text-[10px] md:text-xs">No technical visual generated</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
