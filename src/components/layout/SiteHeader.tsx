"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

const NAV = [
  { href: "/#act-students", label: "Кейсы" },
  { href: "/#act-pricing", label: "Тарифы" },
  { href: "/#act-video-lesson", label: "Видеоурок" },
  { href: "/#act-partners", label: "Партнеры" },
  { href: "/#act-faq", label: "Вопросы" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotionSafe();
  const { scrollY } = useScroll();

  const bgAlpha = useTransform(scrollY, [0, 120], reduced ? [0.62, 0.62] : [0, 0.78]);
  const borderAlpha = useTransform(scrollY, [0, 100], [0, 0.12]);
  const headerBg = useMotionTemplate`rgba(0, 0, 0, ${bgAlpha})`;
  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderAlpha})`;

  return (
    <motion.header
      data-site-header
      className="fixed left-0 right-0 top-0 z-50 backdrop-blur-sm md:backdrop-blur-md"
      style={{
        backgroundColor: headerBg,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: borderColor,
      }}
    >
      <div className="relative mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 lg:px-8 lg:py-5">
        <motion.a
          href="/#act-hero"
          className="flex items-center transition hover:opacity-80"
          whileTap={{ scale: 0.98 }}
        >
          <Image
            src="/figma/graphics/logo.svg"
            alt="Elevate.Interns"
            width={128}
            height={13}
            priority
            className="h-[13px] w-[128px]"
          />
        </motion.a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Основная навигация">
          {NAV.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduced ? 0 : 0.1 + i * 0.045,
                duration: reduced ? 0.01 : 0.48,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="hover-underline font-[family-name:var(--font-inter-tight)] text-[16px] font-normal text-white/90 transition hover:text-white"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-lg leading-none text-white transition hover:border-white/20 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span aria-hidden>{menuOpen ? "×" : "≡"}</span>
        </button>
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              id="mobile-nav"
              key="mobile-nav"
              initial={{ opacity: 0, y: reduced ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -12 }}
              transition={{
                duration: reduced ? 0.01 : 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute left-0 right-0 top-full border-b border-white/[0.08] bg-black/96 backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-1 px-6 py-5" aria-label="Основная навигация, мобильная версия">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: reduced ? 0 : 0.04 + i * 0.05,
                      duration: reduced ? 0.01 : 0.32,
                    }}
                    className="rounded-sm px-3 py-3 font-[family-name:var(--font-inter-tight)] text-[16px] font-normal text-white transition hover:bg-white/[0.04] hover:text-white/70"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
