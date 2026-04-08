"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const R2_BASE = "https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev"

export function GalleryGrid({ images }: { images: any[] }) {
  const router = useRouter()
  const [list, setList] = useState(images)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("index", index.toString())
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData("index"))
    if (dragIndex === dropIndex) return

    const newList = [...list]
    const [draggedItem] = newList.splice(dragIndex, 1)
    newList.splice(dropIndex, 0, draggedItem)

    const reordered = newList.map((item, idx) => ({ ...item, order: idx }))
    setList(reordered)

    try {
      await fetch("/api/admin/gallery/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reordered.map(r => ({ id: r.id, order: r.order })))
      })
      router.refresh()
    } catch {
      toast.error("Failed to sequence items")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete permanent image?")) return
    const toastId = toast.loading("Purging asset...")
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
      toast.success("Purged", { id: toastId })
      setList(p => p.filter(i => i.id !== id))
      router.refresh()
    } catch {
      toast.error("Error purging", { id: toastId })
    }
  }

  const updateCaption = async (id: string, caption: string) => {
    try {
      await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption })
      })
      toast.success("Caption committed")
      router.refresh()
    } catch {
      toast.error("Failed to commit caption")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {list.map((image, index) => (
        <div
          key={image.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, index)}
          className="bg-[#FFFFFF] border border-neutral-200 flex flex-col group cursor-grab active:cursor-grabbing hover:border-[#10B981] transition-colors"
        >
          <div className="h-48 bg-[#FAFAFA] flex items-center justify-center relative overflow-hidden group-hover:brightness-95 transition-all">
            <img
              src={image.key.startsWith('http') || image.key.startsWith('/') ? image.key : `${R2_BASE}/${image.key}`}
              alt="Gallery asset"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="p-4 flex flex-col gap-2">
            <input
              type="text"
              defaultValue={image.caption || ""}
              placeholder="Asset Caption..."
              onBlur={(e) => updateCaption(image.id, e.target.value)}
              className="bg-[#FAFAFA] border-none focus:ring-1 focus:ring-[#10B981] outline-none text-[#09090B] font-['DM_Mono'] text-xs p-2"
            />
            <button
              onClick={() => handleDelete(image.id)}
              className="text-red-500 hover:text-red-400 font-['DM_Mono'] text-[10px] uppercase tracking-widest text-left mt-2"
            >
              Purge Asset
            </button>
          </div>
        </div>
      ))}
      {list.length === 0 && (
        <div className="col-span-full p-8 border border-neutral-200 text-center text-[#52525B] font-['DM_Mono'] text-sm">
          No assets found in target bucket
        </div>
      )}
    </div>
  )
}
