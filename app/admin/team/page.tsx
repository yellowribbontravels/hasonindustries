import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Users } from "lucide-react"
import { TeamUploadForm } from "@/components/admin/TeamUploadForm"

export const dynamic = "force-dynamic"

export default async function AdminTeam() {
  const team = await prisma.teamMember.findMany({
    orderBy: { order: "asc" }
  })

  async function deleteMember(formData: FormData) {
    "use server"
    await prisma.teamMember.delete({
      where: { id: formData.get("id") as string }
    })
    revalidatePath("/", "layout")
  }

  return (
    <div className="max-w-4xl pb-24">
      <div className="flex items-center gap-4 mb-2 border-b border-neutral-200 pb-4">
        <Users className="w-8 h-8 text-[#10B981]" />
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B]">
          TEAM MEMBERS
        </h1>
      </div>
      
      <div className="bg-[#FFFFFF] border border-neutral-200 p-6 mb-10 mt-8">
        <h2 className="text-sm font-['DM_Mono'] text-[#09090B] tracking-widest uppercase mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Add Team Member
        </h2>
        
        <TeamUploadForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map(member => (
          <div key={member.id} className="bg-[#FFFFFF] border border-neutral-200 p-6 flex flex-col justify-between">
            <div>
               <p className="font-bold font-['DM_Mono'] text-[#09090B] tracking-wide text-sm">{member.name}</p>
               <p className="text-[10px] uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mt-1 mb-4">{member.role}</p>
               {member.whatsapp && <p className="text-xs text-[#10B981]">{member.whatsapp}</p>}
               {member.imageKey && <p className="text-[10px] text-neutral-400 mt-2 truncate">Image Attached</p>}
            </div>
            <div className="border-t border-neutral-100 pt-4 mt-6">
              <form action={deleteMember}>
                <input type="hidden" name="id" value={member.id} />
                <button type="submit" className="text-rose-500 hover:text-rose-700 text-[10px] font-['DM_Mono'] uppercase tracking-widest">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
