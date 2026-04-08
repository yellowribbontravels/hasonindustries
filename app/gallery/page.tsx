import { prisma } from "@/lib/db"
import { GalleryMasonry } from "@/components/gallery/GalleryMasonry"
import { CTA } from "@/components/home/CTA"
import type { Metadata } from "next"

export const revalidate = 3600 // ISR: regenerate every 1 hour

export const metadata: Metadata = {
  title: "Visual Gallery | Hason Industries",
  description: "Explore our archive of industrial components, facility architecture, and material processing."
}

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 md:pt-40 pb-16 md:pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10 text-center">
        <h1 className="text-6xl sm:text-7xl md:text-[100px] font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-4 md:mb-6 leading-none">
          VISUAL <span className="text-[#10B981] block sm:inline">ASSETS</span>
        </h1>
        <p className="font-['Lora'] text-[#52525B] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          A documented history of engineered solutions, facility snapshots, and precision CNC components crafted for critical operating environments.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 md:pb-32 w-full">
        <GalleryMasonry images={images} />
      </div>

      <CTA />
    </div>
  )
}
