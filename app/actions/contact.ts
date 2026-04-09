"use server";

import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";
import { sendEmail } from "@/lib/mailer";
import { headers } from "next/headers";
import { getSetting } from "@/lib/settings";
import { buildEmailPayload } from "@/lib/email-templates";

// Server-level in-memory rate limiting map for basic protection
const rateLimitMap = new Map<string, number>();

export type ContactState = {
  success: boolean;
  error?: string;
  timestamp?: number;
};

export async function submitContact(
  prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const ip = (await headers()).get("x-forwarded-for") || "unknown";

  const now = Date.now();
  const windowTime = 60000; // 60s

  const lastCall = rateLimitMap.get(ip);
  if (lastCall && now - lastCall < windowTime) {
    return {
      success: false,
      error: "Rate limit exceeded. Please wait 60s before transmitting again.",
    };
  }

  rateLimitMap.set(ip, now);

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  try {
    const data = contactSchema.parse(payload);

    await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    });

    const fallbackEmailsStr = await getSetting<string>(
      "fallback_emails",
      process.env.GMAIL_USER || "",
    );
    const fallbackEmails = fallbackEmailsStr
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    if (fallbackEmails.length === 0 && process.env.GMAIL_USER) {
      fallbackEmails.push(process.env.GMAIL_USER);
    }

    if (fallbackEmails.length > 0) {
      const compiledAdmin = await buildEmailPayload(
        "New Contact Enquiry",
        `
          <p><strong>From:</strong> ${data.name} (<a href="mailto:${data.email}" style="color:#10B981;">${data.email}</a>)</p>
          <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="white-space: pre-wrap; color: #52525B;">${data.message}</p>
        `,
      );

      // Send individually to prevent reply-all chains
      const dispatchPromises = fallbackEmails.map((email) =>
        sendEmail({
          to: email,
          subject: `New Website Enquiry - ${data.subject}`,
          html: compiledAdmin.html,
          attachments: compiledAdmin.attachments,
        }),
      );

      await Promise.allSettled(dispatchPromises).catch((e) =>
        console.error("Admin dispatch errors:", e),
      );
    }

    // Auto-responder to the client
    const compiledClient = await buildEmailPayload(
      "Enquiry Received",
      `
        <p>Dear ${data.name},</p>
        <p>This is an automated confirmation that your enquiry has been received by Hason Industries.</p>
        <p>Your Subject: <strong>${data.subject}</strong></p>
        <p>Our sales and engineering teams are currently reviewing your inquiry. We typically process and respond to inbound communications within 1-2 business cycles.</p>
        <p>Thank you for contacting Hason Industries.</p>
      `,
    );

    await sendEmail({
      to: data.email,
      subject: "Hason Industries - Enquiry Received",
      html: compiledClient.html,
      attachments: compiledClient.attachments,
    }).catch((e) => console.error("Client autoreply fail:", e));

    return { success: true, timestamp: Date.now() };
  } catch (error: any) {
    return {
      success: false,
      error: error.issues ? "Invalid payload parameters." : error.message,
    };
  }
}
