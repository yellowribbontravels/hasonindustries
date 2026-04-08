import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { contactUpdateSchema } from "@/lib/validations/contact-update"
import { NextResponse } from "next/server"

type Params = Promise<{ id: string }>

export async function GET(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params

  try {
    const submission = await prisma.contactSubmission.findUnique({
      where: { id }
    })
    if (!submission) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: submission })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params

  try {
    const json = await req.json()
    const parsed = contactUpdateSchema.parse(json)
    
    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: parsed
    })
    return NextResponse.json({ success: true, data: submission })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid data" }, { status: 400 })
  }
}

export async function DELETE(req: Request, segmentData: { params: Params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const { id } = await segmentData.params

  try {
    await prisma.contactSubmission.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
  }
}
