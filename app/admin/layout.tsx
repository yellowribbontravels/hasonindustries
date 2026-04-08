import { ReactNode } from "react"
import { auth, signOut } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  // Gracefully handle /admin/login by skipping sidebar injection when no session
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-['Lora'] text-[#09090B] selection:bg-[#10B981] selection:text-[#FAFAFA]">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-neutral-200 bg-[#FFFFFF] flex items-center justify-between px-8 sticky top-0 z-10 shrink-0 shadow-sm">
          <div className="font-['DM_Mono'] text-sm text-[#52525B] flex items-center">
            System Status: <span className="text-[#10B981] uppercase border border-[#10B981] px-1.5 py-0.5 ml-2 text-[10px] tracking-widest animate-pulse">Online</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right flex flex-col justify-center">
              <p className="font-['DM_Mono'] text-sm text-[#09090B] leading-none mb-1">{session.user?.name || session.user?.email}</p>
              <p className="font-['DM_Mono'] text-[10px] text-[#10B981] uppercase tracking-wider leading-none">{session.user?.role || "ADMIN"}</p>
            </div>
            
            <form action={async () => {
              "use server"
              await signOut({ redirectTo: "/admin/login" })
            }}>
              <button type="submit" className="text-[#52525B] hover:text-[#09090B] font-['DM_Mono'] text-xs uppercase underline decoration-neutral-700 hover:decoration-[#10B981] underline-offset-4 transition-all">
                Terminate Session
              </button>
            </form>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative">
          <div className="fixed inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: "url('/grain.png')" }}></div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
