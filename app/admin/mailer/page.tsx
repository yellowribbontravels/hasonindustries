export const dynamic = "force-dynamic"
import { Suspense } from "react"
import { MailerForm } from "@/components/admin/MailerForm"

export default function MailerPage() {
    return (
        <div className="max-w-4xl pb-24">
            <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B] mb-8 border-b border-neutral-200 pb-4">
                OUTBOUND <span className="text-[#10B981]">MAILER</span>
            </h1>

            <div className="bg-neutral-100 border border-neutral-200 p-6 mb-8">
                <p className="font-['DM_Mono'] text-xs text-[#52525B] tracking-wide leading-relaxed">
                    Use this terminal to dispatch secure HTML-formatted emails to clients. All messages are automatically wrapped in the standard Hason Industries secure email wrapper.
                </p>
            </div>

            <Suspense fallback={<div className="animate-pulse h-64 bg-neutral-200" />}>
                <MailerForm />
            </Suspense>
        </div>
    )
}
