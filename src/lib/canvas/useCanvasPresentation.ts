"use client";

import { useEffect, useState } from "react";
import type { ParticleQualityTier } from "./particleQuality";

/** Narrow viewports + prefers-reduced-motion → lighter particle load. */
export function useParticleQualityTier(reducedMotion: boolean): ParticleQualityTier {
  const [tier, setTier] = useState<ParticleQualityTier>(() => {
    if (reducedMotion) return "reduced";
    if (typeof window === "undefined") return "full";
    return window.matchMedia("(max-width: 768px)").matches ? "reduced" : "full";
  });

  useEffect(() => {
    if (reducedMotion) {
      setTier("reduced");
      return;
    }
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setTier(mq.matches ? "reduced" : "full");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reducedMotion]);

  return tier;
}

/** Cap pixel ratio on small screens to stabilize frame time. */
export function useDprCap(): number {
  const [cap, setCap] = useState(() => {
    if (typeof window === "undefined") return 2;
    const pr = window.devicePixelRatio || 1;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    return narrow ? Math.min(1.5, pr) : Math.min(2.25, pr);
  });

  useEffect(() => {
    const apply = () => {
      const pr = window.devicePixelRatio || 1;
      const narrow = window.matchMedia("(max-width: 768px)").matches;
      setCap(narrow ? Math.min(1.5, pr) : Math.min(2.25, pr));
    };
    apply();
    const mq = window.matchMedia("(max-width: 768px)");
    mq.addEventListener("change", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  return cap;
}
