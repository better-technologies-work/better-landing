'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { ui, type Locale } from '../app/[locale]/page';
const AlphaFastTrackSection = () => {
    const locale = useLocale() as Locale;
    const tx = (key: keyof typeof ui) => (ui[key] as any)[locale] ?? (ui[key] as any)['en'];

    const [isOpen, setIsOpen] = useState(false);
    const [screen, setScreen] = useState<1 | 2 | 3>(1);

    // Reutiliza el link de Calendly de 1 hora ya existente en el sitio.
    // Si el kickoff debe usar un link distinto, reemplazá esta constante.
    const CALENDAR_URL = "https://calendar.app.google/74Sc4peRwuJ3eJ8W7";

    // TODO: reemplazar cuando tengan el Payment Link de Stripe
    const STRIPE_URL = "STRIPE_PAYMENT_LINK_AQUI";

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(() => setScreen(1), 300); // reset tras cerrar
    };

    return (
        <section className="py-16 px-6 bg-slate-50 border-t border-slate-100">
            <div className="max-w-4xl mx-auto text-center">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {/* Camino gratuito */}

                    <a href="https://alpha.better-technologies.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-full border-2 border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[11px] hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                        {tx('alphaCtaAssess')}
                    </a>

                    {/* Camino pago */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-8 py-4 rounded-full bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        {tx('alphaCtaMain')}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 md:p-10 max-w-xl w-full max-h-[85vh] overflow-y-auto"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors text-2xl leading-none z-10"
                                aria-label={tx('closeButton')}
                            >
                                ×
                            </button>
                            {screen === 1 && (
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
                                        onClick={() => setScreen(2)}
                                        className="w-full flex justify-center bg-blue-600 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-colors"
                                    >
                                        {tx('alphaCtaCalendar')}
                                    </a>
                                </>
                            )}

                            {screen === 2 && (
                                <>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6 leading-snug">
                                        {tx('alphaScreen2Title')}
                                    </h3>

                                    <a href={STRIPE_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setScreen(3)}
                                        className="w-full flex justify-center bg-orange-500 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors"
                                    >
                                        {tx('alphaCtaStripe')}
                                    </a>
                                    <button
                                        onClick={() => setScreen(1)}
                                        className="block mx-auto mt-6 text-slate-400 hover:text-blue-600 text-[10px] uppercase font-black tracking-widest transition-colors"
                                    >
                                        {tx('goBackModal')}
                                    </button>
                                </>
                            )}

                            {screen === 3 && (
                                <>
                                    <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-line">
                                        {tx('alphaScreen3Body')}
                                    </p>
                                    <p className="text-slate-900 font-black text-sm mb-8">
                                        {tx('alphaScreen3Signature')}
                                    </p>
                                    <button
                                        onClick={closeModal}
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
    );
};
export default AlphaFastTrackSection;