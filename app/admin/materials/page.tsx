import { prisma } from "@/lib/db"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

export default async function AdminMaterialsIndex() {
  const materials = await prisma.material.findMany({
    include: { parentCat: true },
    orderBy: { name: "asc" }
  })

  async function deleteMaterial(formData: FormData) {
    "use server"
    await prisma.material.delete({
      where: { id: formData.get("id") as string }
    })
    revalidatePath("/", "layout")
  }

  return (
    <div className="max-w-6xl pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-neutral-200 pb-4 gap-4">
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B]">
          MATERIAL <span className="text-[#10B981]">MANAGEMENT</span>
        </h1>
        <div className="flex gap-4">
          <Link href="/admin/materials/categories" className="bg-[#FFFFFF] border border-[#10B981] text-[#10B981] font-['DM_Mono'] text-xs uppercase tracking-widest px-6 py-2 hover:bg-[#10B981] hover:text-[#FAFAFA] transition-colors">
            Manage Categories
          </Link>
          <Link href="/admin/materials/new" className="bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-xs font-bold uppercase tracking-widest px-6 py-2 hover:bg-[#10B981] transition-colors">
            + New Material
          </Link>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFFFF] border border-neutral-200">
           <p className="font-['DM_Mono'] text-xs uppercase tracking-widest text-[#52525B]">No active material profiles found.</p>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-neutral-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#52525B]">
              <tr>
                <th className="px-6 py-4">Internal Name</th>
                <th className="px-6 py-4">Taxonomy Route</th>
                <th className="px-6 py-4">Visual Nodes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {materials.map(mat => (
                <tr key={mat.id} className="hover:bg-neutral-50/50">
                  <td className="px-6 py-4 font-['DM_Mono'] text-sm tracking-wide text-[#09090B] font-bold">
                    {mat.name}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#52525B]">
                    {mat.parentCat ? mat.parentCat.name : "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#10B981] font-bold">
                    {mat.imageKeys.length} active
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteMaterial}>
                      <input type="hidden" name="id" value={mat.id} />
                      <button type="submit" className="text-rose-500 hover:text-rose-700 text-[10px] font-['DM_Mono'] uppercase tracking-widest">
                        Scrub Data
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
