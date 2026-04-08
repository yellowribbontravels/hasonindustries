import { prisma } from "@/lib/db"
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { Database, HardDrive, Cpu, Activity, Info } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [
    productCount, 
    galleryCount, 
    unreadContacts, 
    userCount, 
    materialCount, 
    certCount
  ] = await Promise.all([
    prisma.product.count(),
    prisma.galleryImage.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.user.count(),
    prisma.material.count(),
    prisma.certificate.count()
  ])

  // R2 Edge Network Telemetry
  let totalBytes = 0
  let totalObjects = 0
  let r2Status = "OFFLINE"

  if (process.env.R2_ACCOUNT_ID) {
    try {
      const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
      })

      const response = await s3.send(new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
      }))
      
      if (response.Contents) {
        totalObjects += response.Contents.length
        totalBytes += response.Contents.reduce((acc, item) => acc + (item.Size || 0), 0)
      }
      r2Status = "ONLINE"
    } catch (e) {
      console.error("R2 Telemetry Request Failed")
      r2Status = "DEGRADED"
    }
  }

  const mbUsed = (totalBytes / (1024 * 1024)).toFixed(2)
  const freeTierMB = 10000 // Cloudflare free tier is 10GB
  const percentUsed = Math.min(((parseFloat(mbUsed) / freeTierMB) * 100), 100).toFixed(2)

  return (
    <div className="max-w-7xl pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-neutral-200 pb-4 gap-4">
        <h1 className="text-3xl font-['Bebas_Neue'] tracking-wider text-[#09090B]">
          SYSTEM <span className="text-[#10B981]">TELEMETRY</span>
        </h1>
        <div className="flex items-center gap-2">
           <Activity className="w-4 h-4 text-[#10B981] animate-pulse" />
           <span className="font-['DM_Mono'] text-[10px] text-[#52525B] uppercase tracking-widest leading-none mt-1">Live Diagnostics</span>
        </div>
      </div>
      
      {/* Infrastructure Core */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Postgres Block */}
        <div className="bg-[#FFFFFF] border border-neutral-200 p-6 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute -right-8 -top-8 text-[#10B981]/5 group-hover:text-[#10B981]/10 transition-colors">
              <Database className="w-48 h-48" />
           </div>
           
           <div>
             <h3 className="font-['DM_Mono'] text-xs font-bold text-[#09090B] uppercase tracking-widest flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
               Neon Serverless Postgres
             </h3>
             <p className="text-[10px] uppercase font-['DM_Mono'] text-[#52525B] mt-2 mb-6">Database Pool Active</p>
           </div>
           
           <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-4 z-10 relative">
              <div>
                 <p className="text-3xl font-['Bebas_Neue'] text-[#09090B]">{productCount + materialCount}</p>
                 <p className="text-[9px] uppercase font-['DM_Mono'] tracking-widest text-[#52525B]">Total SKUs</p>
              </div>
              <div>
                 <p className="text-3xl font-['Bebas_Neue'] text-[#09090B]">{galleryCount + certCount}</p>
                 <p className="text-[9px] uppercase font-['DM_Mono'] tracking-widest text-[#52525B]">DB Vectors</p>
              </div>
              <div>
                 <p className="text-3xl font-['Bebas_Neue'] text-[#10B981]">{userCount}</p>
                 <p className="text-[9px] uppercase font-['DM_Mono'] tracking-widest text-[#52525B]">Operators</p>
              </div>
           </div>
        </div>

        {/* Edge Storage Block */}
        <div className="bg-[#09090B] border border-neutral-800 p-6 flex flex-col justify-between relative overflow-hidden group text-[#FAFAFA]">
           <div className="absolute -right-8 -top-8 text-[#FAFAFA]/5 group-hover:text-[#10B981]/10 transition-colors">
              <HardDrive className="w-48 h-48" />
           </div>
           
           <div>
             <h3 className="font-['DM_Mono'] text-xs font-bold uppercase tracking-widest flex items-center gap-3">
               <span className={`w-2 h-2 rounded-full ${r2Status === "ONLINE" ? "bg-[#10B981]" : "bg-rose-500"} animate-pulse`}></span>
               Cloudflare R2 Object Edge
             </h3>
             <p className="text-[10px] uppercase font-['DM_Mono'] text-neutral-400 mt-2 mb-6">Multi-Region Redundancy</p>
           </div>
           
           <div className="z-10 relative">
              <div className="flex justify-between items-end mb-2">
                 <div>
                    <p className="text-3xl font-['Bebas_Neue'] text-[#FAFAFA]">{mbUsed} <span className="text-xl">MB</span></p>
                    <p className="text-[9px] uppercase font-['DM_Mono'] tracking-widest text-neutral-400">Total Asset Consumption</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-['Bebas_Neue'] text-[#10B981]">{totalObjects}</p>
                    <p className="text-[9px] uppercase font-['DM_Mono'] tracking-widest text-neutral-400">R2 Objects</p>
                 </div>
              </div>

              <div className="w-full h-1 bg-neutral-800 mt-4 overflow-hidden">
                 <div className="h-full bg-[#10B981] transition-all" style={{ width: `${Math.max(parseFloat(percentUsed), 1)}%` }}></div>
              </div>
              <p className="text-[9px] font-['DM_Mono'] text-right mt-2 text-neutral-500 tracking-wider">System Quota: 10,000 MB ({percentUsed}% used)</p>
           </div>
        </div>
      </div>

      <div className="flex gap-2 items-center text-[#52525B] font-['DM_Mono'] text-[10px] uppercase tracking-widest">
         <Info className="w-4 h-4" /> Application layer operations running smoothly on Next.js 15 (Turbopack). Server-Side Rendering enabled.
      </div>
    </div>
  )
}
