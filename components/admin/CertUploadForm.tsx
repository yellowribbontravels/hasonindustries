"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ImagePlus, X, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CertUploadForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
       setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
       return toast.error("Please provide a scanned document or image.")
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Verifying and Uploading compliance documentation...")

    try {
      // 1. Get Presigned URL via existing proxy
      const presignRes = await fetch('/api/admin/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'certificates' })
      })
      const { presignedUrl, key } = await presignRes.json()

      // 2. Upload to Cloudflare R2
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      })

      // 3. Save to DB
      const dbRes = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, imageKey: key })
      })

      if (!dbRes.ok) throw new Error("DB Error")

      toast.success("Certificate Registered Successfully", { id: toastId })
      setTitle("")
      setFile(null)
      router.refresh()
      
    } catch (e) {
      toast.error("Registration failed.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div>
        <label className="block text-[10px] uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Certification Title (ex: ISO 9001:2015)</label>
        <input 
          type="text" 
          required 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 focus:border-[#10B981] outline-none" 
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Compliance Document (Scan)</label>
        
        {file ? (
          <div className="relative border border-neutral-200 p-4 flex items-center justify-between bg-neutral-50">
            <span className="font-['DM_Mono'] text-xs truncate max-w-[200px] text-[#09090B] font-bold">{file.name}</span>
            <button 
              type="button" 
              onClick={() => setFile(null)}
              className="text-rose-500 hover:text-rose-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div {...getRootProps()} className={`border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[#10B981] bg-[#10B981]/5' : 'border-neutral-300 hover:border-[#10B981]'}`}>
            <input {...getInputProps()} />
            <ImagePlus className="w-8 h-8 mx-auto mb-4 text-[#10B981]" />
            <p className="font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#52525B]">Drag & Drop Certified Document (Image/PDF)</p>
          </div>
        )}
      </div>

      <button 
        disabled={isSubmitting || !file} 
        type="submit" 
        className="bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-xs font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-[#10B981] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Register Certificate
      </button>
    </form>
  )
}
