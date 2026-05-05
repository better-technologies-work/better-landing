"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

type HeaderProps = {
  showBackButton?: boolean;
};

export default function Header({ showBackButton = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();
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

        <div className="flex items-center gap-2 md:gap-3 md:border-l md:border-white/20 md:ml-1 md:pl-4">
          <button
            onClick={() => handleLanguageChange("en")}
            className={`h-10 px-2 md:h-11 md:px-3 rounded-full border border-white/40 bg-white/10 flex items-center justify-center gap-1.5 text-xl md:text-2xl transition-all ${
              locale === "en"
                ? "grayscale-0 opacity-100 ring-2 ring-blue-400"
                : "grayscale opacity-70 hover:opacity-100"
            }`}
            aria-label="Cambiar a inglés"
          >
            <img
              src="https://flagcdn.com/w40/de.png"
              alt="Bandera de Alemania"
              className="h-4 w-6 rounded-sm object-cover"
            />
            <span className="text-[10px] md:text-xs font-black tracking-widest text-white">EN</span>
          </button>
          <button
            onClick={() => handleLanguageChange("es")}
            className={`h-10 px-2 md:h-11 md:px-3 rounded-full border border-white/40 bg-white/10 flex items-center justify-center gap-1.5 text-xl md:text-2xl transition-all ${
              locale === "es"
                ? "grayscale-0 opacity-100 ring-2 ring-blue-400"
                : "grayscale opacity-70 hover:opacity-100"
            }`}
            aria-label="Cambiar a español"
          >
            <img
              src="https://flagcdn.com/w40/es.png"
              alt="Bandera de España"
              className="h-4 w-6 rounded-sm object-cover"
            />
            <span className="text-[10px] md:text-xs font-black tracking-widest text-white">ES</span>
          </button>
        </div>

        {/* Mobile hamburger - Ahora no chocará con las banderas */}
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
            {/* Banderas Mobile */}
            <div className="mt-8 flex gap-8 scale-150 border-t border-white/10 pt-8 w-1/2 justify-center">
               <button onClick={() => handleLanguageChange("en")} className={locale === "en" ? "grayscale-0" : "grayscale opacity-40"}>🇩🇪</button>
               <button onClick={() => handleLanguageChange("es")} className={locale === "es" ? "grayscale-0" : "grayscale opacity-40"}>🇪🇸</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}