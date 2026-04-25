"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionDecor } from "@/components/landing/SectionDecor";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Кому подойдёт эта программа?",
    a: "Программа подойдёт студентам 1–4 курса из любой точки мира, которые хотят выйти на международную стажировку, но пока не понимают, как выстроить сильный профиль, правильно подаваться и конкурировать за лучшие возможности. Неважно, из какой ты страны и на каком уровне стартуешь сейчас — важно, что у тебя есть цель и готовность системно двигаться к ней.",
  },
  {
    q: "Подойдёт ли программа, если у меня ещё нет опыта?",
    a: "Да, программа рассчитана на студентов с любым уровнем подготовки. Мы помогаем выстроить профиль с нуля и подготовиться к первым стажировкам.",
  },
  {
    q: "Что я получу за время программы?",
    a: "Вы получите структурированный маршрут к международной стажировке: от упаковки CV и LinkedIn до подготовки к интервью с обратной связью от ментора.",
  },
  {
    q: "Как проходит программа?",
    a: "Программа длится 7 недель и включает видеоуроки, шаблоны, регулярные созвоны с ментором и доступ к коммьюнити. Темп и глубина зависят от выбранного тарифа.",
  },
  {
    q: "В чём разница между уровнями участия?",
    a: "Silver — базовый уровень с системой и материалами. Gold — плотная обратная связь и сопровождение куратора. Diamond — максимальная персонализация и индивидуальная работа с ментором.",
  },
  {
    q: "Сколько времени нужно уделять программе?",
    a: "Рекомендуем выделять 5–7 часов в неделю. Основной темп зависит от вашего тарифа и целей.",
  },
  {
    q: "Это только для студентов из СНГ?",
    a: "Нет, программа подходит для студентов из любой страны, которые хотят выйти на международный рынок стажировок.",
  },
];

function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof ITEMS)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <div
      className="overflow-hidden rounded-[16px] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={
        isOpen
          ? {
              backgroundColor: "#111",
              border: "1px solid transparent",
            }
          : {
              backgroundColor: "#000",
              border: "1px solid #282828",
            }
      }
    >
      <button
        id={triggerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-300"
        style={
          isOpen
            ? {
                background:
                  "linear-gradient(177.33deg, #053BE5 4.87%, #040079 101.22%)",
                borderRadius: "16px 16px 0 0",
              }
            : undefined
        }
      >
        <span
          className="text-[18px] font-medium leading-[1.3] text-white transition-colors group-hover:text-white"
          style={{ letterSpacing: "-0.005em" }}
        >
          {item.q}
        </span>
        <span
          className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] transition-all duration-300 ${
            isOpen
              ? "bg-white/15 text-white"
              : "bg-transparent text-white/80 group-hover:bg-white/10 group-hover:text-white"
          }`}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 12h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {!isOpen && (
              <path
                d="M12 6v12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-5">
            <p className="text-[16px] leading-[1.5] text-white/75">{item.a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="act-faq"
      className="relative overflow-visible py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
      aria-labelledby="faq-heading"
    >
      <SectionDecor
        items={[
          // grid-4 сверху по центру, flipped.
          { src: "/figma/gradients/grid-4.svg", offsetX: 0, top: -200, width: 596, height: 438, opacity: 0.3, flipY: true },
          // blob-7 слева. Native SVG 1095x1095, core circle = 538.
          { src: "/figma/gradients/blob-7.svg", offsetX: -544, top: -178, width: 1095, height: 1095, opacity: 0.7 },
          // blob-6 справа сверху. Native SVG 970x970, core circle = 412.
          { src: "/figma/gradients/blob-6.svg", offsetX: 528, top: -329, width: 970, height: 970, opacity: 0.7 },
        ]}
      />
      <div className="relative mx-auto max-w-[1200px] px-8">
        {/* Icon */}
        <div className="flex justify-center">
          <span className="section-icon-box">
            <Image
              src="/figma/icons/faqs-icon.svg"
              alt=""
              width={24}
              height={24}
            />
          </span>
        </div>

        {/* Heading */}
        <h2
          id="faq-heading"
          className="heading-gradient mt-5 text-center font-medium uppercase leading-[1.15] tracking-[-0.005em]"
          style={{ fontFamily: "var(--font-inter-tight)", fontSize: "44px" }}
        >
          Вопросы и ответы
        </h2>

        {/* 2-column grid, items distribute as in Figma */}
        <div className="mx-auto mt-14 grid max-w-[1160px] gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            {[0, 4, 5].map((i) => (
              <FaqItem
                key={i}
                item={ITEMS[i]}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 6].map((i) => (
              <FaqItem
                key={i}
                item={ITEMS[i]}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
