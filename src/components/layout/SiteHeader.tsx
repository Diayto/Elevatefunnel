"use client";

import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

const NAV = [
  { href: "/#act-problem", label: "Контекст" },
  { href: "/#act-route", label: "Программа" },
  { href: "/#act-support", label: "Поддержка" },
  { href: "/#act-proof-metrics", label: "Результаты" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotionSafe();
  const { scrollY } = useScroll();

  const bgAlpha = useTransform(scrollY, [0, 120], reduced ? [0.62, 0.62] : [0.5, 0.78]);
  const borderAlpha = useTransform(scrollY, [0, 100], [0.06, 0.12]);
  const headerBg = useMotionTemplate`rgba(10, 14, 20, ${bgAlpha})`;
  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderAlpha})`;

  return (
    <motion.header
      data-site-header
      className="fixed left-0 right-0 top-0 z-50 backdrop-blur-md backdrop-saturate-150"
      style={{
        backgroundColor: headerBg,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: borderColor,
      }}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:gap-6 md:px-10">
        <motion.a
          href="/#act-hero"
          className="font-[family-name:var(--font-inter-logo)] text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] transition hover:text-[var(--accent)]"
          whileTap={{ scale: 0.98 }}
        >
          Elevate Interns
        </motion.a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Основная навигация">
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
              className="text-[13px] font-medium tracking-wide text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <motion.a
            href="/#act-apply"
            className="hidden rounded-sm border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/20 sm:inline-flex"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Заявка
          </motion.a>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-lg leading-none text-[var(--text-primary)] transition hover:border-white/20 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden>{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
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
              className="absolute left-0 right-0 top-full border-b border-white/[0.08] bg-[var(--bg-deep)]/96 backdrop-blur-xl md:hidden"
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
                    className="rounded-sm px-3 py-3 text-[15px] font-medium text-[var(--text-muted)] transition hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.a
                  href="/#act-apply"
                  initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: reduced ? 0 : 0.22,
                    duration: reduced ? 0.01 : 0.32,
                  }}
                  className="mt-2 rounded-sm border border-[var(--accent)]/40 px-3 py-3 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"
                  onClick={() => setMenuOpen(false)}
                >
                  Заявка
                </motion.a>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
