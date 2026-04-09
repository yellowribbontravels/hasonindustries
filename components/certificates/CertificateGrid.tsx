"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const R2_BASE = "https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev"

export function CertificateGrid({ certs }: { certs: any[] }) {
    const [lightboxObj, setLightboxObj] = useState<any | null>(null)

    if (certs.length === 0) {
        return (
            <div className="text-center py-16 md:py-20 bg-[#FFFFFF] border border-neutral-200">
                <p className="font-['DM_Mono'] text-[10px] md:text-xs uppercase tracking-widest text-[#52525B]">No compliance certificates publicly active.</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {certs.map(cert => (
                    <div key={cert.id} onClick={() => setLightboxObj(cert)} className="cursor-pointer bg-[#FFFFFF] border border-neutral-200 p-6 md:p-8 hover:border-[#10B981] transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>

                        <h3 className="text-lg md:text-xl font-bold font-['DM_Mono'] text-[#09090B] uppercase tracking-wide mb-4 md:mb-6 group-hover:text-[#10B981] transition-colors">
                            {cert.title}
                        </h3>

                        <div className="relative aspect-[3/4] w-full border border-neutral-100 bg-neutral-50 p-2 shadow-sm">
                            <img
                                src={`${R2_BASE}/${cert.imageKey}`}
                                alt={cert.title}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="absolute bottom-4 right-4 bg-[#09090B] text-[#FAFAFA] font-['DM_Mono'] text-[9px] uppercase tracking-widest px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Expand Visual
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {lightboxObj && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-[#FAFAFA]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setLightboxObj(null)}
                    >
                        <button className="absolute top-4 right-4 md:top-10 md:right-10 text-[#52525B] hover:text-[#10B981] font-['DM_Mono'] text-[10px] md:text-xs tracking-widest uppercase transition-colors p-4 z-10 cursor-pointer">
                            [Close X]
                        </button>
                        <div className="max-w-4xl w-full h-[85vh] flex flex-col items-center cursor-default" onClick={e => e.stopPropagation()}>
                            <div className="w-full h-[calc(100%-80px)] bg-[#FFFFFF] border border-neutral-200 flex flex-col items-center justify-center relative shadow-[0_0_80px_rgba(16,185,129,0.05)] overflow-hidden p-2 md:p-4">
                                <img
                                    src={`${R2_BASE}/${lightboxObj.imageKey}`}
                                    alt={lightboxObj.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="mt-4 flex flex-col md:flex-row items-center justify-between w-full border-t border-neutral-200 pt-4 px-2">
                                <p className="font-['DM_Mono'] text-xs md:text-sm text-[#09090B] tracking-widest uppercase font-bold">
                                    {lightboxObj.title}
                                </p>
                                <p className="font-['DM_Mono'] text-[10px] text-[#52525B] mt-2 md:mt-0 tracking-widest uppercase">
                                    Compliance Document
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
