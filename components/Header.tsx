"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

type HeaderProps = {
  showBackButton?: boolean;
};

// 1. Array de opciones actualizado y corregido
const LANG_OPTIONS = [
  { 
    code: "en" as const, 
    label: "EN", 
    flagSrc: "https://flagcdn.com/w160/us.png", 
    flagAlt: "English" 
  },
  { 
    code: "es" as const, 
    label: "ES", 
    flagSrc: "https://flagcdn.com/w160/es.png", 
    flagAlt: "Español" 
  },
  { 
    code: "de" as const, 
    label: "DE", 
    flagSrc: "https://flagcdn.com/w160/de.png", 
    flagAlt: "Deutsch" 
  },
  { 
    code: "pt" as const, 
    label: "PT", 
    flagSrc: "https://flagcdn.com/w160/br.png", 
    flagAlt: "Português" 
  },
];

function SquareLanguageDropdown({
  locale,
  onSelect,
}: {
  locale: string;
  onSelect: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANG_OPTIONS.find((l) => l.code === locale) ?? LANG_OPTIONS[0];
  const other = LANG_OPTIONS.filter((l) => l.code !== locale);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="relative z-[120]" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-[3px] border bg-white/10 px-1.5 py-1 shadow-inner transition-all ${
          open
            ? "border-blue-400 ring-[3px] ring-blue-400 ring-offset-[3px] ring-offset-neutral-950"
            : "border-white/55 ring-[3px] ring-blue-500/90 ring-offset-[3px] ring-offset-neutral-950"
        }`}
      >
        <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-[3px] border border-white/40 bg-neutral-900 shadow-sm">
          <img src={current.flagSrc} alt={current.flagAlt} className="h-full w-full object-cover" />
        </span>
        <span className="pr-1 text-[11px] font-black tracking-widest text-white">{current.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-white transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 top-[calc(100%+4px)] z-[130] min-w-[9.75rem] overflow-hidden rounded-[3px] border border-white/30 bg-neutral-950 py-1 shadow-xl"
          >
            {other.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  onSelect(opt.code);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-2 py-2 text-left hover:bg-blue-900/40"
              >
                <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-[3px] border border-white/35 bg-neutral-900">
                  <img src={opt.flagSrc} alt={opt.flagAlt} className="h-full w-full object-cover" />
                </span>
                <span className="text-[11px] font-black tracking-widest text-white">{opt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header({ showBackButton = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale(); // Obtiene el idioma actual de forma segura
  const t = useTranslations("Header");

  const menuItems = [
    { name: t("home"), href: `/${locale}` },
    { name: t("whatWeAre"), href: `/${locale}/#what-we-are` },
    { name: t("mittelstand"), href: `/${locale}/#mittelstand` },
    { name: t("pricing"), href: `/${locale}/#pricing` },
    { name: t("about"), href: `/${locale}/#about` },
    { name: t("blog"), href: `/${locale}/blog` },
  ];

  // 2. Lógica de cambio de idioma actualizada para 4 idiomas
  const handleLanguageChange = (newLocale: string) => {
    // Regex actualizada para incluir de y pt
    const pathWithoutLocale = pathname.replace(/^\/(en|es|de|pt)(?=\/|$)/, "");
    const newPath = `/${newLocale}${pathWithoutLocale || ""}`;
    router.push(newPath);
    setIsOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-24 py-5 z-[100] backdrop-blur-md bg-black border-b border-white/10">
        <a href={`/${locale}`} className="relative w-[120px] md:w-[140px] h-[40px] flex items-center justify-start flex-shrink-0">
  <Image 
    src="/logo.png" 
    alt="Logo" 
    fill 
    className="object-contain" 
    priority 
    sizes="(max-width: 768px) 120px, 140px" 
  />
</a>

        <div className="flex items-center gap-3 md:gap-8">
          <nav className="hidden md:flex gap-8 text-white font-black uppercase text-xs tracking-widest items-center">
            {showBackButton && (
              <a href={`/${locale}`} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/40 rounded-full px-4 py-1.5">
                <ArrowLeft className="w-3 h-3" />
                {t("backToHome")}
              </a>
            )}
            {menuItems.map((item) => (
              <a key={item.name} href={item.href} className="hover:text-blue-400 transition-colors">
                {item.name}
              </a>
            ))}
          </nav>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden relative z-[110] flex flex-col justify-center items-center w-10 h-10 gap-1.5">
            <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
          
          <div className="flex items-center md:border-l md:border-white/20 md:ml-1 md:pl-4">
            <SquareLanguageDropdown locale={locale} onSelect={handleLanguageChange} />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-8 z-[105] md:hidden"
          >
            {menuItems.map((item) => (
              <a key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="text-white text-4xl font-black uppercase tracking-tighter hover:text-blue-400">
                {item.name}
              </a>
            ))}
            <div className="mt-8 flex justify-center border-t border-white/10 pt-8 w-full">
              <SquareLanguageDropdown locale={locale} onSelect={handleLanguageChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}