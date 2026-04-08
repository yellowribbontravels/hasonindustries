import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    include: { parentCat: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider">Product Catalog</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-[#10B981] text-[#FAFAFA] font-['DM_Mono'] text-sm font-bold tracking-widest uppercase py-2 px-6 hover:bg-[#09090B] transition-colors"
        >
          [+] New Product
        </Link>
      </div>

      <div className="bg-[#FFFFFF] border border-neutral-200">
        <table className="w-full text-left font-['DM_Mono'] text-sm">
          <thead className="bg-[#FAFAFA] border-b border-neutral-200 text-[#52525B] text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">Feature Status</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#52525B]">No products found in the database.</td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id} className="border-b border-neutral-200 hover:bg-[#262626] transition-colors">
                <td className="p-4 text-[#52525B]">{product.parentCat?.name || "Uncategorized"}</td>
                <td className="p-4 text-[#52525B]">{product.featured ? <span className="text-[#10B981]">Featured</span> : "Standard"}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/products/${product.id}`} className="text-[#52525B] hover:text-[#10B981] underline decoration-neutral-700 hover:decoration-[#10B981] underline-offset-4">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
