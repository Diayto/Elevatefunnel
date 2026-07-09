"use client";

import { useEffect, useState } from "react";
import { FUNNEL_STEPS, type FunnelStep } from "@/lib/funnel/config";

type ProgressBarProps = {
  formSubmitted: boolean;
};

function resolveActiveStep(entries: { id: string; ratio: number }[], formSubmitted: boolean): FunnelStep {
  if (formSubmitted) return "done";

  const visible = entries
    .filter((e) => e.ratio > 0.08)
    .sort((a, b) => b.ratio - a.ratio);

  if (visible.length === 0) return "offer";

  const top = visible[0]!.id;
  if (top === "act-offer") return "offer";
  if (top === "act-video" || top === "act-warmup") return "video";
  if (top === "act-cases") return "cases";
  if (top === "act-form") return "form";
  return "offer";
}

export function ProgressBar({ formSubmitted }: ProgressBarProps) {
  const [activeStep, setActiveStep] = useState<FunnelStep>("offer");

  useEffect(() => {
    if (formSubmitted) {
      setActiveStep("done");
      return;
    }

    const sectionIds = ["act-offer", "act-video", "act-warmup", "act-cases", "act-form"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        const list = sectionIds.map((id) => ({
          id,
          ratio: ratios.get(id) ?? 0,
        }));
        setActiveStep(resolveActiveStep(list, false));
      },
      { threshold: [0, 0.08, 0.2, 0.35, 0.5, 0.75, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [formSubmitted]);

  const activeIndex = FUNNEL_STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div
      className="funnel-progress fixed left-0 right-0 top-[57px] z-40 border-b border-white/[0.06] bg-black/80 px-4 py-2 backdrop-blur-md sm:top-[65px]"
      aria-label="Прогресс по шагам воронки"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 sm:gap-3">
        {FUNNEL_STEPS.map((step, index) => {
          const isActive = index <= activeIndex;
          return (
            <div key={step.id} className="flex min-w-0 flex-1 flex-col gap-1">
              <div
                className={`funnel-progress-segment ${isActive ? "is-active" : ""}`}
                aria-hidden
              />
              <span
                className={`truncate text-center text-[10px] uppercase tracking-[0.08em] sm:text-[11px] ${
                  isActive ? "text-white/85" : "text-white/35"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
