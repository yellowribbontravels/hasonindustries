"use client"

import { useActionState, useEffect, useState } from "react"
import { submitContact, type ContactState } from "@/app/actions/contact"
import { useFormStatus } from "react-dom"
import { Loader2, CheckCircle, AlertCircle, X } from "lucide-react"

const initialState: ContactState = { success: false }

function SubmissionOverlay({ state }: { state: ContactState }) {
  const { pending } = useFormStatus()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    if (pending) {
      setStatus("loading")
    } else if (status === "loading") {
      if (state?.error) {
        setStatus("error")
      } else if (state?.success && state.timestamp) {
        setStatus("success")
        const form = document.getElementById("contactForm") as HTMLFormElement
        if (form) form.reset()
      }
    }
  }, [pending, state, status])

  if (status === "idle") return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAFAFA]/80 backdrop-blur-sm transition-all duration-300">
      <div className="bg-[#FFFFFF] border border-neutral-200 shadow-[0_20px_50px_rgba(16,185,129,0.05)] p-10 max-w-sm w-full flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 duration-200">

        {status !== "loading" && (
          <button type="button" onClick={() => setStatus("idle")} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}

        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-[#10B981] animate-spin mb-6" />
            <h3 className="text-2xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-2">Transmitting</h3>
            <p className="font-['DM_Mono'] text-xs text-[#52525B] uppercase tracking-widest">Establishing secure connection...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-[#10B981] mb-6" strokeWidth={1.5} />
            <h3 className="text-2xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-2 uppercase">Enquiry Received</h3>
            <p className="font-['Lora'] text-sm text-[#52525B] mb-8 leading-relaxed">Your message has been securely submitted. Our dispatch team will review your parameters shortly.</p>
            <button type="button" onClick={() => setStatus("idle")} className="w-full bg-[#10B981] text-[#FAFAFA] font-['Bebas_Neue'] tracking-widest text-xl py-3 hover:bg-[#09090B] transition-colors uppercase">
              Acknowledge
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-16 h-16 text-red-500 mb-6" strokeWidth={1.5} />
            <h3 className="text-2xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-2 uppercase">Connection Failed</h3>
            <p className="font-['Lora'] text-sm text-[#52525B] mb-8 leading-relaxed">{state?.error || "An anomaly occurred during payload transmission."}</p>
            <button type="button" onClick={() => setStatus("idle")} className="w-full bg-neutral-200 text-[#09090B] font-['Bebas_Neue'] tracking-widest text-xl py-3 hover:bg-[#09090B] hover:text-[#FAFAFA] transition-colors uppercase">
              Retry Connection
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState)

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
        <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Your Message</label>
        <textarea name="message" required rows={6} className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] p-4 focus:outline-none focus:border-[#10B981] font-['Lora'] text-sm resize-none transition-colors"></textarea>
      </div>

      <button
        type="submit"
        className="mt-4 bg-[#10B981] text-[#FAFAFA] font-['Bebas_Neue'] tracking-widest text-2xl py-4 flex items-center justify-center hover:bg-[#09090B] transition-colors disabled:opacity-50"
      >
        Establish Connection
      </button>

      <SubmissionOverlay state={state} />
    </form>
  )
}
