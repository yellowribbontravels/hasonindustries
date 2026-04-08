import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { productSchema } from "@/lib/validations/product"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(category ? { parentCat: { slug: category } } : {}),
        ...(featured === 'true' ? { featured: true } : featured === 'false' ? { featured: false } : {})
      },
      include: { parentCat: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const json = await req.json()
    const parsed = productSchema.parse(json)
    const product = await prisma.product.create({
      data: parsed
    })
    return NextResponse.json({ success: true, data: product })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid data" }, { status: 400 })
  }
}
