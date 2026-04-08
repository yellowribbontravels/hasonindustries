import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const read = searchParams.get('read')
  
  try {
    const submissions = await prisma.contactSubmission.findMany({
      where: read !== null ? { read: read === 'true' } : {},
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: submissions })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
  }
}
