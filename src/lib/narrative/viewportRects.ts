/** Normalized viewport rect: origin bottom-left (matches gl_FragCoord / shader screen01). */
export type GlViewportRect = {
  left: number;
  bottom: number;
  width: number;
  height: number;
};

export function toGlViewportRect(r: DOMRect): GlViewportRect {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1;
  const vh = typeof window !== "undefined" ? window.innerHeight : 1;
  return {
    left: r.left / vw,
    width: r.width / vw,
    bottom: 1 - (r.top + r.height) / vh,
    height: r.height / vh,
  };
}

export function rectToVec4(r: GlViewportRect): [number, number, number, number] {
  return [r.left, r.bottom, r.width, r.height];
}
