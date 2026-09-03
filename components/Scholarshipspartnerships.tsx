'use client'

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Handshake } from "lucide-react";

type Props = {
    tx: (key: string) => string;
};

export default function ScholarshipsPartnerships({ tx }: Props) {
    const [selected, setSelected] = useState(0); // 0 = Scholarships (orange), 1 = Partnerships (blue)
    const [openQuestion, setOpenQuestion] = useState<number | null>(0);

    const tracks = [
        {
            color: "orange",
            icon: Heart,
            pill: tx("scholarshipsPillLabel"),
            title: tx("scholarshipsTitle"),
            intro: tx("scholarshipsIntro"),
            cta: tx("scholarshipsCta"),
            ctaHref: "https://wa.me/593991358652?text=" + encodeURIComponent(tx("scholarshipsWhatsappMessage")),
            faq: [
                { q: tx("scholarshipQ1"), a: tx("scholarshipA1") },
                { q: tx("scholarshipQ2"), a: tx("scholarshipA2") },
                { q: tx("scholarshipQ3"), a: tx("scholarshipA3") },
                { q: tx("scholarshipQ4"), a: tx("scholarshipA4") },
                { q: tx("scholarshipQ5"), a: tx("scholarshipA5") },
            ],
        },
        {
            color: "blue",
            icon: Handshake,
            pill: tx("partnershipsPillLabel"),
            title: tx("partnershipsTitle"),
            intro: tx("partnershipsIntro"),
            cta: tx("partnershipsCta"),
            ctaHref: "https://wa.me/593991358652?text=" + encodeURIComponent(tx("partnershipsWhatsappMessage")),
            faq: [
                { q: tx("partnershipQ1"), a: tx("partnershipA1") },
                { q: tx("partnershipQ2"), a: tx("partnershipA2") },
                { q: tx("partnershipQ3"), a: tx("partnershipA3") },
                { q: tx("partnershipQ4"), a: tx("partnershipA4") },
                { q: tx("partnershipQ5"), a: tx("partnershipA5") },
                { q: tx("partnershipQ6"), a: tx("partnershipA6") },
            ],
        },
    ];

    const current = tracks[selected];
    const isOrange = current.color === "orange";
    const Icon = current.icon;

    const handleSelectTrack = (index: number) => {
        setSelected(index);
        setOpenQuestion(0);
    };

    return (
        <section className="py-28 px-6 bg-white border-t border-slate-100">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-14">

                    <p className="text-[10px] uppercase tracking-[0.35em] font-black text-slate-400 mb-4">
                        {tx("scholarshipsPartnershipsEyebrow")}
                    </p>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900"
                    >
                        <span className="text-orange-500">{tx("scholarshipsPartnershipsTitlePart1")}</span>{" "}
                        <span className="text-slate-900">&</span>{" "}
                        <span className="text-blue-600">{tx("scholarshipsPartnershipsTitlePart2")}</span>
                    </motion.h2>

                    <p className="mt-6 text-slate-600 text-lg leading-8">
                        {tx("scholarshipsPartnershipsSubtitle")}
                    </p>

                    <p className="mt-8 max-w-3xl mx-auto text-slate-600 text-base leading-7">
                        {tx("scholarshipsPartnershipsIntro")}
                    </p>

                </div>

                {/* TRACK PILLS */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">

                    {tracks.map((track, index) => (
                        <motion.button
                            key={index}
                            onClick={() => handleSelectTrack(index)}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border transition-colors ${selected === index
                                ? track.color === "blue"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-orange-500 text-white border-orange-500"
                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
                                }`}
                        >
                            {track.pill}
                        </motion.button>
                    ))}

                </div>

                {/* TRACK CONTENT */}
                <div className="max-w-4xl mx-auto">

                    <AnimatePresence mode="wait">

                        <motion.div
                            key={selected}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                        >

                            {/* INTRO CARD */}
                            <div
                                className={`rounded-3xl border p-8 mb-8 transition-colors ${isOrange
                                    ? "border-orange-500 bg-orange-50"
                                    : "border-blue-600 bg-blue-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <motion.div
                                        key={selected}
                                        initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isOrange ? "bg-orange-500" : "bg-blue-600"
                                            }`}
                                    >
                                        <Icon size={18} className="text-white" />
                                    </motion.div>

                                    <h3
                                        className={`text-xl font-black uppercase ${isOrange ? "text-orange-500" : "text-blue-600"
                                            }`}
                                    >
                                        {current.title}
                                    </h3>
                                </div>

                                <p className="text-sm text-slate-600 mt-4 leading-7">
                                    {current.intro}
                                </p>
                            </div>

                            {/* FAQ ACCORDION */}
                            <div className="space-y-3">

                                {current.faq.map((item, i) => {
                                    const isOpen = openQuestion === i;

                                    return (
                                        <div
                                            key={i}
                                            className={`rounded-2xl border overflow-hidden transition-colors ${isOpen
                                                ? isOrange
                                                    ? "border-orange-300"
                                                    : "border-blue-300"
                                                : "border-slate-200"
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpenQuestion(isOpen ? null : i)}
                                                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="text-sm font-black text-slate-900">
                                                    {item.q}
                                                </span>

                                                <motion.span
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`shrink-0 ${isOpen ? (isOrange ? "text-orange-500" : "text-blue-600") : "text-slate-400"
                                                        }`}
                                                >
                                                    <ChevronDown size={18} />
                                                </motion.span>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="px-6 pb-5 text-sm text-slate-600 leading-7">
                                                            {item.a}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}

                            </div>

                            {/* CTA */}
                            <div className="mt-10 flex justify-center">
                                <motion.a
                                    href={current.ctaHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    className={`inline-flex justify-center rounded-full px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-colors ${isOrange
                                        ? "bg-orange-500 hover:bg-orange-600"
                                        : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                >
                                    {current.cta}
                                </motion.a>
                            </div>

                        </motion.div>

                    </AnimatePresence>

                </div>

            </div>
        </section>
    )
}