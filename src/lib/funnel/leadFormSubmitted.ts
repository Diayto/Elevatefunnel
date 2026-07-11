export const LEAD_FORM_SUBMITTED_KEY = "elevate-funnel-lead-submitted";

export function readLeadFormSubmitted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(LEAD_FORM_SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markLeadFormSubmitted(): void {
  try {
    localStorage.setItem(LEAD_FORM_SUBMITTED_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}
