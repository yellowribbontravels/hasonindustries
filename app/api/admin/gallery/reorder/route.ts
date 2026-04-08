import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { galleryReorderSchema } from "@/lib/validations/gallery"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const json = await req.json()
    const parsed = galleryReorderSchema.parse(json)
    
    await prisma.$transaction(
      parsed.map((item) => 
        prisma.galleryImage.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid data" }, { status: 400 })
  }
}
