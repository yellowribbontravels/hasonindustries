"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"
import { ImagePlus, X, Loader2, Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

export default function NewMaterial() {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
  })

  const [specs, setSpecs] = useState<{ key: string, value: string }[]>([
    { key: "Thickness", value: "0.1mm - 100mm" },
    { key: "Temperature", value: "Class H" }
  ])

  useEffect(() => {
    fetch('/api/admin/material-categories').then(res => res.json()).then(data => setCategories(data)).catch(() => { })
  }, [])

  const imageHandler = useCallback(function (this: any) {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null
      if (!file) return

      const toastId = toast.loading("Uploading inline image...")
      try {
        const presignRes = await fetch('/api/admin/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'materials' })
        })
        const { presignedUrl, key } = await presignRes.json()

        await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        })

        const quillObj = this.quill
        const range = quillObj.getSelection()
        const url = `https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev/${key}`

        quillObj.insertEmbed(range?.index || 0, "image", url)
        toast.success("Image embedded", { id: toastId })
      } catch (e) {
        toast.error("Image upload failed", { id: toastId })
      }
    }
  }, [])

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }])
  }

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = val
    setSpecs(newSpecs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const toastId = toast.loading("Saving material...")

    try {
      let imageKeys: string[] = []

      // Multi-upload
      if (files.length > 0) {
        toast.loading("Uploading images...", { id: toastId })
        for (const file of files) {
          const presignRes = await fetch('/api/admin/upload/presign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'materials' })
          })
          const { presignedUrl, key } = await presignRes.json()

          await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type }
          })
          imageKeys.push(key)
        }
      }

      // Convert specs to an object format expected by the DB or standard JSON
      const specsObj = specs.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key] = curr.value
        return acc
      }, {} as Record<string, string>)

      toast.loading("Saving properties...", { id: toastId })
      const res = await fetch('/api/admin/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          specsStr: JSON.stringify(specsObj),
          imageKeys
        })
      })

      if (!res.ok) throw new Error("API Failure")

      toast.success("Material saved successfully", { id: toastId })
      router.push('/admin/materials')

    } catch (error) {
      toast.error("Failed to save. Please try again.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl pb-24">
      <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B] mb-8 border-b border-neutral-200 pb-4">
        NEW <span className="text-[#10B981]">MATERIAL</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        <div className="bg-[#FFFFFF] border border-neutral-200 p-6 space-y-6">
          <h2 className="text-sm font-['DM_Mono'] text-[#09090B] tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Material Name</label>
              <input type="text" required className="w-full border p-3 focus:border-[#10B981] outline-none"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Category</label>
              <select required className="w-full border p-3 focus:border-[#10B981] outline-none bg-transparent"
                value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                <option value="" disabled>Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Description (Rich HTML)</label>
            <div className="bg-white border focus-within:border-[#10B981] transition-colors">
              {/* @ts-ignore */}
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(val: string) => setFormData({ ...formData, description: val })}
                modules={modules}
                className="h-64 mb-12"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Key-Value Specs */}
        <div className="bg-[#FFFFFF] border border-neutral-200 p-6 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-['DM_Mono'] text-[#09090B] tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Specifications List
            </h2>
            <button type="button" onClick={addSpec} className="flex items-center gap-1 text-xs font-['DM_Mono'] text-[#10B981] hover:text-[#0B8A4C]">
              <Plus className="w-4 h-4" /> Add Spec
            </button>
          </div>

          {specs.map((spec, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input type="text" placeholder="Spec Name (e.g. Thickness)" className="w-full border p-3 focus:border-[#10B981] outline-none"
                  value={spec.key} onChange={e => updateSpec(index, "key", e.target.value)} />
              </div>
              <div className="flex-[2]">
                <input type="text" placeholder="Value (e.g. 10mm)" className="w-full border p-3 focus:border-[#10B981] outline-none"
                  value={spec.value} onChange={e => updateSpec(index, "value", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeSpec(index)} className="p-3 text-rose-500 hover:bg-rose-50 transition-colors border border-transparent">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Multi-Dropzone */}
        <div className="bg-[#FFFFFF] border border-neutral-200 p-6">
          <h2 className="text-sm font-['DM_Mono'] text-[#09090B] tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Images
          </h2>

          <div {...getRootProps()} className={`border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[#10B981] bg-[#10B981]/5' : 'border-neutral-300 hover:border-[#10B981]'}`}>
            <input {...getInputProps()} />
            <ImagePlus className="w-8 h-8 mx-auto mb-4 text-[#10B981]" />
            <p className="font-['DM_Mono'] text-xs uppercase tracking-widest text-[#52525B]">Drag & Drop Images Here</p>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {files.map((file, i) => (
                <div key={i} className="relative group aspect-square bg-neutral-100 border border-neutral-200">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFile(i)} className="absolute top-2 right-2 bg-rose-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button disabled={isSubmitting} type="submit" className="bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-sm font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-[#10B981] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Material
        </button>
      </form>
    </div>
  )
}
