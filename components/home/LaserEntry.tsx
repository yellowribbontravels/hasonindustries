"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

const BRAND = "HASON INDUSTRIES"
const LETTER_STAGGER = 0.12 // seconds between each letter
const CARVE_DURATION = BRAND.length * LETTER_STAGGER + 0.6 // total carving phase

function LaserLetter({ char, index, isCarving }: { char: string; index: number; isCarving: boolean }) {
    if (char === " ") {
        return <span className="inline-block w-[0.3em]" />
    }

    const delay = index * LETTER_STAGGER

    return (
        <span className="relative inline-block">
            {/* Ghost outline — always visible */}
            <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px rgba(250,250,250,0.15)" }}
            >
                {char}
            </span>

            {/* Carved glowing letter — fades in per letter */}
            <motion.span
                className="absolute inset-0 text-[#10B981]"
                style={{
                    textShadow: "0 0 8px rgba(16,185,129,0.8), 0 0 20px rgba(16,185,129,0.4)",
                }}
                initial={{ opacity: 0, scale: 1.3 }}
                animate={isCarving ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.3 }}
                transition={{ duration: 0.4, delay, ease: "easeOut" }}
            >
                {char}
            </motion.span>

            {/* Spark flash per letter — a brief bright pop */}
            <motion.span
                className="absolute inset-0 text-white pointer-events-none"
                style={{
                    textShadow: "0 0 30px #fff, 0 0 60px #10B981",
                }}
                initial={{ opacity: 0 }}
                animate={isCarving ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={{ duration: 0.3, delay, ease: "easeOut" }}
            >
                {char}
            </motion.span>
        </span>
    )
}

export function LaserEntry({ children }: { children: React.ReactNode }) {
    const [stage, setStage] = useState<"holding" | "carving" | "flash" | "done">("holding")
    const [isMounted, setIsMounted] = useState(false)

    const flashDelay = useMemo(() => 300 + CARVE_DURATION * 1000, [])

    useEffect(() => {
        setIsMounted(true)

        const timerStart = setTimeout(() => setStage("carving"), 300)
        const timerFlash = setTimeout(() => setStage("flash"), flashDelay)
        const timerDone = setTimeout(() => setStage("done"), flashDelay + 700)

        return () => {
            clearTimeout(timerStart)
            clearTimeout(timerFlash)
            clearTimeout(timerDone)
        }
    }, [flashDelay])

    if (!isMounted) {
        return (
            <div className="fixed inset-0 z-[99999] bg-[#09090B] overflow-hidden">
                <div className="hidden">{children}</div>
            </div>
        )
    }

    return (
        <>
            <AnimatePresence>
                {stage !== "done" && (
                    <motion.div
                        className="fixed inset-0 z-[99999] bg-[#09090B] flex items-center justify-center overflow-hidden"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {/* Title: per-letter laser carving */}
                        <div className="font-['Bebas_Neue'] tracking-[0.15em] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[110px] select-none flex flex-wrap items-center justify-center px-4">
                            {BRAND.split("").map((char, i) => (
                                <LaserLetter
                                    key={i}
                                    char={char}
                                    index={i}
                                    isCarving={stage === "carving" || stage === "flash"}
                                />
                            ))}
                        </div>

                        {/* Clean white flash when carving completes */}
                        <AnimatePresence>
                            {stage === "flash" && (
                                <motion.div
                                    className="absolute inset-0 bg-white z-[9999]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.95 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actual homepage content */}
            <motion.div
                initial={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                animate={{
                    opacity: stage === "done" || stage === "flash" ? 1 : 0,
                    scale: stage === "done" || stage === "flash" ? 1 : 1.02,
                    filter: stage === "done" || stage === "flash" ? "blur(0px)" : "blur(10px)"
                }}
                transition={{ duration: 1, ease: "easeOut", delay: stage === "flash" ? 0.3 : 0 }}
            >
                {children}
            </motion.div>
        </>
    )
}
