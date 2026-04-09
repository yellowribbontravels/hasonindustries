import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#FAFAFA] px-4 text-center">
            <div className="w-24 h-24 bg-[#10B981]/10 flex items-center justify-center rounded-full mb-8">
                <AlertTriangle className="w-12 h-12 text-[#10B981]" strokeWidth={1.5} />
            </div>

            <h1 className="font-['Bebas_Neue'] text-6xl md:text-[100px] text-[#09090B] tracking-widest leading-none mb-4">
                404 <span className="text-[#10B981]">ERROR</span>
            </h1>

            <h2 className="font-['DM_Mono'] text-sm md:text-base uppercase tracking-widest text-[#09090B] font-bold mb-6 max-w-md">
                Page Not Found
            </h2>

            <p className="font-['Lora'] text-[#52525B] text-base md:text-lg mb-10 max-w-lg leading-relaxed">
                The page you are looking for has been moved, renamed, or no longer exists in our system. Please verify the URL or return to the main dashboard.
            </p>

            <Link href="/" className="bg-[#10B981] hover:bg-[#09090B] text-[#FAFAFA] font-['Bebas_Neue'] text-2xl tracking-widest py-4 px-12 transition-colors">
                Return to Homepage
            </Link>
        </div>
    )
}
