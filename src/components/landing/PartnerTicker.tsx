"use client";

import Image from "next/image";
import { PARTNER_LOGOS } from "@/data/partners";

type Props = {
  className?: string;
};

export function PartnerTicker({ className = "" }: Props) {
  const items = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div className={`relative ${className}`}>
      <div
        className="mx-auto max-w-6xl overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
      >
        <div
          className="partner-marquee partner-marquee-force flex w-max flex-nowrap items-center gap-10 py-3 md:gap-14"
          style={{ animationDuration: "46s" }}
        >
          {items.map((logo, i) => (
            <div key={`${logo.name}-${i}`} className="relative h-10 w-[150px] shrink-0 md:h-11 md:w-[166px]">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="166px"
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
