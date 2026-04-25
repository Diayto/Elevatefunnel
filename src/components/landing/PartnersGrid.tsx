import Image from "next/image";
import { SectionDecor } from "@/components/landing/SectionDecor";

type Partner = {
  name: string;
  src: string;
};
const CARD_WIDTH = 176;
const CARD_GAP = 20;

const PARTNERS: Partner[] = [
  { name: "young.ala", src: "/figma/partners/youngala.svg" },
  { name: "KIMEP University", src: "/figma/partners/KimepUniversity.svg" },
  { name: "J", src: "/figma/partners/J.svg" },
  { name: "Monako Agency", src: "/figma/partners/Monako Agency.svg" },
  { name: "Linkly", src: "/figma/partners/Linkly.svg" },
  { name: "TEDx KIMEP", src: "/figma/partners/TedKimep.svg" },
  { name: "AIESEC", src: "/figma/partners/aiesec.svg" },
  { name: "ERIO", src: "/figma/partners/erio.svg" },
  { name: "Grants", src: "/figma/partners/grants.svg" },
  { name: "Imperial College London", src: "/figma/partners/imperial.svg" },
];

/** Карточка логотипа: как в Figma (Elevate-Interns, Partners) — 173×100, фон и чередование обводки. */
function PartnerLogoSlot({
  partner: p,
  ariaHidden,
}: {
  partner: Partner;
  ariaHidden?: boolean;
}) {
  return (
    <Image
      aria-hidden={ariaHidden ? true : undefined}
      src={p.src}
      alt={ariaHidden ? "" : p.name}
      width={176}
      height={102}
      className="h-[102px] w-[176px] shrink-0"
      unoptimized
    />
  );
}

export function PartnersGrid() {
  const oneCycleWidth = PARTNERS.length * CARD_WIDTH + (PARTNERS.length - 1) * CARD_GAP;
  // Медленная скорость ленты: спокойно читаются и по очереди показываются все партнёры.
  const marqueeDurationSec = Math.max(1, Math.round(oneCycleWidth / 21));

  return (
    <section
      id="act-partners"
      className="relative overflow-visible py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
      aria-labelledby="act-partners-heading"
    >
      <SectionDecor
        items={[
          { src: "/figma/gradients/blob-6.svg", offsetX: 528, top: -319, width: 970, height: 970, opacity: 0.7 },
        ]}
      />

      <div className="relative mx-auto max-w-[1200px] px-8">
        <div className="flex justify-center">
          <span className="section-icon-box">
            <Image src="/figma/icons/gift-icon.svg" alt="" width={24} height={24} />
          </span>
        </div>
        <h2
          id="act-partners-heading"
          className="heading-gradient mt-5 text-center text-[clamp(1.75rem,5vw,2.75rem)] font-semibold uppercase leading-[1.2] tracking-[-0.005em] lg:text-[44px]"
          style={{ fontFamily: "var(--font-inter-tight)" }}
        >
          Партнёры
        </h2>
      </div>

      {/* Одна бегущая строка на всех ширинах; без сетки и без «квадратных» карточек */}
      <div
        className="partner-marquee-wrap relative mx-auto mt-10 max-w-[1200px] overflow-hidden px-8"
        aria-label="Логотипы партнёров"
      >
        <div
          className="partner-marquee flex w-max gap-5"
          style={{
            animation: `partner-marquee ${marqueeDurationSec}s linear infinite`,
            animationPlayState: "running",
          }}
        >
          {PARTNERS.map((p) => (
            <PartnerLogoSlot key={p.name} partner={p} />
          ))}
          {PARTNERS.map((p) => (
            <PartnerLogoSlot key={`dup-${p.name}`} partner={p} ariaHidden />
          ))}
        </div>
      </div>
    </section>
  );
}
