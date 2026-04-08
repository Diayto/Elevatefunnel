"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NARRATIVE_ANCHORS } from "./anchors";
import {
  ZERO_HOTSPOT,
  computeHotspotFromElement,
  computeSignalHotspot,
  type NarrativeHotspot,
} from "./hotspot";
import {
  INITIAL_PARTICLE_ZONES,
  type ParticleFieldZones,
} from "./particleFieldZones";
import {
  DEFAULT_UNIFORMS,
  blendUniformsWeighted,
  lerpUniforms,
  type ParticleStateId,
  type ParticleUniforms,
} from "./types";
import { rectToVec4, toGlViewportRect } from "./viewportRects";

/**
 * Gaussian focus: section mid near ~38% viewport → peak weight.
 * Slightly tighter falloff than v1 so long pages hand off cleaner between acts.
 */
function sectionVisibility(el: HTMLElement | null, vh: number): number {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  if (r.bottom < -vh * 0.38 || r.top > vh * 1.38) return 0;
  const mid = r.top + r.height * 0.45;
  const target = vh * 0.38;
  const x = (mid - target) / (vh * 0.66);
  return Math.exp(-x * x * 2.05);
}

export function useNarrativeScroll() {
  const [uniforms, setUniforms] = useState<ParticleUniforms>(DEFAULT_UNIFORMS.heroField);
  const [dominantPhase, setDominantPhase] = useState<ParticleStateId>("heroField");
  const [hotspot, setHotspot] = useState<NarrativeHotspot>(ZERO_HOTSPOT);
  const [particleZones, setParticleZones] =
    useState<ParticleFieldZones>(INITIAL_PARTICLE_ZONES);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [narrativeReady, setNarrativeReady] = useState(false);

  const recompute = useCallback(() => {
    const vh = window.innerHeight || 1;
    const items = NARRATIVE_ANCHORS.map(({ id, state }) => ({
      state,
      uniforms: DEFAULT_UNIFORMS[state],
      weight: sectionVisibility(document.getElementById(id), vh),
    }));

    let blended = blendUniformsWeighted(
      items.map(({ uniforms: u, weight: w }) => ({ uniforms: u, weight: w })),
    );
    const wSum = items.reduce((s, i) => s + i.weight, 0);

    let dominant: ParticleStateId = "heroField";
    let maxW = -1;
    let focusId = NARRATIVE_ANCHORS[0]?.id ?? "act-hero";
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.weight > maxW) {
        maxW = it.weight;
        dominant = it.state;
        focusId = NARRATIVE_ANCHORS[i].id;
      }
    }

    if (wSum < 0.18 && typeof window !== "undefined" && window.scrollY < vh * 1.1) {
      blended = lerpUniforms(blended, DEFAULT_UNIFORMS.heroField, 0.72);
      dominant = "heroField";
      focusId = "act-hero";
    }

    const vw = typeof window !== "undefined" ? window.innerWidth : 1;
    const vhWin = typeof window !== "undefined" ? window.innerHeight : 1;
    const focusEl = typeof document !== "undefined" ? document.getElementById(focusId) : null;
    setHotspot(computeHotspotFromElement(focusEl, maxW > 0 ? maxW : 0, vw, vhWin));

    const weightById = Object.fromEntries(
      NARRATIVE_ANCHORS.map((a, i) => [a.id, items[i]?.weight ?? 0]),
    ) as Record<string, number>;

    const heroEl =
      typeof document !== "undefined" ? document.getElementById("act-hero-content") : null;
    const heroGl = heroEl ? toGlViewportRect(heroEl.getBoundingClientRect()) : null;
    const hasHero =
      !!heroGl && heroGl.width > 0.004 && heroGl.height > 0.004 && vw > 8 && vhWin > 8;

    const depthW = weightById["act-depth"] ?? 0;
    const depthZones: ParticleFieldZones["depthZones"] = [0, 1, 2].map((i) => {
      const el =
        typeof document !== "undefined"
          ? document.getElementById(`act-depth-col-${i}`)
          : null;
      if (!el || vw < 8 || vhWin < 8) return [0, 0, 0, 0] as [number, number, number, number];
      return rectToVec4(toGlViewportRect(el.getBoundingClientRect()));
    }) as ParticleFieldZones["depthZones"];

    const proofIds = ["act-proof-metrics", "act-proof-cases"] as const;
    let proofW = 0;
    let proofFocusEl: HTMLElement | null = null;
    for (const pid of proofIds) {
      const w = weightById[pid] ?? 0;
      if (w > proofW) {
        proofW = w;
        proofFocusEl =
          typeof document !== "undefined" ? document.getElementById(pid) : null;
      }
    }

    const aiW = weightById["act-ai"] ?? 0;
    const aiEl =
      typeof document !== "undefined" ? document.getElementById("act-ai-panel") : null;

    setParticleZones({
      heroZone: hasHero && heroGl ? rectToVec4(heroGl) : [0, 0, 0, 0],
      hasHeroZone: hasHero,
      depthZones,
      depthStrength: depthW,
      hotspotProof: computeSignalHotspot(proofFocusEl, proofW, vw, vhWin),
      hotspotAI: computeSignalHotspot(aiEl, aiW, vw, vhWin),
    });

    setUniforms(blended);
    setDominantPhase(dominant);
  }, []);

  const rafRef = useRef<number | null>(null);
  const scheduleRecompute = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      recompute();
    });
  }, [recompute]);

  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => {
    if (reducedMotionRef.current !== reducedMotion) {
      reducedMotionRef.current = reducedMotion;
      scheduleRecompute();
    }
  }, [reducedMotion, scheduleRecompute]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);

    window.addEventListener("scroll", scheduleRecompute, { passive: true });
    window.addEventListener("resize", scheduleRecompute, { passive: true });
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) scheduleRecompute();
    };
    window.addEventListener("pageshow", onPageShow);

    // On hard refresh the browser may restore scroll position a bit later.
    // Delay the first visible narrative frame to avoid "re-centering" jumps.
    scheduleRecompute();
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        recompute();
        setNarrativeReady(true);
      });
    });
    const settleTimer = window.setTimeout(() => {
      recompute();
      setNarrativeReady(true);
    }, 140);

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("scroll", scheduleRecompute);
      window.removeEventListener("resize", scheduleRecompute);
      window.removeEventListener("pageshow", onPageShow);
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      window.clearTimeout(settleTimer);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [recompute, scheduleRecompute]);

  const motionScale = useMemo(() => (reducedMotion ? 0.12 : 1), [reducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.narrative = dominantPhase;
    return () => {
      document.documentElement.removeAttribute("data-narrative");
    };
  }, [dominantPhase]);

  return {
    uniforms,
    dominantPhase,
    hotspot,
    particleZones,
    reducedMotion,
    motionScale,
    narrativeReady,
  };
}
