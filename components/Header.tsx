"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

type HeaderProps = {
  showBackButton?: boolean;
};

const LANG_OPTIONS = [
  { code: "en" as const, label: "EN", flagSrc: "https://flagcdn.com/w160/de.png", flagAlt: "Alemania — idioma inglés" },
  { code: "es" as const, label: "ES", flagSrc: "https://flagcdn.com/w160/es.png", flagAlt: "España — idioma español" },
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
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Seleccionar idioma"
      >
        <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-[3px] border border-white/40 bg-neutral-900 shadow-sm">
          <img src={current.flagSrc} alt={current.flagAlt} width={64} height={64} className="h-full w-full object-cover" />
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
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+4px)] z-[130] min-w-[9.75rem] overflow-hidden rounded-[3px] border border-white/30 bg-neutral-950 py-1 shadow-xl"
            role="listbox"
          >
            {other.map((opt) => (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  onSelect(opt.code);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-2 py-2 text-left hover:bg-blue-900/40"
              >
                <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-[3px] border border-white/35 bg-neutral-900">
                  <img src={opt.flagSrc} alt={opt.flagAlt} width={64} height={64} className="h-full w-full object-cover" />
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
  const localeFromPath = pathname.match(/^\/(en|es)(?=\/|$)/)?.[1];
  const localeIntl = useLocale();
  const locale = localeFromPath === "es" || localeFromPath === "en" ? localeFromPath : localeIntl;
  const t = useTranslations("Header");
  const router = useRouter();
  const menuItems = [
    { name: t("home"), href: `/${locale}` },
    { name: t("whatWeAre"), href: `/${locale}/#what-we-are` },
    { name: t("mittelstand"), href: `/${locale}/#mittelstand` },
    { name: t("pricing"), href: `/${locale}/#pricing` },
    { name: t("about"), href: `/${locale}/#about` },
    { name: t("blog"), href: `/${locale}/blog` },
  ];

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|es)(?=\/|$)/, "");
    const newPath = `/${newLocale}${pathWithoutLocale || ""}` || `/${newLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-24 py-5 z-[100] backdrop-blur-md bg-black border-b border-white/10">
        {/* Logo */}
        <a href={`/${locale}`} className="relative w-[120px] md:w-[140px] h-[40px] flex items-center justify-start flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            sizes="(max-width: 768px) 120px, 140px"
            className="object-contain"
          />
        </a>

        <div className="flex items-center gap-3 md:gap-8">
          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 text-white font-black uppercase text-xs tracking-widest items-center">
            {showBackButton && (
              <a
                href={`/${locale}`}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/40 rounded-full px-4 py-1.5"
              >
                <ArrowLeft className="w-3 h-3" />
                {t("backToHome")}
              </a>
            )}
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-blue-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger - Movido antes del Dropdown para que quede a la izquierda de la bandera */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-[110] flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
            aria-label="Menu"
          >
            <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>

          {/* Language Selector - Ahora aparece después de la hamburguesa en móvil */}
          <div className="flex items-center md:border-l md:border-white/20 md:ml-1 md:pl-4">
            <SquareLanguageDropdown locale={locale} onSelect={(code) => handleLanguageChange(code)} />
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-8 z-[105] md:hidden"
          >
            {showBackButton && (
              <a
                href={`/${locale}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-blue-400 text-2xl font-black uppercase tracking-tighter hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {t("backToHome")}
              </a>
            )}
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-white text-4xl font-black uppercase tracking-tighter hover:text-blue-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="mt-8 flex justify-center border-t border-white/10 pt-8 w-full">
              <SquareLanguageDropdown locale={locale} onSelect={(code) => handleLanguageChange(code)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}