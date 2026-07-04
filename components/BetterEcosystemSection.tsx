"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, Cpu, Handshake, LucideIcon } from "lucide-react";

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