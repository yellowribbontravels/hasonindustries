"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export function GalleryUploader() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    const toastId = toast.loading(`Uploading ${files.length} images...`)

    try {
      for (const file of files) {
        const presignRes = await fetch("/api/admin/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            folder: "gallery"
          })
        })
        const { success, uploadUrl, key, error } = await presignRes.json()
        if (!success) throw new Error(error)

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file
        })
        
        if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`)

        await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, caption: "", order: 0 })
        })
      }

      toast.success("All images uploaded successfully", { id: toastId })
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Upload failed", { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-[#FFFFFF] border border-neutral-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h2 className="text-[#09090B] font-['Bebas_Neue'] text-2xl tracking-wider">Asset Uploader</h2>
        <p className="text-[#52525B] font-['DM_Mono'] text-xs mt-1">Direct bridge to Cloudflare R2 /gallery partition</p>
      </div>
      
      <label className={`cursor-pointer bg-[#10B981] text-[#FAFAFA] font-['DM_Mono'] text-sm font-bold tracking-widest uppercase py-3 px-6 hover:bg-[#09090B] transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
        {isUploading ? "Uploading..." : "[+] Select Files"}
        <input 
          type="file" 
          multiple 
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  )
}
