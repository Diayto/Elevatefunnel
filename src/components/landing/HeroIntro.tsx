import Image from "next/image";

export function HeroIntro() {
  return (
    <div
      id="act-hero-content"
      className="relative mx-auto w-full overflow-x-clip bg-black lg:min-h-[760px]"
      style={{
        fontFamily: "var(--font-inter-tight)",
      }}
    >
      {/* Blob top-right (blob-1) */}
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
          priority={false}
          className="h-full w-full max-lg:scale-[0.55]"
        />
      </div>

      {/* Blob bottom-left (blob-2) */}
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
          priority={false}
          className="h-full w-full max-lg:scale-[0.5]"
        />
      </div>

      {/* Grid — на мобилке меньше и слабее, как в Figma */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-[140px] z-[2] h-[min(320px,46vh)] w-[min(92vw,420px)] select-none opacity-35 sm:top-[160px] lg:top-[220px] lg:h-[480px] lg:w-[660px] lg:opacity-55"
      >
        <Image
          src="/figma/gradients/grid-1.svg"
          alt=""
          width={660}
          height={480}
          priority={false}
          className="h-full w-full object-cover object-right"
        />
      </div>

      {/* До lg — колонка (текст 328px, изометрия ниже); lg+ — как на десктопе */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pb-10 pt-[104px] sm:pt-[112px] lg:flex-row lg:items-start lg:justify-between lg:px-8 lg:pb-0 lg:pt-[170px]">
        <div className="fade-up relative z-[6] flex w-full max-w-[328px] shrink-0 flex-col lg:max-w-[720px] lg:self-start">
          <h1
            className="break-words text-[24px] font-normal leading-[1.25] tracking-[-0.008em] text-white lg:text-[44px] lg:leading-[1.15] lg:tracking-[-0.01em]"
            style={{
              fontFamily: "var(--font-inter-tight)",
              textShadow: "0px 4px 24px rgba(0,0,0,0.35)",
            }}
          >
            Первая организация в СНГ которая помогает студентам{" "}
            <span
              className="bg-clip-text font-semibold text-transparent"
              style={{
                fontFamily: "var(--font-inter-tight)",
                backgroundImage:
                  "linear-gradient(90deg, #19A8EA 35.096%, #006FFF 62.981%)",
              }}
            >
              за 45 дней получить международную стажировку
            </span>{" "}
            в самых топовых компаниях мира.
          </h1>

          <p
            className="mt-4 max-w-full text-pretty text-[16px] leading-[1.35] text-white/95 lg:mt-5 lg:max-w-[520px] lg:text-[20px] lg:leading-[1.4]"
            style={{
              fontFamily: "var(--font-inter-tight)",
              textShadow: "0px 0px 15px black",
            }}
          >
            Наши студенты проходят стажировки в AIFC, Samsung, Mastercard, Big4,
            ООН и других топ-компаниях
          </p>

          <a
            href="#act-apply"
            className="glow-btn mt-6 inline-flex w-full max-w-[328px] items-center justify-center rounded-full text-[16px] font-semibold leading-6 text-white sm:w-auto lg:mt-10 lg:max-w-none lg:w-fit lg:text-[17px]"
            style={{
              fontFamily: "var(--font-inter-tight)",
              paddingInline: "30px",
              paddingBlock: "10px",
              letterSpacing: "-0.3px",
              backgroundImage:
                "linear-gradient(180deg, #3D9EFF 0%, #053BE5 15%, #053BE5 85%, #0078F0 100%)",
              border: "1px solid #0080FF",
              boxShadow: "0px 0px 18px 0px #4675FF",
              fontFeatureSettings: "'zero' 1",
            }}
          >
            Получить бесплатный урок
          </a>
        </div>

        <div className="pointer-events-none relative z-[5] mt-6 w-full max-w-[min(100%,375px)] shrink-0 select-none lg:absolute lg:right-4 lg:top-[220px] lg:mt-0 lg:h-[470px] lg:w-[640px] lg:max-w-none">
          <Image
            src="/figma/graphics/hero-image-desktop.svg"
            alt="Маршрут: Discipline → Skills → Resume → Interview → Internship → Career"
            width={640}
            height={470}
            priority
            className="mx-auto h-auto w-full lg:mx-0 lg:h-full lg:w-full"
            sizes="(max-width: 1023px) 360px, 640px"
          />
        </div>
      </div>
    </div>
  );
}
