"use client"

import { useActionState, useEffect, useState } from "react"
import { dispatchAdminEmail, type MailerState } from "@/app/actions/mailer"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

import { Loader2, CheckCircle, AlertCircle, X } from "lucide-react"

// Dynamically import ReactQuill to prevent SSR window/document errors
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

const initialState: MailerState = { success: false }

function SubmissionOverlay({ state }: { state: MailerState }) {
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
                        <p className="font-['DM_Mono'] text-xs text-[#52525B] uppercase tracking-widest">Dispatching payload...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="w-16 h-16 text-[#10B981] mb-6" strokeWidth={1.5} />
                        <h3 className="text-2xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-2 uppercase">Message Dispatched</h3>
                        <p className="font-['Lora'] text-sm text-[#52525B] mb-8 leading-relaxed">The email has been successfully structured and delivered.</p>
                        <button type="button" onClick={() => setStatus("idle")} className="w-full bg-[#10B981] text-[#FAFAFA] font-['Bebas_Neue'] tracking-widest text-xl py-3 hover:bg-[#09090B] transition-colors uppercase">
                            Acknowledge
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <AlertCircle className="w-16 h-16 text-red-500 mb-6" strokeWidth={1.5} />
                        <h3 className="text-2xl font-['Bebas_Neue'] tracking-widest text-[#09090B] mb-2 uppercase">Delivery Failed</h3>
                        <p className="font-['Lora'] text-sm text-[#52525B] mb-8 leading-relaxed">{state?.error || "An anomaly occurred during email delivery."}</p>
                        <button type="button" onClick={() => setStatus("idle")} className="w-full bg-neutral-200 text-[#09090B] font-['Bebas_Neue'] tracking-widest text-xl py-3 hover:bg-[#09090B] hover:text-[#FAFAFA] transition-colors uppercase">
                            Retry Connection
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export function MailerForm() {
    const [state, formAction] = useActionState(dispatchAdminEmail, initialState)
    const [content, setContent] = useState("")
    const searchParams = useSearchParams()
    const replyTo = searchParams.get('replyTo') || ''
    const replySubject = searchParams.get('subject') || ''

    useEffect(() => {
        if (state?.success && state.timestamp) {
            const form = document.getElementById("mailerForm") as HTMLFormElement
            if (form) form.reset()
            setContent("")
        }
    }, [state])

    return (
        <form id="mailerForm" action={formAction} className="bg-[#FFFFFF] border border-neutral-200 p-8 flex flex-col gap-6">

            {/* Hidden input to pass the quill HTML to the FormData */}
            <input type="hidden" name="content" value={content} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Recipient Identity</label>
                    <input name="recipient" required type="email" defaultValue={replyTo} placeholder="client@address.com" className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] font-['DM_Mono'] text-sm transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Email Subject</label>
                    <input name="subject" required type="text" defaultValue={replySubject} placeholder="Project Finalization Details" className="bg-[#FAFAFA] border border-neutral-200 text-[#09090B] px-4 py-3 focus:outline-none focus:border-[#10B981] font-['Lora'] text-sm transition-colors" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">Payload Syntax</label>
                <div className="bg-[#FAFAFA] font-['Lora'] text-sm">
                    {/* @ts-ignore */}
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="h-64 mb-12"
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-6 bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#10B981] transition-colors disabled:opacity-50"
            >
                Dispatch Email
            </button>

            <SubmissionOverlay state={state} />
        </form>
    )
}
