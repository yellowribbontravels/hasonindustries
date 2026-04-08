"use client"

import { useActionState, useEffect } from "react"
import { submitContact, type ContactState } from "@/app/actions/contact"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"

const initialState: ContactState = { success: false }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="mt-4 bg-[#10B981] text-[#FAFAFA] font-['Bebas_Neue'] tracking-widest text-2xl py-4 flex items-center justify-center hover:bg-[#09090B] transition-colors disabled:opacity-50"
    >
      {pending ? "Transmitting..." : "Establish Connection"}
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    } else if (state?.success && state.timestamp) {
       toast.success("Telemetry log submitted successfully.")
       const form = document.getElementById("contactForm") as HTMLFormElement
       if(form) form.reset()
    }
  }, [state])

  return (
    <form id="contactForm" action={formAction} className="bg-[#FFFFFF] border border-neutral-200 p-8 flex flex-col gap-6 shadow-[0_0_50px_rgba(232,160,32,0.02)]">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="flex flex-col gap-2">
           <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Full Name / Organization</label>
           <input name="name" required type="text" className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] font-['Lora'] text-sm transition-colors" />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Secure Email</label>
           <input name="email" required type="email" className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] font-['DM_Mono'] text-sm transition-colors" />
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="flex flex-col gap-2">
           <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Direct Line (Optional)</label>
           <input name="phone" type="tel" className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] font-['DM_Mono'] text-sm transition-colors" />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Subject Protocol</label>
           <input name="subject" required type="text" className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] font-['Lora'] text-sm transition-colors" />
         </div>
       </div>

       <div className="flex flex-col gap-2">
         <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Transmission Payload</label>
         <textarea name="message" required rows={6} className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] p-4 focus:outline-none focus:border-[#10B981] font-['Lora'] text-sm resize-none transition-colors"></textarea>
       </div>

       <SubmitButton />
    </form>
  )
}
