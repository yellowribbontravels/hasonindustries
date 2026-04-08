import { GalleryUploader } from "@/components/admin/GalleryUploader"
import { GalleryGrid } from "@/components/admin/GalleryGrid"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function GalleryAdminPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" }
  })

  return (
    <div>
      <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider mb-8 border-b border-neutral-200 pb-4">
        Global Gallery Repository
      </h1>
      
      <GalleryUploader />
      <GalleryGrid images={images} />
    </div>
  )
}
