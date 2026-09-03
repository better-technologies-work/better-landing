'use client'

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    tx: (key: string) => string;
};

export default function GrowthCapabilities({ tx }: Props) {
    const [selected, setSelected] = useState(0);
    const deployments = [
        {
            color: "blue",
            title: tx("foundationTitle"),
            subtitle: tx("foundationSubtitle"),
            pain: tx("foundationPain"),
            includedTitle: tx("foundationIncludedTitle"),
            included: tx("foundationIncluded"),
            systemTitle: tx("foundationSystemTitle"),
            quantos: tx("foundationQuantos"),
            hack: tx("foundationHack"),
            powerUnits: tx("foundationPowerUnits"),
            sovereignNode: tx("foundationSovereignNode"),
            investment: tx("foundationInvestment"),
            scholarship: tx("foundationScholarship"),
            cta: tx("foundationCta"),
        },
        {
            color: "orange",
            title: tx("relevanceTitle"),
            subtitle: tx("relevanceSubtitle"),
            pain: tx("relevancePain"),
            includedTitle: tx("relevanceIncludedTitle"),
            included: tx("relevanceIncluded"),
            systemTitle: tx("relevanceSystemTitle"),
            quantos: tx("relevanceQuantos"),
            hack: tx("relevanceHack"),
            powerUnits: tx("relevancePowerUnits"),
            sovereignNode: tx("relevanceSovereignNode"),
            investment: tx("relevanceInvestment"),
            scholarship: tx("relevanceScholarship"),
            cta: tx("relevanceCta"),
        },
        {
            color: "orange",
            title: tx("dominanceTitle"),
            subtitle: tx("dominanceSubtitle"),
            pain: tx("dominancePain"),
            includedTitle: tx("dominanceIncludedTitle"),
            included: tx("dominanceIncluded"),
            systemTitle: tx("dominanceSystemTitle"),
            quantos: tx("dominanceQuantos"),
            hack: tx("dominanceHack"),
            powerUnits: tx("dominancePowerUnits"),
            sovereignNode: tx("dominanceSovereignNode"),
            investment: tx("dominanceInvestment"),
            scholarship: tx("dominanceScholarship"),
            cta: tx("dominanceCta"),
        },
    ];

    const current = deployments[selected];

    return (
        <section className="py-24 px-6 bg-white border-t border-slate-100 relative overflow-hidden">
            {/* Glows ambientales sutiles de fondo */}
            <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* HEADER */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <p className="text-[10px] uppercase tracking-[0.35em] font-black text-blue-600 mb-4">
                        {tx('growthCapabilities')}
                    </p>

                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-[0.95]">
                        {tx('customArsenal')}
                    </h2>

                    <p className="mt-8 max-w-3xl mx-auto text-slate-600 text-lg leading-8 font-medium text-balance">
                        {tx('growthIntro')}
                    </p>
                </motion.div>

                {/* LEVEL LABELS (Pills interactivas) */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {deployments.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSelected(index)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border transition-all duration-300 shadow-sm active:scale-95 ${selected === index
                                ? item.color === "blue"
                                    ? "bg-blue-600 text-white border-blue-600 shadow-blue-600/20 shadow-md"
                                    : "bg-orange-500 text-white border-orange-500 shadow-orange-500/20 shadow-md"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white"
                                }`}
                        >
                            {item.title}
                        </button>
                    ))}
                </motion.div>

                {/* CARD PRINCIPAL REDISEÑADA */}
                <div className="w-full max-w-full lg:max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected}
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`rounded-3xl border p-8 md:p-12 shadow-xl transition-all duration-300 relative overflow-hidden ${current.color === "blue"
                                ? "border-blue-200 bg-gradient-to-b from-blue-50/70 via-white to-blue-50/30"
                                : "border-orange-200 bg-gradient-to-b from-orange-50/70 via-white to-orange-50/30"
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-6 mb-6">
                                <div>
                                    <h3
                                        className={`text-2xl font-black uppercase tracking-tight ${current.color === "blue"
                                            ? "text-blue-600"
                                            : "text-orange-500"
                                            }`}
                                    >
                                        {current.title}
                                    </h3>

                                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mt-1">
                                        {current.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Bloque del dolor con Emoji monocromático */}
                            <div className="bg-white/80 border border-slate-100 p-5 rounded-2xl shadow-sm mb-8 flex items-start gap-3">
                                <span className="text-slate-400 text-base leading-none select-none mt-0.5">⚡</span>
                                <p className="text-base text-slate-700 leading-relaxed font-medium">
                                    {current.pain}
                                </p>
                            </div>

                            <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

                                <div className="bg-white/60 p-6 rounded-2xl border border-slate-100">
                                    <p className="font-black text-slate-900 text-base mb-3 uppercase tracking-tight flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${current.color === "blue" ? "bg-blue-600" : "bg-orange-500"}`} />
                                        {current.includedTitle}
                                    </p>
                                    <div className="whitespace-pre-line text-slate-600 font-medium">
                                        {current.included}
                                    </div>
                                </div>

                                <div className="bg-white/60 p-6 rounded-2xl border border-slate-100">
                                    <p className="font-black text-slate-900 text-base mb-5 uppercase tracking-tight flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${current.color === "blue" ? "bg-blue-600" : "bg-orange-500"}`} />
                                        {current.systemTitle}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                            <p className="font-black text-slate-900 text-xs uppercase tracking-wider mb-1 text-blue-600 flex items-center gap-1.5">
                                                <span className="grayscale opacity-60 text-[11px]">🎯</span>
                                                Your Quantos
                                            </p>
                                            <p className="text-slate-600 text-xs font-medium leading-relaxed">
                                                {current.quantos}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                            <p className="font-black text-slate-900 text-xs uppercase tracking-wider mb-1 text-orange-500 flex items-center gap-1.5">
                                                <span className="grayscale opacity-60 text-[11px]">🎯</span>
                                                Your Hack
                                            </p>
                                            <p className="text-slate-600 text-xs font-medium leading-relaxed">
                                                {current.hack}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                            <p className="font-black text-slate-900 text-xs uppercase tracking-wider mb-1 text-blue-600 flex items-center gap-1.5">
                                                <span className="grayscale opacity-60 text-[11px]">🎯</span>
                                                Your Power Units
                                            </p>
                                            <p className="text-slate-600 text-xs font-medium leading-relaxed">
                                                {current.powerUnits}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                            <p className="font-black text-slate-900 text-xs uppercase tracking-wider mb-1 text-orange-500 flex items-center gap-1.5">
                                                <span className="grayscale opacity-60 text-[11px]">🎯</span>
                                                Your Sovereign Node
                                            </p>
                                            <p className="text-slate-600 text-xs font-medium leading-relaxed">
                                                {current.sovereignNode}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="font-black text-slate-900 text-base">
                                            {tx("investment")}: <span className="text-slate-700 font-bold">{current.investment}</span>
                                        </p>

                                        <p
                                            className={`font-black text-sm mt-1 ${current.color === "blue"
                                                ? "text-blue-600"
                                                : "text-orange-500"
                                                }`}
                                        >
                                            {tx("scholarship")}: {current.scholarship}
                                        </p>
                                    </div>

                                    <button
                                        className={`px-8 py-4 rounded-full text-white text-xs font-black uppercase tracking-widest transition-all duration-300 hover:shadow-lg active:scale-95 ${
                                            current.color === "blue"
                                                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
                                                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25"
                                        }`}
                                    >
                                        {current.cta}
                                    </button>
                                </div>

                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}