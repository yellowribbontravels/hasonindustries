import { Hero } from "@/components/home/Hero"
import { StatCounter } from "@/components/home/StatCounter"
import { ProductCategoryGrid } from "@/components/home/ProductCategoryGrid"
import { FacilityHighlights } from "@/components/home/FacilityHighlights"
import { MaterialCategoryGrid } from "@/components/home/MaterialCategoryGrid"
import { CTA } from "@/components/home/CTA"
import { GalleryShowcase } from "@/components/home/GalleryShowcase"
import { TeamGrid } from "@/components/home/TeamGrid"
import { LaserEntry } from "@/components/home/LaserEntry"
import { getSetting } from "@/lib/settings"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function Home() {
  const heroImages = await getSetting<string[]>("hero_images", [
    "/hasan_banner_2.jpg",
    "/hasan_banner_3.jpg",
    "/hasan_banner_4.jpg",
    "/hasan_banner_5.jpg",
    "/hasan_banner_6.jpg",
    "/hasan_banner_8.jpg",
    "/hasan_banner_9.jpg"
  ])

  const team = await prisma.teamMember.findMany({
    orderBy: { order: "asc" }
  })

  const galleryKeys = await getSetting<string[]>("home_gallery", [])

  return (
    <div className="flex flex-col">
      <LaserEntry>
        <Hero slides={heroImages} />
        <StatCounter />
        <ProductCategoryGrid />
        <MaterialCategoryGrid />
        <GalleryShowcase keys={galleryKeys} />
        <FacilityHighlights />
        <TeamGrid members={team} />
        <CTA />
      </LaserEntry>
    </div>
  )
}
