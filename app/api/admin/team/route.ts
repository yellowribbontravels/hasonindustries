import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const { name, role, whatsapp, imageKey } = await req.json()
    
    if (!name || !role) {
        return new NextResponse("Missing fields", { status: 400 })
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        whatsapp: whatsapp || null,
        imageKey: imageKey || null
      }
    })

    revalidatePath("/", "layout")
    return NextResponse.json(member)

  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
