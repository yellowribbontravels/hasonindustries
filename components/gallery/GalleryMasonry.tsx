"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function GalleryMasonry({ images }: { images: any[] }) {
  const [lightboxObj, setLightboxObj] = useState<any | null>(null)

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img) => (
          <div 
            key={img.id}
            onClick={() => setLightboxObj(img)}
            className="break-inside-avoid relative group cursor-pointer border border-neutral-200 bg-[#FFFFFF] p-2 hover:border-[#10B981] transition-colors overflow-hidden"
          >
            <div className="w-full aspect-[4/3] bg-[#FAFAFA] relative overflow-hidden flex items-center justify-center p-4">
               <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity bg-gradient-to-tr from-[#10B981] to-transparent pointer-events-none" />
               <p className="text-[#52525B] text-[10px] font-['DM_Mono'] break-all text-center group-hover:text-[#09090B] transition-colors">{img.key}</p>
            </div>
            
            {img.caption && (
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-['DM_Mono'] text-[10px] text-[#09090B] uppercase tracking-widest leading-relaxed truncate">{img.caption}</p>
              </div>
            )}
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full py-24 border border-neutral-200 text-center font-['DM_Mono'] text-sm tracking-widest text-[#52525B] uppercase bg-[#FFFFFF]">
             Gallery Archive Missing visual assets.
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxObj && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[#FAFAFA]/95 backdrop-blur-md flex items-center justify-center p-6 md:p-12 cursor-zoom-out"
            onClick={() => setLightboxObj(null)}
          >
            <button className="absolute top-6 right-6 md:top-10 md:right-10 text-[#52525B] hover:text-[#10B981] font-['DM_Mono'] text-xs tracking-widest uppercase transition-colors p-4 z-10 cursor-pointer">
              [Close X]
            </button>
            <div className="max-w-6xl w-full flex flex-col items-center cursor-default" onClick={e => e.stopPropagation()}>
              <div className="w-full aspect-video bg-[#FFFFFF] border border-neutral-200 flex flex-col items-center justify-center p-8 relative shadow-[0_0_80px_rgba(232,160,32,0.05)]">
                 <p className="font-['DM_Mono'] text-xs md:text-sm text-[#52525B] break-all border border-neutral-200 p-4 bg-[#FAFAFA] select-all">{lightboxObj.key}</p>
                 <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 to-transparent pointer-events-none" />
              </div>
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between w-full border-t border-neutral-200 pt-6 px-2">
                <p className="font-['DM_Mono'] text-xs md:text-sm text-[#09090B] tracking-widest uppercase">
                  {lightboxObj.caption || "Asset Uncaptioned"}
                </p>
                <p className="font-['DM_Mono'] text-[10px] text-[#52525B] mt-4 md:mt-0 tracking-widest uppercase">
                   Index: {lightboxObj.order}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
