"use server"

import { setSetting } from "@/lib/settings"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export type SettingsState = {
  success: boolean
  error?: string
  timestamp?: number
}

export async function updateContactSettings(formData: FormData) {
  const session = await auth()
  if (!session) return
  
  const phone1 = formData.get("phone1")
  const phone2 = formData.get("phone2")
  const email = formData.get("email")
  const address = formData.get("address")
  
  await setSetting("contact_info", { phone1, phone2, email, address })
  
  // Revalidate entire app to push new navbar contact details
  revalidatePath("/", "layout")
}
