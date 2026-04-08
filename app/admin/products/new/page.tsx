import { ProductForm } from "@/components/admin/ProductForm"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default function NewProductPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-[#52525B] hover:text-[#10B981] font-['DM_Mono'] text-sm tracking-widest uppercase transition-colors">
          ← Back
        </Link>
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider">ADD NEW PRODUCT</h1>
      </div>
      
      <ProductForm />
    </div>
  )
}
