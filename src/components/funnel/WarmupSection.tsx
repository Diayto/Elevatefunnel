import Image from "next/image";
import { FUNNEL_SECTION_IDS } from "@/lib/funnel/config";

export function WarmupSection() {
  return (
    <section
      id={FUNNEL_SECTION_IDS.warmup}
      className="relative overflow-visible py-20 lg:py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 select-none opacity-35"
      >
        <Image
          src="/figma/gradients/blob-7.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[760px] px-4 text-center sm:px-8">
        <h2
          className="heading-gradient font-semibold uppercase leading-[1.2] tracking-[-0.005em]"
          style={{ fontSize: "clamp(26px, 3.5vw, 36px)" }}
        >
          Почему нельзя пропускать консультацию?
        </h2>
        <p className="mt-6 text-pretty text-[16px] leading-[1.6] text-white/70 lg:text-[18px]">
          За следующие 40–50 минут вы получите персональный разбор своего
          профиля, поймёте, какие ошибки мешают получить международную
          стажировку, и увидите пошаговый план действий. Ниже вы также сможете
          посмотреть результаты студентов, которые уже прошли этот путь вместе с
          нами.
        </p>
      </div>
    </section>
  );
}
