import { ProductForm } from "@/components/admin/ProductForm"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

type Params = Promise<{ id: string }>

export default async function EditProductPage(segmentData: { params: Params }) {
  const { id } = await segmentData.params
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-[#52525B] hover:text-[#10B981] font-['DM_Mono'] text-sm tracking-widest uppercase transition-colors">
          ← Back
        </Link>
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider">Configure Product: {product.name}</h1>
      </div>
      
      <ProductForm initialData={product} />
    </div>
  )
}
