'use client'

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"

type Props = {
    tx: (key: string) => string
}

export default function LeadershipLeagues({ tx }: Props) {

    const [selected, setSelected] = useState(1) // Nivel 2 abierto por default

    // ── Alpha Fast-Track modal state ──────────────────────────
    const [isAlphaOpen, setIsAlphaOpen] = useState(false)
    const [alphaScreen, setAlphaScreen] = useState<1 | 2 | 3>(1)

    const CALENDAR_URL = "https://calendar.app.google/74Sc4peRwuJ3eJ8W7"
    // TODO: reemplazar cuando tengan el Payment Link de Stripe
    const STRIPE_URL = "STRIPE_PAYMENT_LINK"

    const closeAlphaModal = () => {
        setIsAlphaOpen(false)
        setTimeout(() => setAlphaScreen(1), 300)
    }

    const leagues = [
        {
            title: tx("leagueEmergingTitle"),
            copy: tx("leagueEmergingCopy"),
            cta: tx("leagueEmergingCta"),
        },
        {
            title: tx("leagueLoneWolfTitle"),
            copy: tx("leagueLoneWolfCopy"),
            ctaPrimary: tx("alphaCtaMain"),
            ctaSecondary: tx("alphaCtaAssess"),
        },
        {
            title: tx("leagueWhalesTitle"),
            copy: tx("leagueWhalesCopy"),
            cta: tx("leagueWhalesCta"),
        }
    ]

    const current = leagues[selected]

    return (
        <section className="py-24 px-6 bg-white border-t border-slate-100">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-14">

                    <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-2">
                        {tx("solutionsLabel")}
                    </p>
                    <p className="text-slate-500 text-sm md:text-base font-medium mb-8">
                        {tx("solutionsIntro")}
                    </p>

                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                        <span className="text-blue-600">
                            {tx("leadershipMain")}
                        </span>{" "}
                        <span className="text-slate-900">
                            {tx("leadershipRest")}
                        </span>
                    </h2>

                    <p className="text-lg text-slate-500 font-medium max-w-3xl mx-auto">
                        {tx("leadershipSubtitle")}
                    </p>

                    <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mt-8 mb-4 leading-relaxed">
                        {tx("solutionsModelIntro")}
                    </p>
                    <ul className="flex flex-col items-center gap-1.5 mb-8">
                        <li className="text-slate-900 font-black text-sm">{tx("solutionsFormulaQuantos")}</li>
                        <li className="text-slate-900 font-black text-sm">{tx("solutionsFormulaHacks")}</li>
                        <li className="text-slate-900 font-black text-sm">{tx("solutionsFormulaPowerUnits")}</li>
                        <li className="text-slate-900 font-black text-sm">{tx("solutionsFormulaSovereignNode")}</li>
                    </ul>

                    <p className="text-blue-600 font-black uppercase tracking-widest text-xs mt-6">
                        {tx("chooseLeague")}
                    </p>

                </div>

                {/* PILLS */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">

                    {leagues.map((l, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(i)}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border transition-all ${selected === i
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white border-slate-200 text-slate-500 hover:border-blue-300"
                                }`}
                        >
                            {l.title.split("(")[0]}
                        </button>
                    ))}

                </div>

                {/* CARD */}
                <div className="max-w-4xl mx-auto">

                    <AnimatePresence mode="wait">

                        <motion.div
                            key={selected}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
                        >

                            <h3 className="text-2xl font-black uppercase text-slate-900 mb-4">
                                {current.title}
                            </h3>

                            <p className="text-slate-600 leading-8 text-base">
                                {current.copy}
                            </p>

                            {/* CTA LOGIC */}
                            <div className="mt-10 flex flex-col gap-4">

                                {selected === 1 ? (
                                    <>
                                        <button
                                            onClick={() => setIsAlphaOpen(true)}
                                            className="inline-flex justify-center rounded-full bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition"
                                        >
                                            {current.ctaPrimary}
                                        </button>


                                        <a href="https://alpha.better-technologies.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-center text-blue-600 text-xs font-black uppercase tracking-widest hover:underline"
                                        >
                                            {current.ctaSecondary}
                                        </a>
                                    </>
                                ) : selected === 0 ? (

                                    <a href="https://calendar.app.google/Ntnv2PvHmPNgCnKZ6"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex justify-center rounded-full bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition"
                                    >
                                        {current.cta}
                                    </a>
                                ) : (

                                    <a href="https://alpha.better-technologies.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex justify-center rounded-full bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition"
                                    >
                                        {current.cta}
                                    </a>
                                )}

                            </div>

                        </motion.div>

                    </AnimatePresence>

                </div>

            </div>

            {/* ── ALPHA FAST-TRACK MODAL ────────────────────────── */}
            <AnimatePresence>
                {isAlphaOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAlphaModal}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 md:p-10 max-w-xl w-full max-h-[85vh] overflow-y-auto relative"
                        >
                            <button
                                onClick={closeAlphaModal}
                                className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors text-2xl leading-none z-10"
                                aria-label={tx('closeButton')}
                            >
                                ×
                            </button>

                            {alphaScreen === 1 && (
                                <>
                                    <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                        {tx('alphaBadge')}
                                    </p>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                                        {tx('alphaTitle')}
                                    </h3>
                                    <p className="text-orange-500 font-bold italic mb-6">
                                        {tx('alphaSubheadline')}
                                    </p>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        {tx('alphaIntro')}
                                    </p>
                                    <div className="border-l-4 border-orange-400 bg-orange-50 rounded-r-xl p-4 mb-8">
                                        <p className="text-slate-700 text-sm font-medium">
                                            ⚠️ {tx('alphaDisclaimer')}
                                        </p>
                                    </div>

                                    <h4 className="text-xl font-black text-slate-900 mb-4">
                                        {tx('alphaScreen1Title')}
                                    </h4>


                                    <a href={CALENDAR_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setAlphaScreen(2)}
                                        className="w-full flex justify-center bg-blue-600 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-colors"
                                    >
                                        {tx('alphaCtaCalendar')}
                                    </a>
                                </>
                            )}

                            {alphaScreen === 2 && (
                                <>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6 leading-snug">
                                        {tx('alphaScreen2Title')}
                                    </h3>


                                    <a href={STRIPE_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setAlphaScreen(3)}
                                        className="w-full flex justify-center bg-orange-500 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors"
                                    >
                                        {tx('alphaCtaStripe')}
                                    </a>
                                    <button
                                        onClick={() => setAlphaScreen(1)}
                                        className="block mx-auto mt-6 text-slate-400 hover:text-blue-600 text-[10px] uppercase font-black tracking-widest transition-colors"
                                    >
                                        {tx('goBackModal')}
                                    </button>
                                </>
                            )}

                            {alphaScreen === 3 && (
                                <>
                                    <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-line">
                                        {tx('alphaScreen3Body')}
                                    </p>
                                    <p className="text-slate-900 font-black text-sm mb-8">
                                        {tx('alphaScreen3Signature')}
                                    </p>
                                    <button
                                        onClick={closeAlphaModal}
                                        className="w-full bg-slate-900 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors"
                                    >
                                        {tx('closeButton')}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    )
}