"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { FUNNEL_SECTION_IDS } from "@/lib/funnel/config";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

const NAV = [
  { href: `#${FUNNEL_SECTION_IDS.offer}`, label: "Оффер" },
  { href: `#${FUNNEL_SECTION_IDS.video}`, label: "Видео" },
  { href: `#${FUNNEL_SECTION_IDS.cases}`, label: "Кейсы" },
  { href: `#${FUNNEL_SECTION_IDS.form}`, label: "Анкета" },
] as const;

export function FunnelHeader() {
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
        <a
          href={`#${FUNNEL_SECTION_IDS.offer}`}
          className="flex items-center transition hover:opacity-80"
        >
          <Image
            src="/figma/graphics/logo.svg"
            alt="Elevate.Interns"
            width={128}
            height={13}
            priority
            className="h-[13px] w-[128px]"
          />
        </a>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Навигация воронки">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover-underline text-[15px] text-white/90 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
