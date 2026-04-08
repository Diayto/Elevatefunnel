/** Normalized hotspot for fragment shader (matches gl_FragCoord space). */
export type NarrativeHotspot = {
  nx: number;
  ny: number;
  /** Radius as fraction of min(viewport w, h). */
  nr: number;
  /** 0 = off. */
  strength: number;
};

export const ZERO_HOTSPOT: NarrativeHotspot = {
  nx: 0.5,
  ny: 0.5,
  nr: 0.4,
  strength: 0,
};

export function computeHotspotFromElement(
  el: HTMLElement | null,
  weight: number,
  vw: number,
  vh: number,
): NarrativeHotspot {
  if (!el || weight < 0.06 || vw < 1 || vh < 1) {
    return ZERO_HOTSPOT;
  }
  const r = el.getBoundingClientRect();
  const nx = (r.left + r.width * 0.5) / vw;
  const ny = (vh - (r.top + r.height * 0.5)) / vh;
  const nr =
    (Math.max(r.width, r.height) / Math.min(vw, vh)) * 0.48;
  const strength = Math.min(0.78, weight * 0.78);
  return {
    nx: Math.min(1, Math.max(0, nx)),
    ny: Math.min(1, Math.max(0, ny)),
    nr: Math.min(0.95, Math.max(0.08, nr)),
    strength,
  };
}

/**
 * Wider, lower-gain bias — local change in material density, not a card spotlight.
 */
export function computeSignalHotspot(
  el: HTMLElement | null,
  weight: number,
  vw: number,
  vh: number,
): NarrativeHotspot {
  if (!el || weight < 0.045 || vw < 1 || vh < 1) {
    return ZERO_HOTSPOT;
  }
  const r = el.getBoundingClientRect();
  const nx = (r.left + r.width * 0.5) / vw;
  const ny = (vh - (r.top + r.height * 0.5)) / vh;
  const nr = (Math.max(r.width, r.height) / Math.min(vw, vh)) * 0.68;
  const strength = Math.min(0.34, weight * 0.32);
  return {
    nx: Math.min(1, Math.max(0, nx)),
    ny: Math.min(1, Math.max(0, ny)),
    nr: Math.min(0.95, Math.max(0.14, nr)),
    strength,
  };
}
