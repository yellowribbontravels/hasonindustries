import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

// Public API strictly for populating forms
export async function GET() {
  try {
    const categories = await prisma.materialCategory.findMany({
      select: { id: true, name: true },
      orderBy: { order: "asc" }
    })
    return NextResponse.json(categories)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
