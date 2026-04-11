"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { PARTNER_LOGOS } from "@/data/partners";

/**
 * Одна и та же линейная скорость для верхней строки и строки под кейсами:
 * длительность цикла = (половина scrollWidth) / MARQUEE_PX_PER_SEC.
 * (Анимация сдвигает на -50%, т.е. ровно одну «копию» набора логотипов.)
 */
const MARQUEE_PX_PER_SEC = 74;

type PartnerLogo = {
  name: string;
  src: string;
  scale?: number;
};

type Props = {
  className?: string;
  logos?: readonly PartnerLogo[];
  /** Узкий ряд (половинный слот) — для тикера под «Кейсы». */
  variant?: "default" | "compact";
};

export function PartnerTicker({
  className = "",
  logos = PARTNER_LOGOS,
  variant = "default",
}: Props) {
  const items = [...logos, ...logos];
  const compact = variant === "compact";
  const rowRef = useRef<HTMLDivElement>(null);
  const [durationSec, setDurationSec] = useState(46);

  /** Зазор между слотами (верхняя строка): −20% от 3rem / 4rem. */
  const gapDefaultClass = "gap-[2.4rem] md:gap-[3.2rem]";
  /**
   * Компакт: тот же шаг «центр — центр», что у больших слотов:
   * (slot_default + gap) = (slot_compact + gap_compact) → gap_compact = Δslot + gap.
   */
  const gapCompactClass =
    "gap-[calc(150px+2.4rem)] md:gap-[calc(166px+3.2rem)]";

  const rowClass = compact
    ? `partner-marquee partner-marquee-force flex w-max flex-nowrap items-center ${gapCompactClass} py-2.5`
    : `partner-marquee partner-marquee-force flex w-max flex-nowrap items-center ${gapDefaultClass} py-5`;

  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const measure = () => {
      const full = el.scrollWidth;
      if (full <= 1) return;
      const half = full / 2;
      const sec = Math.max(12, Math.min(240, half / MARQUEE_PX_PER_SEC));
      setDurationSec(sec);
    };

    measure();
    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [logos.length, variant]);

  const slotClass = compact
    ? "relative h-10 w-[150px] shrink-0 md:h-[2.75rem] md:w-[166px]"
    : "relative h-20 w-[300px] shrink-0 md:h-[5.5rem] md:w-[332px]";

  const imageSizes = compact ? "166px" : "332px";

  return (
    <div className={`relative ${className}`}>
      <div
        className="mx-auto max-w-6xl overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
      >
        <div
          ref={rowRef}
          className={rowClass}
          style={{ animationDuration: `${durationSec}s` }}
        >
          {items.map((logo, i) => (
            <div key={`${logo.name}-${i}`} className={slotClass}>
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes={imageSizes}
                unoptimized={logo.src.endsWith(".svg")}
                className="object-contain p-1 opacity-95 transition-opacity hover:opacity-100"
                style={{ transform: `scale(${logo.scale ?? 1})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
