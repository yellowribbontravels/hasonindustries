import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { gallerySchema } from "@/lib/validations/gallery"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ success: true, data: images })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const json = await req.json()
    const parsed = gallerySchema.parse(json)
    const image = await prisma.galleryImage.create({
      data: parsed
    })
    return NextResponse.json({ success: true, data: image })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid data" }, { status: 400 })
  }
}
