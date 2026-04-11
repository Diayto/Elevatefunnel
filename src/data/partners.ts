/** Логотипы / имена для тикера доверия (credibility). */
export const CASE_PARTNERS = [
  "Halyk",
  "MOST",
  "KPMG",
  "AIFC",
  "United Nations",
  "Samsung",
  "Bazis",
  "Owlto",
  "Deloitte",
  "Mastercard",
  "BI Group",
  "EY",
] as const;

/**
 * Лого для бегущей строки под блоком «Кейсы» (компании из практики участников).
 * В массиве только те бренды, для которых есть файлы в /public/partners.
 * Остальные из CASE_PARTNERS (MOST, AIFC, Bazis, Owlto, BI Group) — без ассетов в репозитории.
 */
export const CASE_PARTNER_LOGOS = [
  { name: "Halyk", src: "/partners/halyk.svg", scale: 1.3 },
  { name: "KPMG", src: "/partners/kpmg.svg", scale: 1.3 },
  { name: "United Nations", src: "/partners/united-nations.svg", scale: 1.8 },
  { name: "Samsung", src: "/partners/samsung-white.svg", scale: 1 },
  { name: "Deloitte", src: "/partners/deloitte.svg", scale: 1 },
  { name: "Mastercard", src: "/partners/mastercard.svg", scale: 1.4 },
  { name: "EY", src: "/partners/ey.svg", scale: 1.8 },
] as const;

/** Лого для бегущей строки (SVG + PNG). */
export const PARTNER_LOGOS = [
  { name: "TEDx KIMEP", src: "/partners/tedx-kimep-new.png", scale: 0.68 },
  { name: "Jasa", src: "/partners/jasa.svg", scale: 1.5 },
  { name: "Rerio", src: "/partners/rerio.svg", scale: 1.8 },
  { name: "Crest X", src: "/partners/x-crest-new.png", scale: 2 },
  { name: "Young Ala", src: "/partners/young-ala.svg", scale: 3.92 },
  { name: "Run", src: "/partners/run-new.png", scale: 1.4 },
  { name: "Grants", src: "/partners/grants.svg", scale: 2.3 },
  { name: "KIMEP University", src: "/partners/kimep-new.png", scale: 0.8 },
  { name: "Linkly", src: "/partners/linkly-new.png", scale: 0.8 },
  { name: "Snake", src: "/partners/snake-new.png", scale: 1.2 },
] as const;
