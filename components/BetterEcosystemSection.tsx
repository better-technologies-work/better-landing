"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, Cpu, Handshake, LucideIcon } from "lucide-react";
import Image from "next/image";

type CajaKey = "caja1" | "caja2" | "caja3" | "caja4";

type Caja = {
  key: CajaKey;
  icon: LucideIcon;
};
// Agregar estas keys al diccionario de tx() existente, dentro de cada locale.

export const ecosystemTranslations = {
  en: {
    ecosystemEyebrow: "BEYOND TECH",
    ecosystemTitle: "The Better",
    ecosystemTitleEm: "Ecosystem",
    ecosystemTitleSuffix: "(The Core Value / Beyond Tech)",
    ecosystemQuote: "We don't build tech to compete.",
    ecosystemQuoteEm: "We engineer systems to lead.",
    ecosystemCoreBadge: "Core",

    caja1Name: "AUTHORITY",
    caja1Title: "Digital Presence & Authority",
    caja1Desc:
      "Dominate the Narrative. SEO, GEO, and AI visibility. We build AI trust and transform organizations into the ultimate digital authority in their category.",

    caja2Name: "EXPERIENCES",
    caja2Title: "Better Experiences™",
    caja2Desc:
      "Make them feel it. People forget ads, but they remember experiences. From corporate activations to innovation workshops, we build moments that create cultural relevance.",

    caja3Name: "AI SYSTEMS",
    caja3Title: "Growth & AI Systems™",
    caja3Desc:
      "Scale predictably. CRM, automation, and AI agents. We implement knowledge systems that ensure operational resilience and give your team an unfair advantage.",

    caja4Name: "ECOSYSTEMS",
    caja4Title: "Better Ecosystems™",
    caja4Desc:
      "We open the right doors. You don't grow alone. We source strategic partners and engineer the introductions your business needs to leap forward.",

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
    ecosystemEyebrow: "MÁS ALLÁ DE LA TECNOLOGÍA",
    ecosystemTitle: "El Mejor",
    ecosystemTitleEm: "Ecosistema",
    ecosystemTitleSuffix: "(El Valor Central / Más Allá de la Tecnología)",
    ecosystemQuote: "No construimos tecnología para competir.",
    ecosystemQuoteEm: "Ingeniamos sistemas para liderar.",
    ecosystemCoreBadge: "Núcleo",

    caja1Name: "AUTORIDAD",
    caja1Title: "Presencia Digital & Autoridad",
    caja1Desc:
      "Dominá el relato. SEO, GEO y visibilidad en IA. Construimos confianza en los motores de IA y transformamos organizaciones en la máxima autoridad digital de su categoría.",

    caja2Name: "EXPERIENCIAS",
    caja2Title: "Better Experiences™",
    caja2Desc:
      "Que lo sientan. La gente olvida los anuncios, pero recuerda las experiencias. Desde activaciones corporativas hasta workshops de innovación, construimos momentos que generan relevancia cultural.",

    caja3Name: "SISTEMAS IA",
    caja3Title: "Growth & AI Systems™",
    caja3Desc:
      "Escalá de forma predecible. CRM, automatización y agentes de IA. Implementamos sistemas de conocimiento que garantizan resiliencia operativa y le dan a tu equipo una ventaja injusta.",

    caja4Name: "ECOSISTEMAS",
    caja4Title: "Better Ecosystems™",
    caja4Desc:
      "Abrimos las puertas correctas. No creces solo. Conseguimos socios estratégicos e ingeniamos las presentaciones que tu negocio necesita para dar el salto.",

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
    ecosystemEyebrow: "ALÉM DA TECNOLOGIA",
    ecosystemTitle: "O Melhor",
    ecosystemTitleEm: "Ecossistema",
    ecosystemTitleSuffix: "(O Valor Central / Além da Tecnologia)",
    ecosystemQuote: "Não construímos tecnologia para competir.",
    ecosystemQuoteEm: "Projetamos sistemas para liderar.",
    ecosystemCoreBadge: "Núcleo",

    caja1Name: "AUTORIDADE",
    caja1Title: "Presença Digital & Autoridade",
    caja1Desc:
      "Domine a narrativa. SEO, GEO e visibilidade em IA. Construímos confiança nos mecanismos de IA e transformamos organizações na máxima autoridade digital de sua categoria.",

    caja2Name: "EXPERIÊNCIAS",
    caja2Title: "Better Experiences™",
    caja2Desc:
      "Faça-os sentir. As pessoas esquecem os anúncios, mas lembram das experiências. De ativações corporativas a workshops de inovação, criamos momentos que geram relevância cultural.",

    caja3Name: "SISTEMAS DE IA",
    caja3Title: "Growth & AI Systems™",
    caja3Desc:
      "Escale de forma previsível. CRM, automação e agentes de IA. Implementamos sistemas de conhecimento que garantem resiliência operacional e dão à sua equipe uma vantagem injusta.",

    caja4Name: "ECOSSISTEMAS",
    caja4Title: "Better Ecosystems™",
    caja4Desc:
      "Abrimos as portas certas. Você não cresce sozinho. Buscamos parceiros estratégicos e viabilizamos as apresentações que o seu negócio precisa para dar o próximo salto.",

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
    ecosystemEyebrow: "MEHR ALS TECHNOLOGIE",
    ecosystemTitle: "Das bessere",
    ecosystemTitleEm: "Ökosystem",
    ecosystemTitleSuffix: "(Der Kernwert / Mehr als Technologie)",
    ecosystemQuote: "Wir bauen keine Technologie, um zu konkurrieren.",
    ecosystemQuoteEm: "Wir entwickeln Systeme, die führen.",
    ecosystemCoreBadge: "Kern",

    caja1Name: "AUTORITÄT",
    caja1Title: "Digitale Präsenz & Autorität",
    caja1Desc:
      "Bestimmen Sie die Erzählung. SEO, GEO und KI-Sichtbarkeit. Wir bauen Vertrauen bei KI-Systemen auf und machen Organisationen zur führenden digitalen Autorität ihrer Branche.",

    caja2Name: "ERLEBNISSE",
    caja2Title: "Better Experiences™",
    caja2Desc:
      "Lassen Sie es sie spüren. Werbung wird vergessen, Erlebnisse bleiben. Von Firmenaktivierungen bis zu Innovationsworkshops schaffen wir Momente mit kultureller Relevanz.",

    caja3Name: "KI-SYSTEME",
    caja3Title: "Growth & AI Systems™",
    caja3Desc:
      "Planbar skalieren. CRM, Automatisierung und KI-Agenten. Wir implementieren Wissenssysteme, die operative Resilienz sichern und Ihrem Team einen unfairen Vorteil verschaffen.",

    caja4Name: "ÖKOSYSTEME",
    caja4Title: "Better Ecosystems™",
    caja4Desc:
      "Wir öffnen die richtigen Türen. Sie wachsen nicht allein. Wir finden strategische Partner und ermöglichen die Vorstellungen, die Ihr Unternehmen für den nächsten Sprung braucht.",

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

const cajaData: Caja[] = [
  { key: "caja1", icon: Search },
  { key: "caja2", icon: Sparkles },
  { key: "caja3", icon: Cpu },
  { key: "caja4", icon: Handshake },
];

// First pill (Digital Presence & Authority) open by default
const DEFAULT_OPEN_INDEX = 0;

type BetterEcosystemSectionProps = {
  locale: keyof typeof ecosystemTranslations;
};

export default function BetterEcosystemSection({ locale }: BetterEcosystemSectionProps) {
  const [selected, setSelected] = useState<number | null>(DEFAULT_OPEN_INDEX);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const translations = ecosystemTranslations[locale] ?? ecosystemTranslations.en;
  const tx = (key: string) => translations[key as keyof typeof translations] ?? "";

  return (
    <section id="ecosystem" className="py-16 px-6 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto">

        <p className="text-orange-600 uppercase tracking-[0.25em] text-[10px] font-black mb-2">
          {tx('ecosystemEyebrow')}
        </p>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-6">
          {tx('ecosystemTitle')} <em className="italic underline decoration-orange-100">{tx('ecosystemTitleEm')}</em>
        </h2>

        <div className="border-l-[3px] border-orange-500 pl-5 bg-slate-50 py-4 pr-5 rounded-r-2xl mb-8">
          <p className="text-slate-900 font-black italic text-sm leading-relaxed tracking-tight">
            {tx('ecosystemQuote')} <br />
            <span className="text-orange-600">{tx('ecosystemQuoteEm')}</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {selected !== null && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-5 border border-slate-100 rounded-3xl p-5 mb-6 hover:border-blue-600/30 transition-colors"
            >
              <IconBadge icon={cajaData[selected].icon} isDefault={selected === DEFAULT_OPEN_INDEX} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-slate-900 font-black uppercase tracking-tight text-sm">
                      {tx(`${cajaData[selected].key}Title`)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 mb-2">
                      <p className="text-blue-600 font-black uppercase tracking-[0.15em] text-[10px]">
                        {tx(`${cajaData[selected].key}Name`)}
                      </p>
                      {selected === DEFAULT_OPEN_INDEX && (
                        <span className="text-orange-600 font-black uppercase tracking-widest text-[8px] border border-orange-200 bg-orange-50 rounded-full px-2 py-0.5">
                          {tx('ecosystemCoreBadge')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {tx(`${cajaData[selected].key}Desc`)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2">
          {cajaData.map((caja, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(selected === i ? null : i)}
              className={`relative px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                selected === i
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {i === DEFAULT_OPEN_INDEX && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
              )}
              {tx(`${caja.key}Name`)}
            </button>
          ))}
        </div>

        {/* FAQ — THE BETTER ECOSYSTEM */}
        <div className="mt-16">
          <h3 className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-6">
            {tx('faqTitle')}
          </h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border-b border-slate-100 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === n ? null : n)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-slate-900 text-sm">
                    {tx(`faqQ${n}`)}
                  </span>
                  <span
                    className={`flex-shrink-0 text-blue-600 font-black text-lg transition-transform ${
                      openFaq === n ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === n && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
                        {tx(`faqA${n}`)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CARD DIEGO — CORE FORMULA */}
          <div className="mt-10 relative bg-white border border-slate-100 rounded-3xl shadow-xl p-8 md:p-10">
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

function IconBadge({ icon: Icon, isDefault }: { icon: LucideIcon; isDefault: boolean }) {
  return (
    <div
      className={`flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center bg-blue-50 ${
        isDefault ? "ring-2 ring-orange-400" : ""
      }`}
    >
      <Icon className="h-6 w-6 text-blue-600" strokeWidth={2.25} />
    </div>
  );
}