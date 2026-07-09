import Image from "next/image";
import { FUNNEL_SECTION_IDS } from "@/lib/funnel/config";
import { GlowButton } from "@/components/funnel/GlowButton";

export function OfferHero() {
  return (
    <div
      id={FUNNEL_SECTION_IDS.offer}
      className="relative mx-auto w-full overflow-x-clip bg-black lg:min-h-[720px]"
      style={{ fontFamily: "var(--font-inter-tight)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute select-none max-lg:opacity-75"
        style={{
          right: "-140px",
          top: "-135px",
          width: "761px",
          height: "749px",
          zIndex: 1,
          opacity: 0.9,
          transform: "rotate(-120.88deg) scaleY(-1)",
        }}
      >
        <Image
          src="/figma/gradients/blob-1.svg"
          alt=""
          width={761}
          height={749}
          className="h-full w-full max-lg:scale-[0.55]"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute select-none max-lg:opacity-75"
        style={{
          left: "-303px",
          bottom: "-204px",
          width: "746px",
          height: "707px",
          zIndex: 1,
          opacity: 0.9,
          transform: "rotate(167.68deg) scaleY(-1)",
        }}
      >
        <Image
          src="/figma/gradients/blob-2.svg"
          alt=""
          width={746}
          height={707}
          className="h-full w-full max-lg:scale-[0.5]"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-[140px] z-[2] h-[min(320px,46vh)] w-[min(92vw,420px)] select-none opacity-35 sm:top-[160px] lg:top-[220px] lg:h-[480px] lg:w-[660px] lg:opacity-55"
      >
        <Image
          src="/figma/gradients/grid-1.svg"
          alt=""
          width={660}
          height={480}
          className="h-full w-full object-cover object-right"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pb-16 pt-[120px] sm:pt-[128px] lg:items-start lg:px-8 lg:pb-20 lg:pt-[180px]">
        <div className="fade-up relative z-[6] w-full max-w-[720px]">
          <h1
            className="heading-gradient text-[28px] font-semibold uppercase leading-[1.2] tracking-[-0.008em] lg:text-[44px]"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Стратегическая сессия от Elevate.Interns
          </h1>

          <p
            className="mt-5 max-w-[640px] text-pretty text-[16px] leading-[1.45] text-white/80 lg:text-[20px] lg:leading-[1.5]"
            style={{
              fontFamily: "var(--font-inter-tight)",
              textShadow: "0px 0px 15px black",
            }}
          >
            Помогаем студентам 1–4 курса получать международные стажировки в
            ведущих компаниях мира, получать реальный опыт, усиливать резюме и
            строить карьеру ещё во время учебы.
          </p>

          <GlowButton
            as="a"
            href={`#${FUNNEL_SECTION_IDS.video}`}
            className="mt-8 h-[48px] px-8 text-[16px] lg:mt-10 lg:text-[17px]"
          >
            Далее
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
