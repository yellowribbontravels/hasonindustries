import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { JsonLd } from "@/components/seo/JsonLd"

export const dynamic = "force-dynamic"

export default async function MaterialDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const material = await prisma.material.findUnique({
    where: { slug }
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
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 text-[#09090B]">
      <JsonLd data={matJsonLd} />
      
      {/* Top Banner mapping screenshot */}
      <div className="bg-[#10B981] w-full py-8 mb-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[#FAFAFA]">
          <h1 className="text-3xl md:text-5xl font-['Bebas_Neue'] tracking-widest">{material.name}</h1>
          <div className="hidden md:flex font-['DM_Mono'] text-xs tracking-widest uppercase gap-4 opacity-80">
            <Link href="/" className="hover:text-white">HOME</Link> / 
            <Link href="/materials" className="hover:text-white">MATERIALS</Link> / 
            <span className="font-bold text-white">{material.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Specs matching screenshot */}
        <div>
          <h2 className="text-2xl font-bold font-['DM_Mono'] uppercase tracking-widest mb-6">
            {material.name} - Advanced Engineering Material
          </h2>
          
          <p className="font-['Lora'] text-[#52525B] text-lg leading-relaxed mb-12">
            {material.description}
          </p>
          
          {specs && Object.keys(specs).length > 0 && (
            <div className="space-y-8 font-['Lora'] text-[#09090B]">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="flex gap-4">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-2.5 shrink-0"></span>
                  <p className="leading-relaxed">
                    <strong className="font-semibold text-[#09090B] mr-2">{key}:</strong> 
                    <span className="text-[#52525B]">{val}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-16">
             <Link href="/contact" className="inline-block bg-[#09090B] text-[#FAFAFA] px-10 py-4 font-['DM_Mono'] tracking-widest text-sm uppercase hover:bg-[#10B981] transition-colors rounded-full shadow-lg hover:shadow-xl">
               Request Custom Quote
             </Link>
          </div>
        </div>

        {/* Right Side: Images */}
        <div className="space-y-6">
          {material.imageKeys && material.imageKeys.length > 0 ? (
            material.imageKeys.map((key) => (
              <div key={key} className="border border-neutral-200 bg-[#FFFFFF] p-4 shadow-sm w-full">
                <img src={`https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev/${key}`} alt={material.name} className="w-full h-auto object-cover" />
              </div>
            ))
          ) : (
            <div className="h-96 bg-[#FFFFFF] border border-neutral-200 flex items-center justify-center shadow-sm">
               <p className="text-[#52525B] font-['DM_Mono'] uppercase tracking-widest text-xs">No technical visual generated</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}
