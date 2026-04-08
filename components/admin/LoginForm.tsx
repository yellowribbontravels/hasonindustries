"use client"

import { useActionState } from "react"
import { login } from "@/app/actions/login"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    message: ""
  })

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.message && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 text-[#09090B]">
          <p>{state.message}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[#52525B] font-['DM_Mono'] text-xs tracking-widest uppercase">Email Address</label>
        <input 
          name="email"
          type="email" 
          required
          className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] transition-colors font-['Lora']"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#52525B] font-['DM_Mono'] text-xs tracking-widest uppercase">Password</label>
        <input 
          name="password"
          type="password" 
          required
          className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] transition-colors font-['Lora']"
        />
      </div>

      <button 
        type="submit"
        disabled={isPending}
        className="mt-6 bg-[#10B981] text-[#FAFAFA] font-['Bebas_Neue'] tracking-widest text-xl py-3 px-6 hover:bg-[#09090B] transition-colors disabled:opacity-50"
      >
        {isPending ? "Authenticating..." : "Login"}
      </button>
    </form>
  )
}
