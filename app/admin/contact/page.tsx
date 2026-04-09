import { ContactList } from "@/components/admin/ContactList"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function ContactAdminPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div>
      <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider mb-8 border-b border-neutral-200 pb-4">
        Incoming Enquiries
      </h1>

      <ContactList initialData={submissions} />
    </div>
  )
}
