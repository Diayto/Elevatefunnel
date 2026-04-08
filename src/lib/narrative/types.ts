export type ParticleStateId =
  | "heroField"
  | "credibilityField"
  | "chaosField"
  | "routeField"
  | "supportField"
  | "aiField"
  | "proofField"
  | "proofMetricsField"
  | "proofCasesField"
  | "proofEcosystemField"
  | "depthField"
  | "calmField";

export type ParticleUniforms = {
  density: number;
  cohesion: number;
  directionStrength: number;
  flowSpeed: number;
  noise: number;
  dispersion: number;
  glow: number;
  globalAlpha: number;
  routeSwirl: number;
  networkTension: number;
  ribbonBand: number;
  volumeDepth: number;
  /**
   * Shell vs volume: higher = thinner shell (clearer globe); lower = deeper scatter.
   */
  shellIntegrity: number;
  /**
   * Reduce particle presence in the hero / primary text band (model-space heuristic).
   * Higher in hero; lower when the field should feel full (e.g. chaos).
   */
  contentBreath: number;
  /** Loss of order — fragmented field (problem). */
  fieldDisorder: number;
  /** Great-circle / guided trajectory organization (how it works). */
  routeArc: number;
  /** Soft multi-hub attraction — infrastructure / intelligence (support, AI). */
  hubField: number;
  /** Sparse anchoring — constellation of outcomes (proof). */
  constellation: number;
  /** Field quiets and visually recedes (final CTA / calm). */
  fieldRecede: number;
  /**
   * 1 = hero «sand»: ~2s birth/death, chaotic paths; 0 = classic volumetric field.
   * Blended while scrolling between acts.
   */
  sandLifecycle: number;
};

export const DEFAULT_UNIFORMS: Record<ParticleStateId, ParticleUniforms> = {
  heroField: {
    density: 0.98,
    cohesion: 0.96,
    directionStrength: 0.08,
    flowSpeed: 0.25,
    noise: 0.078,
    dispersion: 0.07,
    glow: 0.065,
    globalAlpha: 1.0,
    routeSwirl: 0.04,
    networkTension: 0.05,
    ribbonBand: 0.06,
    volumeDepth: 0.16,
    shellIntegrity: 0.995,
    fieldDisorder: 0.38,
    routeArc: 0.05,
    hubField: 0.05,
    constellation: 0.05,
    fieldRecede: 0.0,
    contentBreath: 0.32,
    sandLifecycle: 1,
  },
  credibilityField: {
    density: 1.0,
    cohesion: 0.9,
    directionStrength: 0.07,
    flowSpeed: 0.13,
    noise: 0.06,
    dispersion: 0.09,
    glow: 0.09,
    globalAlpha: 0.84,
    routeSwirl: 0.06,
    networkTension: 0.1,
    ribbonBand: 0.08,
    volumeDepth: 0.55,
    shellIntegrity: 0.78,
    fieldDisorder: 0.12,
    routeArc: 0.12,
    hubField: 0.1,
    constellation: 0.08,
    fieldRecede: 0.02,
    contentBreath: 0.48,
    sandLifecycle: 0,
  },
  chaosField: {
    density: 0.78,
    cohesion: 0.22,
    directionStrength: 0.26,
    flowSpeed: 0.26,
    noise: 0.48,
    dispersion: 0.44,
    glow: 0.05,
    globalAlpha: 0.7,
    routeSwirl: 0.08,
    networkTension: 0.06,
    ribbonBand: 0.1,
    volumeDepth: 0.34,
    shellIntegrity: 0.18,
    fieldDisorder: 0.92,
    routeArc: 0.12,
    hubField: 0.06,
    constellation: 0.1,
    fieldRecede: 0.0,
    contentBreath: 0.06,
    sandLifecycle: 0,
  },
  routeField: {
    density: 1.0,
    cohesion: 0.78,
    directionStrength: 0.24,
    flowSpeed: 0.16,
    noise: 0.08,
    dispersion: 0.12,
    glow: 0.1,
    globalAlpha: 0.83,
    routeSwirl: 0.55,
    networkTension: 0.2,
    ribbonBand: 0.17,
    volumeDepth: 0.5,
    shellIntegrity: 0.56,
    fieldDisorder: 0.12,
    routeArc: 0.94,
    hubField: 0.12,
    constellation: 0.11,
    fieldRecede: 0.0,
    contentBreath: 0.26,
    sandLifecycle: 0,
  },
  supportField: {
    density: 0.97,
    cohesion: 0.76,
    directionStrength: 0.1,
    flowSpeed: 0.12,
    noise: 0.09,
    dispersion: 0.12,
    glow: 0.09,
    globalAlpha: 0.8,
    routeSwirl: 0.12,
    networkTension: 0.48,
    ribbonBand: 0.09,
    volumeDepth: 0.53,
    shellIntegrity: 0.52,
    fieldDisorder: 0.1,
    routeArc: 0.22,
    hubField: 0.72,
    constellation: 0.12,
    fieldRecede: 0.0,
    contentBreath: 0.36,
    sandLifecycle: 0,
  },
  aiField: {
    density: 0.92,
    cohesion: 0.74,
    directionStrength: 0.1,
    flowSpeed: 0.13,
    noise: 0.11,
    dispersion: 0.14,
    glow: 0.09,
    globalAlpha: 0.78,
    routeSwirl: 0.14,
    networkTension: 0.52,
    ribbonBand: 0.12,
    volumeDepth: 0.46,
    shellIntegrity: 0.5,
    fieldDisorder: 0.14,
    routeArc: 0.22,
    hubField: 0.68,
    constellation: 0.16,
    fieldRecede: 0.0,
    contentBreath: 0.36,
    sandLifecycle: 0,
  },
  proofField: {
    density: 0.88,
    cohesion: 0.86,
    directionStrength: 0.08,
    flowSpeed: 0.11,
    noise: 0.08,
    dispersion: 0.12,
    glow: 0.1,
    globalAlpha: 0.76,
    routeSwirl: 0.08,
    networkTension: 0.22,
    ribbonBand: 0.1,
    volumeDepth: 0.44,
    shellIntegrity: 0.62,
    fieldDisorder: 0.1,
    routeArc: 0.12,
    hubField: 0.28,
    constellation: 0.72,
    fieldRecede: 0.0,
    contentBreath: 0.32,
    sandLifecycle: 0,
  },
  proofMetricsField: {
    density: 1.04,
    cohesion: 0.9,
    directionStrength: 0.06,
    flowSpeed: 0.09,
    noise: 0.06,
    dispersion: 0.09,
    glow: 0.1,
    globalAlpha: 0.83,
    routeSwirl: 0.05,
    networkTension: 0.18,
    ribbonBand: 0.06,
    volumeDepth: 0.4,
    shellIntegrity: 0.6,
    fieldDisorder: 0.06,
    routeArc: 0.08,
    hubField: 0.22,
    constellation: 0.9,
    fieldRecede: 0.0,
    contentBreath: 0.28,
    sandLifecycle: 0,
  },
  proofCasesField: {
    density: 0.86,
    cohesion: 0.92,
    directionStrength: 0.05,
    flowSpeed: 0.08,
    noise: 0.05,
    dispersion: 0.08,
    glow: 0.08,
    globalAlpha: 0.72,
    routeSwirl: 0.04,
    networkTension: 0.14,
    ribbonBand: 0.05,
    volumeDepth: 0.38,
    shellIntegrity: 0.62,
    fieldDisorder: 0.05,
    routeArc: 0.06,
    hubField: 0.18,
    constellation: 0.84,
    fieldRecede: 0.0,
    contentBreath: 0.26,
    sandLifecycle: 0,
  },
  proofEcosystemField: {
    density: 0.96,
    cohesion: 0.82,
    directionStrength: 0.09,
    flowSpeed: 0.12,
    noise: 0.09,
    dispersion: 0.12,
    glow: 0.1,
    globalAlpha: 0.78,
    routeSwirl: 0.14,
    networkTension: 0.44,
    ribbonBand: 0.13,
    volumeDepth: 0.52,
    shellIntegrity: 0.52,
    fieldDisorder: 0.11,
    routeArc: 0.16,
    hubField: 0.52,
    constellation: 0.68,
    fieldRecede: 0.0,
    contentBreath: 0.34,
    sandLifecycle: 0,
  },
  depthField: {
    density: 0.99,
    cohesion: 0.62,
    directionStrength: 0.1,
    flowSpeed: 0.11,
    noise: 0.12,
    dispersion: 0.16,
    glow: 0.09,
    globalAlpha: 0.78,
    routeSwirl: 0.1,
    networkTension: 0.3,
    ribbonBand: 0.12,
    volumeDepth: 0.55,
    shellIntegrity: 0.44,
    fieldDisorder: 0.18,
    routeArc: 0.18,
    hubField: 0.32,
    constellation: 0.18,
    fieldRecede: 0.04,
    contentBreath: 0.36,
    sandLifecycle: 0,
  },
  calmField: {
    density: 0.32,
    cohesion: 0.92,
    directionStrength: 0.03,
    flowSpeed: 0.06,
    noise: 0.03,
    dispersion: 0.05,
    glow: 0.04,
    globalAlpha: 0.28,
    routeSwirl: 0.02,
    networkTension: 0.06,
    ribbonBand: 0.04,
    volumeDepth: 0.2,
    shellIntegrity: 0.38,
    fieldDisorder: 0.06,
    routeArc: 0.05,
    hubField: 0.08,
    constellation: 0.08,
    fieldRecede: 0.82,
    contentBreath: 0.12,
    sandLifecycle: 0,
  },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpUniforms(a: ParticleUniforms, b: ParticleUniforms, t: number): ParticleUniforms {
  const k = Math.min(1, Math.max(0, t));
  return {
    density: lerp(a.density, b.density, k),
    cohesion: lerp(a.cohesion, b.cohesion, k),
    directionStrength: lerp(a.directionStrength, b.directionStrength, k),
    flowSpeed: lerp(a.flowSpeed, b.flowSpeed, k),
    noise: lerp(a.noise, b.noise, k),
    dispersion: lerp(a.dispersion, b.dispersion, k),
    glow: lerp(a.glow, b.glow, k),
    globalAlpha: lerp(a.globalAlpha, b.globalAlpha, k),
    routeSwirl: lerp(a.routeSwirl, b.routeSwirl, k),
    networkTension: lerp(a.networkTension, b.networkTension, k),
    ribbonBand: lerp(a.ribbonBand, b.ribbonBand, k),
    volumeDepth: lerp(a.volumeDepth, b.volumeDepth, k),
    shellIntegrity: lerp(a.shellIntegrity, b.shellIntegrity, k),
    fieldDisorder: lerp(a.fieldDisorder, b.fieldDisorder, k),
    routeArc: lerp(a.routeArc, b.routeArc, k),
    hubField: lerp(a.hubField, b.hubField, k),
    constellation: lerp(a.constellation, b.constellation, k),
    fieldRecede: lerp(a.fieldRecede, b.fieldRecede, k),
    contentBreath: lerp(a.contentBreath, b.contentBreath, k),
    sandLifecycle: lerp(a.sandLifecycle, b.sandLifecycle, k),
  };
}

const UNIFORM_KEYS: (keyof ParticleUniforms)[] = [
  "density",
  "cohesion",
  "directionStrength",
  "flowSpeed",
  "noise",
  "dispersion",
  "glow",
  "globalAlpha",
  "routeSwirl",
  "networkTension",
  "ribbonBand",
  "volumeDepth",
  "shellIntegrity",
  "fieldDisorder",
  "routeArc",
  "hubField",
  "constellation",
  "fieldRecede",
  "contentBreath",
  "sandLifecycle",
];

/** Weighted average of particle uniforms (scroll-phase overlap = smooth morph). */
export function blendUniformsWeighted(
  items: { uniforms: ParticleUniforms; weight: number }[],
): ParticleUniforms {
  const sum = items.reduce((acc, it) => acc + it.weight, 0);
  if (sum < 1e-8) {
    return { ...DEFAULT_UNIFORMS.heroField };
  }
  const out = { ...DEFAULT_UNIFORMS.heroField };
  for (const key of UNIFORM_KEYS) {
    out[key] = items.reduce((acc, it) => acc + it.uniforms[key] * it.weight, 0) / sum;
  }
  return out;
}
