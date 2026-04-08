"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ImagePlus, X, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export function TeamUploadForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: "", role: "", whatsapp: "" })
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const toastId = toast.loading("Saving team member...")

    try {
      let imageKey = ""
      if (file) {
        toast.loading("Uploading team member image...", { id: toastId })
        const presignRes = await fetch('/api/admin/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'team' })
        })
        const { presignedUrl, key } = await presignRes.json()

        await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        })
        imageKey = key
      }

      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageKey })
      })

      if (!res.ok) throw new Error("API Error")

      toast.success("Team member saved", { id: toastId })
      setFormData({ name: "", role: "", whatsapp: "" })
      setFile(null)
      router.refresh()
    } catch (error) {
      toast.error("Failed to save", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Name</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3 focus:border-[#10B981] outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Role</label>
          <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-3 focus:border-[#10B981] outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">WhatsApp Number (+91...)</label>
          <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full border p-3 focus:border-[#10B981] outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Profile Image</label>
          
          {file ? (
             <div className="relative border border-neutral-200 p-3 flex items-center justify-between bg-neutral-50 h-[50px]">
               <span className="font-['DM_Mono'] text-xs truncate max-w-[200px] text-[#09090B] font-bold">{file.name}</span>
               <button type="button" onClick={() => setFile(null)} className="text-rose-500 hover:text-rose-700">
                 <X className="w-5 h-5" />
               </button>
             </div>
          ) : (
            <div {...getRootProps()} className={`border-2 border-dashed p-3 h-[50px] flex items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-[#10B981] bg-[#10B981]/5' : 'border-neutral-300 hover:border-[#10B981]'}`}>
              <input {...getInputProps()} />
              <p className="font-['DM_Mono'] text-xs uppercase tracking-widest text-[#52525B]">Click or Drop Image</p>
            </div>
          )}
        </div>
      </div>

      <button disabled={isSubmitting} type="submit" className="bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-xs font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-[#10B981] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Save Team Member
      </button>
    </form>
  )
}
