export type ParticleQualityTier = "full" | "reduced";

export type StratumLayer = {
  count: number;
  stratum: number;
  fieldKind: 0 | 1 | 2;
};

/** Desktop — readable points + volumetric read; density tuned in hero uniforms. */
export const STRATA_FULL: StratumLayer[] = [
  { count: 8_400, stratum: 0, fieldKind: 0 },
  { count: 7_000, stratum: 1, fieldKind: 1 },
  { count: 2_300, stratum: 2, fieldKind: 2 },
  { count: 1_150, stratum: 3, fieldKind: 1 },
];

/** Mobile / reduced-motion — proportionally fewer. */
export const STRATA_REDUCED: StratumLayer[] = [
  { count: 5_000, stratum: 0, fieldKind: 0 },
  { count: 4_200, stratum: 1, fieldKind: 1 },
  { count: 1_400, stratum: 2, fieldKind: 2 },
  { count: 700, stratum: 3, fieldKind: 1 },
];

export function getStrataForTier(tier: ParticleQualityTier): StratumLayer[] {
  return tier === "full" ? STRATA_FULL : STRATA_REDUCED;
}
