"use client";

/**
 * Sits above WebGL, below content: depth without “space” branding.
 * Tuning via html[data-narrative] in globals.css.
 */
export function AtmosphereBackdrop() {
  return (
    <div
      className="elevate-atmo pointer-events-none fixed inset-0 z-0"
      aria-hidden
    >
      <div
        className="elevate-atmo-glow absolute inset-0 transition-opacity duration-[1.8s] ease-out"
        style={{
          background:
            "linear-gradient(180deg, rgba(112, 153, 255, 0.12) 0%, rgba(46, 73, 146, 0.08) 22%, rgba(10, 14, 20, 0) 54%), radial-gradient(ellipse 140% 92% at 14% -8%, rgba(93, 137, 255, 0.2) 0%, rgba(64, 96, 186, 0.1) 33%, transparent 62%), radial-gradient(ellipse 108% 74% at 84% 11%, rgba(70, 96, 176, 0.1) 0%, transparent 52%)",
        }}
      />
      <div
        className="elevate-atmo-floor absolute inset-0 transition-opacity duration-[1.85s] ease-out"
        style={{
          background:
            "radial-gradient(ellipse 95% 55% at 50% 118%, rgba(16, 24, 44, 0.68) 0%, transparent 60%)",
        }}
      />
      <div
        className="elevate-atmo-side absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(105deg, rgba(8, 12, 18, 0.55) 0%, transparent 32%, transparent 68%, rgba(8, 12, 18, 0.45) 100%)",
        }}
      />
      <div
        className="elevate-atmo-vignette absolute inset-0 transition-opacity duration-[1.8s] ease-out"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 0%, rgba(4, 6, 10, 0.55) 100%)",
        }}
      />
      <div
        className="elevate-atmo-noise absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
          backgroundSize: "220px 220px",
        }}
      />
    </div>
  );
}
