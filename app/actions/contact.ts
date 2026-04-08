"use server"

import { prisma } from "@/lib/db"
import { contactSchema } from "@/lib/validations/contact"
import { sendEmail } from "@/lib/mailer"
import { headers } from "next/headers"

// Server-level in-memory rate limiting map for basic protection
const rateLimitMap = new Map<string, number>()

export type ContactState = {
  success: boolean
  error?: string
  timestamp?: number
}

export async function submitContact(prevState: ContactState, formData: FormData): Promise<ContactState> {
  const ip = (await headers()).get("x-forwarded-for") || "unknown"
  
  const now = Date.now()
  const windowTime = 60000 // 60s
  
  const lastCall = rateLimitMap.get(ip)
  if (lastCall && now - lastCall < windowTime) {
    return { success: false, error: "Rate limit exceeded. Please wait 60s before transmitting again." }
  }
  
  rateLimitMap.set(ip, now)

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message")
  }

  try {
    const data = contactSchema.parse(payload)

    await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message
      }
    })

    // Non-blocking dispatch
    sendEmail({
      to: process.env.GMAIL_USER!,
      subject: `SYS: CRM Log - ${data.subject}`,
      html: `
        <div style="font-family: monospace; background-color: #FAFAFA; color: #09090B; padding: 24px; border: 1px solid #FFFFFF;">
          <h2 style="color: #10B981;">Hason Inbound Routing</h2>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Node:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Topic:</strong> ${data.subject}</p>
          <hr style="border-color: #FFFFFF; margin: 20px 0;"/>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
      `
    }).catch((e: any) => console.error("Email dispatch failed:", e))

    return { success: true, timestamp: Date.now() }
  } catch (error: any) {
    return { success: false, error: error.issues ? "Invalid payload parameters." : error.message }
  }
}
