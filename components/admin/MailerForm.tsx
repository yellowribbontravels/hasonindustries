"use client"

import { useActionState, useEffect, useState } from "react"
import { dispatchAdminEmail, type MailerState } from "@/app/actions/mailer"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

// Dynamically import ReactQuill to prevent SSR window/document errors
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

const initialState: MailerState = { success: false }

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-6 bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#10B981] transition-colors disabled:opacity-50"
        >
            {pending ? "Transmitting..." : "Dispatch Email"}
        </button>
    )
}

export function MailerForm() {
    const [state, formAction] = useActionState(dispatchAdminEmail, initialState)
    const [content, setContent] = useState("")
    const searchParams = useSearchParams()
    const replyTo = searchParams.get('replyTo') || ''
    const replySubject = searchParams.get('subject') || ''

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        } else if (state?.success && state.timestamp) {
            toast.success("Message dispatched successfully.")
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

            <SubmitButton />
        </form>
    )
}
