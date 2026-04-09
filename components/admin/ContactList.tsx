"use client"

import { useState } from "react"
import toast from "react-hot-toast"

export function ContactList({ initialData }: { initialData: any[] }) {
  const [list, setList] = useState(initialData)

  const toggleRead = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setList(p => p.map(i => i.id === id ? { ...i, read: nextStatus } : i))
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: nextStatus })
      })
      if (!res.ok) throw new Error()
      toast.success(nextStatus ? "Marked Complete" : "Re-Flagged Unread")
    } catch {
      toast.error("Failed status toggle")
      setList(p => p.map(i => i.id === id ? { ...i, read: currentStatus } : i))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this enquiry?")) return
    const toastId = toast.loading("Purging...")
    try {
      const res = await fetch(`/api/admin/contact/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setList(p => p.filter(i => i.id !== id))
      toast.success("Purged", { id: toastId })
    } catch {
      toast.error("Purge failure", { id: toastId })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {list.length === 0 && (
        <div className="p-8 bg-[#FFFFFF] border border-neutral-200 text-center text-[#52525B] font-['DM_Mono'] text-sm">
          No enquiries received.
        </div>
      )}

      {list.map(sub => (
        <div key={sub.id} className={`p-6 border flex flex-col gap-4 transition-colors duration-300 ${sub.read ? 'bg-[#FFFFFF] border-neutral-200 opacity-60 hover:opacity-100' : 'bg-[#FAFAFA] border-[#10B981] shadow-[0_0_15px_rgba(232,160,32,0.05)]'}`}>

          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className={`text-xl font-['Bebas_Neue'] tracking-widest uppercase ${sub.read ? 'text-[#52525B]' : 'text-[#09090B]'}`}>{sub.subject}</h3>
              <p className="font-['DM_Mono'] text-xs text-[#52525B] mt-1 tracking-wider uppercase">
                {sub.name} &bull; {sub.email} {sub.phone && `• ${sub.phone}`}
              </p>
            </div>

            <div className="flex gap-4 shrink-0 mt-1">
              <button
                onClick={() => toggleRead(sub.id, sub.read)}
                className="font-['DM_Mono'] text-[10px] tracking-widest uppercase hover:text-[#10B981] transition-colors"
                style={{ color: sub.read ? '#52525B' : '#10B981' }}
              >
                {sub.read ? "Mark Unread" : "Mark Read"}
              </button>
              <a
                href={`/admin/mailer?replyTo=${encodeURIComponent(sub.email)}&subject=${encodeURIComponent(`Re: ${sub.subject}`)}`}
                className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#52525B] hover:text-[#09090B] transition-colors"
              >
                Reply
              </a>
              <button
                onClick={() => handleDelete(sub.id)}
                className="text-red-500/70 hover:text-red-400 font-['DM_Mono'] text-[10px] tracking-widest uppercase transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="bg-[#FAFAFA] p-5 font-['Lora'] text-[#09090B] text-sm leading-relaxed whitespace-pre-wrap selection-brand border-l-4 border-l-neutral-800">
            {sub.message}
          </div>

          <div className="font-['DM_Mono'] text-[10px] text-[#52525B] uppercase tracking-widest flex items-center justify-between">
            <span>Enquiry Log: {new Date(sub.createdAt).toLocaleString()}</span>
            <span>ID: {sub.id.substring(0, 8)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
