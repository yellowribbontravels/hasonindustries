import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { ShieldAlert, ShieldCheck, UserX } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  async function registerOperator(formData: FormData) {
    "use server"
    const password = formData.get("password") as string
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as string

    if (!password || !email) return

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role
      }
    })
    revalidatePath("/admin/users")
  }

  async function toggleClearance(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    const currentRole = formData.get("currentRole") as string
    const newRole = currentRole === "admin" ? "restricted" : "admin"

    await prisma.user.update({
      where: { id },
      data: { role: newRole }
    })
    revalidatePath("/admin/users")
  }

  async function scrubOperator(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    
    // Prevent deleting the very last admin
    const adminCount = await prisma.user.count({ where: { role: "admin" } })
    const targetUser = await prisma.user.findUnique({ where: { id } })
    
    if (adminCount <= 1 && targetUser?.role === "admin") {
       throw new Error("Cannot scrub the final administrative node.")
    }

    await prisma.user.delete({ where: { id } })
    revalidatePath("/admin/users")
  }

  return (
    <div className="max-w-5xl pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-neutral-200 pb-4 gap-4">
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B]">
          USER <span className="text-[#10B981]">ACCOUNTS</span>
        </h1>
      </div>

      <div className="bg-[#FFFFFF] border border-neutral-200 p-6 mb-10">
        <h2 className="text-sm font-['DM_Mono'] text-[#09090B] tracking-widest uppercase mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Add User Account
        </h2>
        
        <form action={registerOperator} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Name</label>
            <input type="text" name="name" required className="w-full border p-3 focus:border-[#10B981] outline-none bg-transparent" />
          </div>
          <div>
            <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Email Address</label>
            <input type="email" name="email" required className="w-full border p-3 focus:border-[#10B981] outline-none bg-transparent" />
          </div>
          <div>
            <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Password</label>
            <input type="text" name="password" required className="w-full border p-3 focus:border-[#10B981] outline-none bg-transparent" />
          </div>
          <div>
            <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Role</label>
            <select name="role" required className="w-full border p-3 focus:border-[#10B981] outline-none bg-transparent">
               <option value="admin">Admin</option>
               <option value="restricted">Restricted</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-xs font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-[#10B981] transition-colors">
              Create User
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-[#FFFFFF] border border-neutral-200 p-6 flex flex-col relative group">
            {user.role === "admin" ? (
              <ShieldCheck className="absolute top-6 right-6 w-5 h-5 text-[#10B981]" />
            ) : (
              <ShieldAlert className="absolute top-6 right-6 w-5 h-5 text-rose-500" />
            )}

            <h3 className="font-bold font-['DM_Mono'] text-[#09090B] tracking-wide text-sm">{user.name || "Unknown"}</h3>
            <p className="text-xs text-[#52525B] mt-1">{user.email}</p>
            
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between mt-auto">
              {/* Clearance Toggle */}
              <form action={toggleClearance}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="currentRole" value={user.role} />
                <button type="submit" className="text-[10px] font-['DM_Mono'] uppercase tracking-widest transition-colors hover:text-[#09090B] text-[#52525B]">
                   {user.role === "admin" ? "Restrict Access" : "Grant Admin"}
                </button>
              </form>
              
              {/* Scrub Operator */}
              <form action={scrubOperator}>
                 <input type="hidden" name="id" value={user.id} />
                 <button type="submit" className="text-rose-500 hover:bg-rose-50 p-2 rounded transition-colors group/btn" title="Scrub Operator Network">
                    <UserX className="w-4 h-4" />
                 </button>
              </form>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
