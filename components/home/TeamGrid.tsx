import type { TeamMember } from "@/lib/generated/prisma/client/client"

const R2_BASE = "https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev"

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M11.996 0A12 12 0 000 12c0 2.112.552 4.103 1.528 5.861L.484 23.518l5.801-1.522C8.016 22.9 9.945 23.46 11.996 23.46A12 12 0 0024 11.464 12 12 0 0011.996 0zm0 19.55c-1.78 0-3.52-.478-5.05-1.385l-.36-.214-3.75.984.996-3.66-.236-.375c-.997-1.584-1.526-3.415-1.526-5.32 0-5.5 4.475-9.974 9.975-9.974 2.668 0 5.176 1.04 7.062 2.928 1.887 1.888 2.926 4.397 2.926 7.066 0 5.5-4.478 9.975-9.975 9.975zm5.48-7.498c-.3-.15-1.776-.877-2.052-.977-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.41-1.488-.89-.794-1.492-1.775-1.667-2.075-.175-.3-.02-.463.13-.613.135-.135.3-.35.45-.525.15-.176.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.675-1.626-.925-2.226-.24-.582-.486-.503-.675-.513-.175-.01-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1s1.775 2.7 4.3 3.75c2.525 1.05 2.525.7 2.975.65.45-.05 1.45-.595 1.65-1.17.2-.575.2-1.075.14-1.175-.06-.1-.21-.15-.51-.3z" />
  </svg>
)

export function TeamGrid({ members }: { members: TeamMember[] }) {
  if (!members || members.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] border-t border-neutral-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 md:mb-14">
          <p className="font-['DM_Mono'] text-[#10B981] text-[10px] uppercase tracking-widest mb-2">Our People</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Bebas_Neue'] tracking-widest text-[#09090B]">
            Meet the <span className="text-[#10B981]">Team</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {members.map((member) => (
            <div key={member.id} className="group flex flex-col bg-[#FFFFFF] border border-neutral-200 overflow-hidden hover:border-[#10B981] transition-colors">
              {/* Photo */}
              <div className="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden">
                <img
                  src={
                    member.imageKey
                      ? `${R2_BASE}/${member.imageKey}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=10B981&color=fff&size=400`
                  }
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
                <h3 className="text-sm sm:text-base font-bold font-['DM_Mono'] text-[#09090B] uppercase tracking-wide leading-tight">
                  {member.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-[#52525B] font-['Lora'] tracking-wider mt-1 mb-4 flex-1 leading-relaxed">
                  {member.role}
                </p>

                {member.whatsapp && (
                  <a
                    href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-[#FAFAFA] py-2.5 px-3 font-['DM_Mono'] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-[#1EBE5A] transition-colors"
                  >
                    <WhatsAppIcon />
                    <span className="hidden sm:inline">Connect</span>
                    <span className="sm:hidden">Chat</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
