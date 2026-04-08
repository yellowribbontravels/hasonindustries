import { LoginForm } from "@/components/admin/LoginForm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function LoginPage() {
  const session = await auth()
  if (session) {
    redirect("/admin/dashboard")
  }

  const count = await prisma.user.count()
  if (count === 0) {
    redirect("/setup")
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: "url('/grain.png')" }}></div>
      <div className="bg-[#FFFFFF] p-8 max-w-md w-full border-t-4 border-[#10B981] shadow-2xl relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-['Bebas_Neue'] text-[#09090B] tracking-wider mb-2">Hason Admin</h1>
          <p className="text-[#52525B] font-['DM_Mono'] text-sm">Industrial Portal Access</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
