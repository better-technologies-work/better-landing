"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export const ecosystemTranslations = {
  en: {
    faqTitle: "FAQ — The Better Ecosystem",
    faqQ1: "What do I own?",
    faqA1: "A Quanto. A small digital capability that does one job exceptionally well.",
    faqQ2: "How does work get done?",
    faqA2: "A Power Unit. A defined task executed by the right specialist using the right technology.",
    faqQ3: "What do I buy?",
    faqA3: "A Hack. A proven combination of Quantos that creates a business result.",
    faqQ4: "What grows over time?",
    faqA4: "A Sovereign Node. Connected digital infrastructure built from capabilities you control.",
    coreFormulaLabel: "Core Formula:",
    coreFormula:
      "Quantos are what you own, Power Units are how work gets done, Hacks are what your business can do, and Sovereign Nodes are the infrastructure you control.",
    faqClosing: "You know how the system works. Now choose where your business needs to lead.",
  },

  es: {
    faqTitle: "FAQ — El Mejor Ecosistema",
    faqQ1: "¿Qué es lo que soy dueño?",
    faqA1: "Un Quanto. Una pequeña capacidad digital que hace un trabajo excepcionalmente bien.",
    faqQ2: "¿Cómo se hace el trabajo?",
    faqA2: "Un Power Unit. Una tarea definida ejecutada por el especialista correcto usando la tecnología correcta.",
    faqQ3: "¿Qué compro?",
    faqA3: "Un Hack. Una combinación probada de Quantos que genera un resultado de negocio.",
    faqQ4: "¿Qué crece con el tiempo?",
    faqA4: "Un Sovereign Node. Infraestructura digital conectada, construida a partir de capacidades que controlás.",
    coreFormulaLabel: "Fórmula central:",
    coreFormula:
      "Los Quantos son lo que sos dueño, los Power Units son cómo se hace el trabajo, los Hacks son lo que tu negocio puede hacer, y los Sovereign Nodes son la infraestructura que controlás.",
    faqClosing: "Ya sabés cómo funciona el sistema. Ahora elegí dónde tu negocio necesita liderar.",
  },

  pt: {
    faqTitle: "FAQ — O Melhor Ecossistema",
    faqQ1: "O que eu possuo?",
    faqA1: "Um Quanto. Uma pequena capacidade digital que faz um trabalho excepcionalmente bem.",
    faqQ2: "Como o trabalho é feito?",
    faqA2: "Uma Power Unit. Uma tarefa definida executada pelo especialista certo usando a tecnologia certa.",
    faqQ3: "O que eu compro?",
    faqA3: "Um Hack. Uma combinação comprovada de Quantos que cria um resultado de negócio.",
    faqQ4: "O que cresce com o tempo?",
    faqA4: "Um Sovereign Node. Infraestrutura digital conectada, construída a partir de capacidades que você controla.",
    coreFormulaLabel: "Fórmula central:",
    coreFormula:
      "Os Quantos são o que você possui, as Power Units são como o trabalho é feito, os Hacks são o que seu negócio pode fazer, e os Sovereign Nodes são a infraestrutura que você controla.",
    faqClosing: "Você já sabe como o sistema funciona. Agora escolha onde o seu negócio precisa liderar.",
  },

  de: {
    faqTitle: "FAQ — Das bessere Ökosystem",
    faqQ1: "Was besitze ich?",
    faqA1: "Ein Quanto. Eine kleine digitale Fähigkeit, die eine Aufgabe außergewöhnlich gut erfüllt.",
    faqQ2: "Wie wird die Arbeit erledigt?",
    faqA2: "Eine Power Unit. Eine definierte Aufgabe, ausgeführt vom richtigen Spezialisten mit der richtigen Technologie.",
    faqQ3: "Was kaufe ich?",
    faqA3: "Ein Hack. Eine bewährte Kombination von Quantos, die ein Geschäftsergebnis erzeugt.",
    faqQ4: "Was wächst mit der Zeit?",
    faqA4: "Ein Sovereign Node. Vernetzte digitale Infrastruktur, aufgebaut aus Fähigkeiten, die Sie kontrollieren.",
    coreFormulaLabel: "Kernformel:",
    coreFormula:
      "Quantos sind, was Sie besitzen, Power Units sind, wie Arbeit erledigt wird, Hacks sind, was Ihr Unternehmen leisten kann, und Sovereign Nodes sind die Infrastruktur, die Sie kontrollieren.",
    faqClosing: "Sie wissen jetzt, wie das System funktioniert. Wählen Sie nun, wo Ihr Unternehmen führen muss.",
  },
};

// Componentes SVG Profesionales
const QuestionIcons = [
  <svg key="1" className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>,
  <svg key="2" className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  <svg key="3" className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg key="4" className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
];

type BetterEcosystemSectionProps = {
  locale: keyof typeof ecosystemTranslations;
};

export default function BetterEcosystemSection({ locale }: BetterEcosystemSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  const translations = ecosystemTranslations[locale] ?? ecosystemTranslations.en;
  const tx = (key: string) => translations[key as keyof typeof translations] ?? "";

  return (
    <section id="ecosystem" className="py-20 px-6 lg:px-12 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado Seccion */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-200">
            <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
            {tx('faqTitle')}
          </h2>
        </div>

        {/* Grid alineada perfectamente en la parte superior (items-start) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Columna Izquierda: Acordeón FAQ */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border-b border-slate-100 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === n ? null : n)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50/80 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-3">
                    <span className="p-1.5 rounded-md bg-slate-50 border border-slate-100 flex-shrink-0">
                      {QuestionIcons[n - 1]}
                    </span>
                    {tx(`faqQ${n}`)}
                  </span>
                  <span
                    className={`flex-shrink-0 font-bold text-lg transition-transform duration-200 ${
                      openFaq === n ? "rotate-45 text-orange-500" : "text-slate-400"
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === n && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-14 text-slate-600 text-sm leading-relaxed border-l-2 border-orange-500/40 ml-5 my-1">
                        {tx(`faqA${n}`)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Columna Derecha: Tarjeta Diego (Alineada al mismo nivel superior) */}
          <div className="relative bg-white border border-slate-100 rounded-3xl shadow-xl p-8 md:p-10 border-t-4 border-t-orange-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0 bg-blue-50">
                <Image src="/diego.jpeg" alt="Diego Vargas" fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-black text-sm">Diego Vargas</p>
                <p className="text-blue-600 font-black uppercase tracking-[0.1em] text-[10px] mt-0.5">
                  Chief Business Engineering Operator
                </p>
              </div>
              <a
                href="https://www.linkedin.com/in/diegoe-vargas/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1.5 hover:border-blue-600 hover:bg-blue-50 transition-all flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#0A66C2" />
                  <path d="M7 9H5v10h2V9zm-1-1.5A1.25 1.25 0 1 0 6 5a1.25 1.25 0 0 0 0 2.5zM19 13.2c0-2.3-1.1-4.2-3.3-4.2a3.2 3.2 0 0 0-2.7 1.4V9H11v10h2v-5.4c0-1.4.7-2.3 1.9-2.3 1.1 0 1.6.8 1.6 2.2V19h2v-5.8z" fill="#fff" />
                </svg>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">LinkedIn</span>
              </a>
            </div>

            <p className="text-slate-800 text-base md:text-lg leading-relaxed italic mb-4">
              <span className="font-black text-slate-900 not-italic">{tx('coreFormulaLabel')}</span> "{tx('coreFormula')}"
            </p>

            <p className="text-slate-900 font-bold text-lg md:text-xl">
              {tx('faqClosing')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}