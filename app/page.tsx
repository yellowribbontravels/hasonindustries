import { Hero } from "@/components/home/Hero"
import { StatCounter } from "@/components/home/StatCounter"
import { ProductCategoryGrid } from "@/components/home/ProductCategoryGrid"
import { FacilityHighlights } from "@/components/home/FacilityHighlights"
import { CTA } from "@/components/home/CTA"
import { GalleryShowcase } from "@/components/home/GalleryShowcase"
import { TeamGrid } from "@/components/home/TeamGrid"
import { getSetting } from "@/lib/settings"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function Home() {
  const heroImages = await getSetting<string[]>("hero_images", [
    "/placeholder-hero.jpg"
  ])

  const team = await prisma.teamMember.findMany({
    orderBy: { order: "asc" }
  })

  const galleryKeys = await getSetting<string[]>("home_gallery", [])

  return (
    <div className="flex flex-col">
      <Hero slides={heroImages} />
      <StatCounter />
      <ProductCategoryGrid />
      <GalleryShowcase keys={galleryKeys} />
      <FacilityHighlights />
      <TeamGrid members={team} />
      <CTA />
    </div>
  )
}
