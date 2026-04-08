import type { ParticleStateId } from "./types";

/**
 * DOM ids ↔ particulate states — keep in sync with `LandingPage` sections.
 *
 * Wide-field particulate (see `ParticleUniforms` / `DEFAULT_UNIFORMS`):
 * hero → calm slab + content breathing; credibility → handoff; problem → disorder;
 * route → guided streams; support / AI → hub lattice; proof* → constellation;
 * depth → transitional; calm / apply → recede + quiet.
 */
export const NARRATIVE_ANCHORS: readonly { id: string; state: ParticleStateId }[] = [
  { id: "act-hero", state: "heroField" },
  { id: "act-credibility", state: "credibilityField" },
  { id: "act-problem", state: "chaosField" },
  { id: "act-route", state: "routeField" },
  { id: "act-support", state: "supportField" },
  { id: "act-proof-metrics", state: "proofMetricsField" },
  { id: "act-proof-cases", state: "proofCasesField" },
  { id: "act-depth", state: "depthField" },
  { id: "act-ai", state: "aiField" },
  { id: "act-founder", state: "calmField" },
  { id: "act-apply", state: "calmField" },
] as const;
