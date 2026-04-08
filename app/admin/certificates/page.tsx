import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { ShieldCheck } from "lucide-react"
import { CertUploadForm } from "@/components/admin/CertUploadForm"

export const dynamic = "force-dynamic"

export default async function AdminCertificates() {
  const certs = await prisma.certificate.findMany({
    orderBy: { order: "asc" }
  })



  async function deleteCert(formData: FormData) {
    "use server"
    await prisma.certificate.delete({
      where: { id: formData.get("id") as string }
    })
    revalidatePath("/", "layout")
  }

  return (
    <div className="max-w-4xl pb-24">
      <div className="flex items-center gap-4 mb-2 border-b border-neutral-200 pb-4">
        <ShieldCheck className="w-8 h-8 text-[#10B981]" />
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B]">
          CERTIFICATES
        </h1>
      </div>
      
      <div className="bg-[#FFFFFF] border border-neutral-200 p-6 mb-10 mt-8">
        <h2 className="text-sm font-['DM_Mono'] text-[#09090B] tracking-widest uppercase mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Add Certificate
        </h2>
        
        <CertUploadForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map(cert => (
          <div key={cert.id} className="bg-[#FFFFFF] border border-neutral-200 p-4 flex items-center justify-between">
            <p className="font-bold font-['DM_Mono'] text-[#09090B] tracking-wide text-sm">{cert.title}</p>
            <form action={deleteCert}>
              <input type="hidden" name="id" value={cert.id} />
              <button type="submit" className="text-rose-500 hover:text-rose-700 text-[10px] font-['DM_Mono'] uppercase tracking-widest">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
