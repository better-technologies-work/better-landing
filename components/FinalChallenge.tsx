'use client'

import Image from "next/image";
import Link from "next/link";

type Props = {
    tx: (key: string) => string;
};

export default function FinalChallenge({ tx }: Props) {
    return (
        <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">

            <div className="max-w-6xl mx-auto">

                <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-2xl">

                    {/* Ambient Light */}
                    <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
                    <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
                    <div className="relative grid lg:grid-cols-[320px_1fr] items-center">

                        {/* Diego */}
                        <div className="flex flex-col items-center text-center">

                            {/* FOTO */}
                            <div className="relative">
                                <Image
                                    src="/diego.jpeg"
                                    alt="Diego Vargas"
                                    width={120}
                                    height={120}
                                    className="rounded-full object-cover border-4 border-white shadow-lg"
                                />

                                {/* glow sutil opcional */}
                                <div className="absolute -inset-2 rounded-full bg-blue-400/10 blur-xl -z-10" />
                            </div>

                            {/* NOMBRE */}
                            <h3 className="mt-6 text-xl font-black uppercase text-slate-900 tracking-tight">
                                Diego Vargas
                            </h3>

                            {/* CARGO */}
                            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.28em] text-blue-600 max-w-[240px] leading-relaxed">
                                Chief Business Engineering Operator
                            </p>

                            {/* LINKEDIN CTA */}
                            <a
                                href="https://www.linkedin.com/in/diegoe-vargas/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-blue-600 transition-all hover:scale-[1.03]"
                            >
                                LinkedIn
                            </a>

                        </div>



                        {/* Content */}
                        <div className="flex flex-col justify-center p-10 md:p-16">

                            <p className="text-[10px] uppercase tracking-[0.35em] font-black text-slate-400 mb-5">
                                {tx('finalChallenge')}
                            </p>

                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] uppercase text-slate-900">
                                {tx('challengeHeadline')}
                            </h2>
                            <div className="w-28 h-1 rounded-full bg-gradient-to-r from-blue-600 to-orange-400 mt-6" />
                            <p className="mt-8 text-lg leading-8 text-slate-600 max-w-3xl">
                                {tx('challengeCopy')}
                            </p>

                            <div className="mt-12">

                                <Link
                                    href="#leadership-leagues"
                                    className="inline-flex items-center rounded-full bg-blue-600 px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-white transition-all hover:bg-orange-500 hover:scale-[1.03]"
                                >
                                    {tx('challengeCTA')}
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}