import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const body = await req.json()
    const { name, categoryId, description, specsStr, imageKeys } = body
    
    // Auto-generate safe slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    // Parse JSON
    let specs = null
    try {
      specs = JSON.parse(specsStr)
    } catch(e) {}

    const material = await prisma.material.create({
      data: {
        name,
        slug,
        category: "dynamic-node", // deprecated field kept for schema compat
        categoryId: categoryId || null,
        description,
        specs,
        imageKeys: (imageKeys || []).filter((k: string | null) => k != null)
      }
    })

    revalidatePath("/", "layout")
    return NextResponse.json(material)

  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
