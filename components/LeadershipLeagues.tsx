'use client'

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"

type Props = {
    tx: (key: string) => string
}

export default function LeadershipLeagues({ tx }: Props) {

    const [selected, setSelected] = useState(1) // Nivel 2 abierto por default

    const leagues = [
        {
            title: "The Emerging Pack (Startups & Local Heroes)",
            color: "blue",
            copy: "You have a disruptive vision, a story worth telling, and the hunger to change your industry. You need the technological foundation and AI discoverability to look and act like a global leader from day one.",
            cta: "Claim Your AI Awakening (15-Min Assessment)",
        },
        {
            title: "The Lone Wolf (Established SMEs)",
            color: "blue",
            copy: "You have traction, revenue, and a solid team, but you want to dominate the entire category. This is where we plug in our Growth Systems to turn your momentum into absolute leadership, business visibility, growth, and results. We will expose where you are losing clients and map the Growth System needed to lead. (And if your current digital footprint is outdated, your new Digital identity is on us).",
            ctaPrimary: "Take the Alpha Fast-Track ($100)",
            ctaSecondary: "Or assess your Digital Relevance (5-Min) →",
        },
        {
            title: "The Whales (Enterprise)",
            color: "blue",
            copy: "You have the size; we bring the speed. We help massive organizations break operational bottlenecks, integrate AI, and execute with the agility of a startup. No credit cards required here. Send your project lead and let's map your custom architecture.",
            cta: "Assess my Digital Relevance and contact Enterprise Team (5-Min) →",
        }
    ]

    const current = leagues[selected]

    return (
        <section className="py-24 px-6 bg-white border-t border-slate-100">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-14">

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
                                        <Link
                                            href="#"
                                            className="inline-flex justify-center rounded-full bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition"
                                        >
                                            {current.ctaPrimary}
                                        </Link>

                                        <Link
                                            href="#"
                                            className="text-center text-blue-600 text-xs font-black uppercase tracking-widest hover:underline"
                                        >
                                            {current.ctaSecondary}
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="#"
                                        className="inline-flex justify-center rounded-full bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition"
                                    >
                                        {current.cta}
                                    </Link>
                                )}

                            </div>

                        </motion.div>

                    </AnimatePresence>

                </div>

            </div>

        </section>
    )
}