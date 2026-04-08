export const dynamic = "force-dynamic"
import { getSetting } from "@/lib/settings"
import { updateContactSettings } from "@/app/actions/settings"

// Minimal client shell wrapper for the Server Action
export default async function SettingsPage() {
  const contactInfo = await getSetting("contact_info", { phone1: "", phone2: "", email: "", address: "" })
  const heroImages = await getSetting<string[]>("hero_images", [])

  return (
    <div className="max-w-4xl pb-24">
      <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B] mb-8 border-b border-neutral-200 pb-4">
        GLOBAL <span className="text-[#10B981]">SETTINGS</span>
      </h1>
      
      <div className="bg-[#FFFFFF] border border-neutral-200 p-6 mb-10">
        <h2 className="text-sm font-['DM_Mono'] text-[#09090B] tracking-widest uppercase mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Contact Information
        </h2>
        
        <form action={updateContactSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Phone 1</label>
              <input type="text" name="phone1" defaultValue={contactInfo.phone1} className="w-full border p-3 focus:border-[#10B981] outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Phone 2</label>
              <input type="text" name="phone2" defaultValue={contactInfo.phone2} className="w-full border p-3 focus:border-[#10B981] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Email Address</label>
            <input type="email" name="email" defaultValue={contactInfo.email} className="w-full border p-3 focus:border-[#10B981] outline-none" />
          </div>
          <div>
            <label className="block text-xs uppercase font-['DM_Mono'] tracking-widest text-[#52525B] mb-2">Headquarters Address</label>
            <textarea name="address" rows={3} defaultValue={contactInfo.address} className="w-full border p-3 focus:border-[#10B981] outline-none whitespace-pre-line"></textarea>
          </div>
          
          <button type="submit" className="bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#10B981] transition-colors">
            Save Settings
          </button>
        </form>
      </div>
      
      <div className="bg-neutral-100 border border-neutral-200 p-6">
        <p className="font-['DM_Mono'] text-xs text-[#52525B] tracking-wide">
           Note: Header and Footer contact information updates immediately after saving.
        </p>
      </div>

    </div>
  )
}
