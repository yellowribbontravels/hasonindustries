import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const { title, imageKey } = await req.json()
    
    if (!title || !imageKey) {
        return new NextResponse("Missing criteria", { status: 400 })
    }

    const cert = await prisma.certificate.create({
      data: {
        title,
        imageKey
      }
    })

    revalidatePath("/", "layout")
    return NextResponse.json(cert)

  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
