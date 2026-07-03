'use client'

import Link from "next/link";

type Props = {
    tx: (key: string) => string;
};

export default function GlobalAccessMechanism({ tx }: Props) {
    return (
        <section className="py-28 px-6 bg-white border-t border-slate-100">

            <div className="max-w-6xl mx-auto">

                <div className="flex justify-center mb-6">
  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
    [ ! ] GLOBAL INITIATIVE
  </span>
</div>

                {/* TITLE */}
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] uppercase text-center mb-8">
                    {tx('scholarshipHeadline')}
                </h2>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

                    {/* UNDerdog */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 hover:border-blue-600/40 transition-all">

                        <h3 className="text-xl font-black uppercase mb-4 text-blue-600">
                            The Underdog
                        </h3>

                        <p className="text-slate-600 leading-7 text-sm">
                            {tx('scholarshipPath1')}
                        </p>

                    </div>

                    {/* ENDANGERED */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 hover:border-orange-400/60 transition-all">

                        <h3 className="text-xl font-black uppercase mb-4 text-orange-500">
                            Endangered Territories
                        </h3>

                        <p className="text-slate-600 leading-7 text-sm">
                            {tx('scholarshipPath2')}
                        </p>

                    </div>

                </div>

                {/* PROMISE */}
                <div className="mt-14 max-w-3xl mx-auto text-center">

                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-4">
                        The Promise
                    </p>

                    <p className="text-slate-700 leading-8">
                        {tx('scholarshipPromise')}
                    </p>

                </div>

                {/* CTA */}
                <div className="mt-12 flex justify-center">

                    <Link
                        href="#apply"
                        className="inline-flex items-center rounded-full border-2 border-slate-900 px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all hover:scale-[1.03]"
                    >
                        {tx('scholarshipCTA')}
                    </Link>

                </div>

            </div>

        </section>
    )
}