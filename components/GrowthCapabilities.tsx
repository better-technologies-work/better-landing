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
        <section className="py-28 px-6 bg-white border-t border-slate-100">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-14">

                    <p className="text-[10px] uppercase tracking-[0.35em] font-black text-slate-400 mb-4">
                        {tx('growthCapabilities')}
                    </p>

                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900">
                        {tx('customArsenal')}
                    </h2>

                    <p className="mt-8 max-w-3xl mx-auto text-slate-600 text-lg leading-8">
                        {tx('growthIntro')}

                    </p>

                </div>

                {/* LEVEL LABELS (like TEAM pills) */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">

                    {deployments.map((item, index) => (

                        <button
                            key={index}
                            onClick={() => setSelected(index)}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${selected === index
                                ? item.color === "blue"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-orange-500 text-white border-orange-500"
                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
                                }`}
                        >
                            {item.title}
                        </button>

                    ))}

                </div>

                {/* CARD */}
                <div className="max-w-4xl mx-auto">

                    <AnimatePresence mode="wait">

                        <motion.div
                            key={selected}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            className={`rounded-3xl border p-8 transition-all ${current.color === "blue"
                                ? "border-blue-600 bg-blue-50"
                                : "border-orange-500 bg-orange-50"
                                }`}
                        >

                            <h3
                                className={`text-xl font-black uppercase ${current.color === "blue"
                                    ? "text-blue-600"
                                    : "text-orange-500"
                                    }`}
                            >
                                {current.title}
                            </h3>

                            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-2">
                                {current.subtitle}
                            </p>

                            <p className="text-sm text-slate-600 mt-6 leading-7">
                                {current.pain}
                            </p>

                            <div className="mt-8 space-y-6 text-sm text-slate-600 leading-7">

                                <div>
                                    <p className="font-black text-slate-900 mb-3">
                                        {current.includedTitle}
                                    </p>
                                    <div className="whitespace-pre-line text-slate-600">
                                        {current.included}
                                    </div>
                                </div>

                                <div>
                                    <p className="font-black text-slate-900 mb-4">
                                        {current.systemTitle}
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-black text-slate-900">
                                                Your Quantos
                                            </p>
                                            <p className="text-slate-600">
                                                {current.quantos}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-black text-slate-900">
                                                Your Hack
                                            </p>
                                            <p className="text-slate-600">
                                                {current.hack}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-black text-slate-900">
                                                Your Power Units
                                            </p>
                                            <p className="text-slate-600">
                                                {current.powerUnits}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-black text-slate-900">
                                                Your Sovereign Node
                                            </p>
                                            <p className="text-slate-600">
                                                {current.sovereignNode}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <p className="font-black text-slate-900">
                                        {tx("investment")}: {current.investment}
                                    </p>

                                    <p
                                        className={`font-black mt-2 ${current.color === "blue"
                                            ? "text-blue-600"
                                            : "text-orange-500"
                                            }`}
                                    >
                                        {tx("scholarship")}: {current.scholarship}
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        className={`px-6 py-3 rounded-full text-white text-sm font-black uppercase tracking-wider transition-all hover:scale-105 ${
                                            current.color === "blue"
                                                ? "bg-blue-600 hover:bg-blue-700"
                                                : "bg-orange-500 hover:bg-orange-600"
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