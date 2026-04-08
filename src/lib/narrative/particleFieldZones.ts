import type { NarrativeHotspot } from "./hotspot";

/** DOM-synced data for the particulate layer (scroll + resize). */
export type ParticleFieldZones = {
  /** vec4: left, bottom, width, height — GL-normalized; width/height 0 = unused */
  heroZone: [number, number, number, number];
  hasHeroZone: boolean;
  depthZones: [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
  ];
  /** Scroll visibility of act-depth (0–1). */
  depthStrength: number;
  hotspotProof: NarrativeHotspot;
  hotspotAI: NarrativeHotspot;
};

export const INITIAL_PARTICLE_ZONES: ParticleFieldZones = {
  heroZone: [0, 0, 0, 0],
  hasHeroZone: false,
  depthZones: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  depthStrength: 0,
  hotspotProof: { nx: 0.5, ny: 0.5, nr: 0.35, strength: 0 },
  hotspotAI: { nx: 0.5, ny: 0.5, nr: 0.35, strength: 0 },
};
