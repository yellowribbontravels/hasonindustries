import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { productSchema, productPartialSchema } from "@/lib/validations/product"
import { NextResponse } from "next/server"

type Params = Promise<{ id: string }>

export async function GET(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
  }
}

export async function PUT(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params

  try {
    const json = await req.json()
    const parsed = productSchema.parse(json)
    const product = await prisma.product.update({
      where: { id },
      data: parsed
    })
    return NextResponse.json({ success: true, data: product })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid data" }, { status: 400 })
  }
}

export async function PATCH(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params

  try {
    const json = await req.json()
    const parsed = productPartialSchema.parse(json)
    const product = await prisma.product.update({
      where: { id },
      data: parsed
    })
    return NextResponse.json({ success: true, data: product })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid data" }, { status: 400 })
  }
}

export async function DELETE(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params

  try {
    await prisma.product.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
  }
}
