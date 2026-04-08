import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Layers } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminProductCategories() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { order: "asc" }
  })

  async function createCategory(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    if (!name) return
    
    await prisma.productCategory.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    })
    revalidatePath("/", "layout")
  }

  async function deleteCategory(formData: FormData) {
    "use server"
    await prisma.productCategory.delete({
       where: { id: formData.get("id") as string }
    })
    revalidatePath("/", "layout")
  }

  return (
    <div className="max-w-4xl pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-neutral-200 pb-4 gap-4">
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B]">
          PRODUCT <span className="text-[#10B981]">CATEGORIES</span>
        </h1>
        <div className="flex items-center gap-2">
           <Layers className="w-5 h-5 text-[#10B981]" />
        </div>
      </div>
      
      <div className="bg-[#FFFFFF] border border-neutral-200 p-6 mb-10">
        <h2 className="text-sm font-['DM_Mono'] text-[#09090B] tracking-widest uppercase mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Create Category
        </h2>
        
        <form action={createCategory} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Category Name</label>
            <input type="text" name="name" required className="w-full border p-3 focus:border-[#10B981] outline-none" />
          </div>
          <button type="submit" className="bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#10B981] transition-colors whitespace-nowrap">
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-[#FFFFFF] border border-neutral-200 divide-y divide-neutral-200">
        {categories.map(cat => (
          <div key={cat.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold font-['DM_Mono'] text-[#09090B] tracking-wide text-sm">{cat.name}</p>
              <p className="text-xs text-[#52525B] font-['DM_Mono'] mt-1">/{cat.slug}</p>
            </div>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={cat.id} />
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
