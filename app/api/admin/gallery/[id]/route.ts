import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { galleryUpdateSchema } from "@/lib/validations/gallery"
import { NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/r2"

type Params = Promise<{ id: string }>

export async function PATCH(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params

  try {
    const json = await req.json()
    const parsed = galleryUpdateSchema.parse(json)
    const image = await prisma.galleryImage.update({
      where: { id },
      data: parsed
    })
    return NextResponse.json({ success: true, data: image })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid data" }, { status: 400 })
  }
}

export async function DELETE(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params

  try {
    const image = await prisma.galleryImage.findUnique({ where: { id } })
    if (!image) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })

    await prisma.galleryImage.delete({ where: { id } })

    if (image.key) {
      await r2.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: image.key
      })).catch((e: Error) => console.error("Failed to delete from R2:", e))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
  }
}
