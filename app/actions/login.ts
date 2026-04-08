"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export type LoginState = {
  success: boolean
  message?: string
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", formData)
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid credentials." }
        default:
          return { success: false, message: "Something went wrong." }
      }
    }
    // Very important: we MUST throw the error if it isn't an AuthError
    // because NextAuth uses a NEXT_REDIRECT error internally on success!
    throw error 
  }
}
