"use client"

import { useActionState } from "react"
import { createAdmin } from "@/app/actions/setup"

export function SetupForm() {
  const [state, formAction, isPending] = useActionState(createAdmin, {
    success: false,
    message: "",
    errors: {}
  })

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.message && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 text-[#09090B]">
          <p>{state.message}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[#52525B] font-['DM_Mono'] text-xs tracking-widest uppercase">Full Name</label>
        <input 
          name="name"
          type="text" 
          className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] transition-colors font-['Lora']"
        />
        {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name[0]}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#52525B] font-['DM_Mono'] text-xs tracking-widest uppercase">Email Address</label>
        <input 
          name="email"
          type="email" 
          className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] transition-colors font-['Lora']"
        />
        {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email[0]}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#52525B] font-['DM_Mono'] text-xs tracking-widest uppercase">Password</label>
        <input 
          name="password"
          type="password" 
          className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] transition-colors font-['Lora']"
        />
        {state.errors?.password && <p className="text-red-500 text-sm">{state.errors.password[0]}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#52525B] font-['DM_Mono'] text-xs tracking-widest uppercase">Confirm Password</label>
        <input 
          name="confirmPassword"
          type="password" 
          className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] transition-colors font-['Lora']"
        />
        {state.errors?.confirmPassword && <p className="text-red-500 text-sm">{state.errors.confirmPassword[0]}</p>}
      </div>

      <button 
        type="submit"
        disabled={isPending}
        className="mt-4 bg-[#10B981] text-[#FAFAFA] font-['Bebas_Neue'] tracking-widest text-xl py-3 px-6 hover:bg-[#09090B] transition-colors disabled:opacity-50"
      >
        {isPending ? "Initializing..." : "Initialize"}
      </button>
    </form>
  )
}
