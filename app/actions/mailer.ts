"use server";

import { sendEmail } from "@/lib/mailer";
import { buildEmailPayload } from "@/lib/email-templates";
import { auth } from "@/lib/auth";
import { z } from "zod";

const mailerSchema = z.object({
  recipient: z.string().email(),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Message content is required"),
});

export type MailerState = {
  success: boolean;
  error?: string;
  timestamp?: number;
};

export async function dispatchAdminEmail(
  prevState: MailerState,
  formData: FormData,
): Promise<MailerState> {
  const session = await auth();

  if (!session) {
    return { success: false, error: "Unauthorized access parameter." };
  }

  const payload = {
    recipient: formData.get("recipient"),
    subject: formData.get("subject"),
    content: formData.get("content"),
  };

  try {
    const data = mailerSchema.parse(payload);

    const compiled = await buildEmailPayload(data.subject, data.content);

    await sendEmail({
      to: data.recipient,
      subject: data.subject,
      html: compiled.html,
      attachments: compiled.attachments,
    });

    return { success: true, timestamp: Date.now() };
  } catch (error: any) {
    console.error("Admin Mailer Error Dump:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error: "System failure during email dispatch cascade.",
    };
  }
}
