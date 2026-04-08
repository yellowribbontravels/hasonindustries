"use server"

import { prisma } from "@/lib/db"
import { setupSchema } from "@/lib/validations/setup"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export type SetupState = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export async function createAdmin(prevState: SetupState, formData: FormData): Promise<SetupState> {
  const data = Object.fromEntries(formData.entries())
  const result = setupSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: result.error.flatten().fieldErrors
    }
  }

  try {
    const count = await prisma.user.count()
    if (count > 0) {
      return {
        success: false,
        message: "Admin already exists."
      }
    }

    const { name, email, password } = result.data

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin"
      }
    })
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during database initialization."
    }
  }

  // Redirect runs outside try-catch to allow Next.js routing logic to execute
  redirect("/admin/login")
}
