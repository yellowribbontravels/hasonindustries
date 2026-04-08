import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cats = await prisma.productCategory.findMany({
      orderBy: { name: "asc" }
    })
    return NextResponse.json(cats)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    const cat = await prisma.productCategory.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    })
    return NextResponse.json(cat)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
