import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { SetupForm } from "@/components/admin/SetupForm"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function SetupPage() {
  const count = await prisma.user.count()
  if (count > 0) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: "url('/grain.png')" }}></div>
      <div className="bg-[#FFFFFF] p-8 max-w-md w-full border-t-4 border-[#10B981] shadow-2xl relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-['Bebas_Neue'] text-[#09090B] tracking-wider mb-2">System Initialization</h1>
          <p className="text-[#52525B] font-['DM_Mono'] text-sm">Create the master administrator account. This action can only be performed once.</p>
        </div>
        <SetupForm />
      </div>
    </div>
  )
}
