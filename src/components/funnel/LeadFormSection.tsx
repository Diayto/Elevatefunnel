"use client";

import { useState } from "react";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { GlowButton } from "@/components/funnel/GlowButton";
import { LeadFormOverlay } from "@/components/funnel/LeadFormOverlay";
import { FUNNEL_SECTION_IDS } from "@/lib/funnel/config";
import type { VideoWatchState } from "@/lib/funnel/videoWatch";

type LeadFormSectionProps = {
  watchState: VideoWatchState;
  onSubmitted?: () => void;
};

const SECTION_DECOR = [
  {
    src: "/figma/gradients/footer-gradient-star.svg",
    offsetX: -23,
    top: -280,
    width: 1800,
    height: 1200,
    opacity: 0.45,
  },
  {
    src: "/figma/gradients/grid-5.svg",
    offsetX: -481,
    top: 40,
    width: 500,
    height: 367,
    opacity: 0.25,
    flipY: true,
  },
] as const;

export function LeadFormSection({ watchState, onSubmitted }: LeadFormSectionProps) {
  const [overlayOpen, setOverlayOpen] = useState(false);

  const openForm = () => {
    setOverlayOpen(true);
  };

  return (
    <>
      <section
        id={FUNNEL_SECTION_IDS.form}
        className="relative overflow-visible py-20 lg:py-24"
        style={{ fontFamily: "var(--font-inter-tight)" }}
      >
        <SectionDecor items={[...SECTION_DECOR]} />

        <div className="relative mx-auto max-w-[720px] px-4 sm:px-8">
          <div
            className="relative overflow-hidden rounded-[24px] border border-white/20 px-6 py-10 backdrop-blur-[18px] sm:px-10 sm:py-12"
            style={{
              background:
                "radial-gradient(110% 120% at 20% 100%, rgba(5, 59, 229, 0.4) 0%, rgba(1, 7, 29, 0.55) 55%, rgba(0, 0, 0, 0.45) 100%)",
            }}
          >
            <p className="text-center text-[28px] leading-none" aria-hidden>
              👋
            </p>
            <h2
              className="heading-gradient mt-4 text-center font-semibold uppercase leading-[1.2] tracking-[-0.005em]"
              style={{ fontSize: "clamp(24px, 3.5vw, 32px)" }}
            >
              Готовы к консультации?
            </h2>
            <p className="mx-auto mt-5 max-w-[520px] text-center text-[16px] leading-[1.55] text-white/70">
              Заполните короткую анкету — мы подберём подходящие возможности и подготовим
              персональный разбор перед сессией.
            </p>

            <ul className="mx-auto mt-8 max-w-[480px] space-y-3 text-[14px] leading-[1.45] text-white/55">
              <li className="flex gap-3">
                <span className="text-[#3D9EFF]">✓</span>
                <span>~3 минуты, 8 коротких блоков</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#3D9EFF]">✓</span>
                <span>Персональный разбор профиля и целей</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#3D9EFF]">✓</span>
                <span>Менеджер свяжется для назначения сессии</span>
              </li>
            </ul>

            <div className="mt-10 flex flex-col items-center gap-3">
              <GlowButton type="button" onClick={openForm} className="h-[48px] px-10 text-[16px]">
                Заполнить анкету
              </GlowButton>
              <p className="text-[13px] text-white/40">Анкета откроется на этой же странице</p>
            </div>
          </div>
        </div>
      </section>

      <LeadFormOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        watchState={watchState}
        onSubmitted={() => {
          onSubmitted?.();
        }}
      />
    </>
  );
}
