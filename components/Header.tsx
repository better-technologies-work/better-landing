"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

type HeaderProps = {
  showBackButton?: boolean;
};

const menuItems = [
  { name: "Home",        href: "/" },
  { name: "What we are", href: "/#what-we-are" },
  { name: "Mittelstand", href: "/#mittelstand" },
  { name: "Pricing",     href: "/#pricing" },
  { name: "About",       href: "/#about" },
  { name: "Blog",        href: "/blog" },
];

export default function Header({ showBackButton = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-24 py-5 z-[100] backdrop-blur-md bg-black border-b border-white/10">
        {/* Logo */}
        <a href="/" className="relative w-[120px] md:w-[140px] h-[40px] flex items-center justify-start flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            sizes="(max-width: 768px) 120px, 140px"
            className="object-contain"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-white font-black uppercase text-xs tracking-widest items-center">
          {showBackButton && (
            <a
              href="/"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/40 rounded-full px-4 py-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Home
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

        {/* Mobile hamburger */}
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
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-blue-400 text-2xl font-black uppercase tracking-tighter hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}