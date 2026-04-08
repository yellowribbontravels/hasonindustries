import { auth } from "@/lib/auth"
import { r2 } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const { filename, contentType, folder } = await req.json()
    
    const allowedFolders = ['products', 'gallery', 'materials', 'certificates', 'team']
    const safeFolder = folder && allowedFolders.includes(folder) ? folder : 'uploads'

    if (!contentType.startsWith("image/") && contentType !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Only images and PDFs are allowed" }, { status: 400 })
    }

    const extension = filename.split('.').pop()
    const key = `${safeFolder}/${randomUUID()}-${Date.now()}.${extension}`

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 })

    return NextResponse.json({ success: true, uploadUrl, presignedUrl: uploadUrl, key })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to create presigned URL" }, { status: 500 })
  }
}
