declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", "Lead");
  } catch {
    /* pixel optional */
  }
}
