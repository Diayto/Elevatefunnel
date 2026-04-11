"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  heroContainerVariants,
  heroItemVariants,
} from "@/lib/motion/presets";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function HeroIntro() {
  const reduced = useReducedMotionSafe();
  const item = heroItemVariants(reduced);
  const container = heroContainerVariants(reduced);
  const [heroIn, setHeroIn] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    setHeroIn(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("elevate-offer-popup-shown") === "1") return;
    if (secondsLeft <= 0) {
      setShowOffer(true);
      localStorage.setItem("elevate-offer-popup-shown", "1");
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(1, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <motion.div
      id="act-hero-content"
      className="relative z-10 max-w-3xl"
      variants={container}
      initial="hidden"
      animate={heroIn ? "visible" : "hidden"}
    >
      <motion.p
        variants={item}
        className="mb-4 text-[13px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]"
      >
        Системная программа
      </motion.p>
      <motion.h1
        variants={item}
        className="font-[family-name:var(--font-serif)] text-[clamp(2.12rem,4.95vw,3.6rem)] font-normal leading-[1.06] tracking-[-0.02em] text-[var(--text-primary)] text-balance"
      >
        Международные стажировки и глобальные возможности - системный путь к
        сильной карьере.
      </motion.h1>
      <motion.p
        variants={item}
        className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg"
      >
        Для студентов 1-4 курса: чёткий маршрут на 7 недель, поддержка ментора
        и помощь AI-ассистента на каждом шаге.
      </motion.p>
      <motion.div variants={item} className="mt-8 flex flex-wrap gap-3 sm:gap-4">
        <a
          href="#act-apply"
          className="inline-flex items-center justify-center rounded-sm border border-[var(--accent)] bg-[var(--accent)] px-7 py-3.5 text-sm font-medium text-[var(--bg-deep)] transition hover:bg-transparent hover:text-[var(--text-primary)] sm:px-8"
        >
          Подать заявку
        </a>
        <a
          href="#act-route"
          className="inline-flex items-center justify-center rounded-sm border border-white/15 px-7 py-3.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent-dim)] sm:px-8"
        >
          Как это устроено
        </a>
      </motion.div>
      <motion.div variants={item} className="mt-5 inline-flex items-center gap-3 rounded-sm border border-white/12 bg-white/[0.03] px-4 py-2.5">
        <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Окно предложения</span>
        <span className="text-sm font-semibold text-[var(--accent)]">{mm}:{ss}</span>
      </motion.div>

      {showOffer ? (
        <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-5">
          <div className="pointer-events-auto w-full max-w-md rounded-sm border border-white/15 bg-[var(--bg-mid)] p-6 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">Спецпредложение</p>
            <p className="mt-3 text-2xl font-[family-name:var(--font-serif)] text-[var(--text-primary)]">
              Скидка 20% на участие
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--text-muted)]">
              Оставьте заявку сейчас и команда зафиксирует условия в диалоге.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOffer(false)}
                className="rounded-sm border border-[var(--accent)]/40 px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--accent)]/12"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
