import { ApplyForm } from "@/components/landing/ApplyForm";
import { FaqSection } from "@/components/landing/FaqSection";
import { HeroIntro } from "@/components/landing/HeroIntro";
import { PartnersGrid } from "@/components/landing/PartnersGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { SectionDecor } from "@/components/landing/SectionDecor";
import { StudentsSection } from "@/components/landing/StudentsSection";
import { VideoLessonSection } from "@/components/landing/VideoLessonSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

function CtaSection() {
  return (
    <section id="act-apply" className="relative overflow-visible py-24">
      <SectionDecor
        items={[
          // footer-gradient-star большой overlay. Native SVG 2289x1564.
          // Figma center x = -461 + 2076/2 = 577; offsetX = 577 - 600 = -23.
          {
            src: "/figma/gradients/footer-gradient-star.svg",
            offsetX: -23,
            top: -407,
            width: 2289,
            height: 1564,
            opacity: 0.65,
          },
          // grid-5 слева сверху, flipped.
          {
            src: "/figma/gradients/grid-5.svg",
            offsetX: -481,
            top: -58,
            width: 500,
            height: 367,
            opacity: 0.3,
            flipY: true,
          },
          // grid-6 справа снизу, flipped.
          {
            src: "/figma/gradients/grid-6.svg",
            offsetX: 523,
            top: 277,
            width: 500,
            height: 367,
            opacity: 0.3,
            flipY: true,
          },
        ]}
      />

      <div className="relative mx-auto max-w-[820px] px-6">
        <div
          className="relative overflow-hidden rounded-[24px] border border-white/25 px-8 pb-12 pt-14 backdrop-blur-[18px] sm:px-12 md:backdrop-blur-[30px]"
          style={{
            background:
              "radial-gradient(110% 120% at 20% 100%, rgba(5, 59, 229, 0.55) 0%, rgba(1, 7, 29, 0.55) 55%, rgba(0, 0, 0, 0.4) 100%)",
          }}
        >
          <h2
            className="heading-gradient text-center font-semibold uppercase leading-[1.2] tracking-[-0.005em]"
            style={{
              fontFamily: "var(--font-inter-tight)",
              fontSize: "32px",
            }}
          >
            Бесплатный урок по международным стажировкам
          </h2>
          <p
            className="mx-auto mt-5 max-w-[580px] text-center text-[16px] leading-[1.5] text-white/65"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Получи мгновенный доступ к видеоурокам и материалам от опытных
            специалистов, которые прошли стажировки в ведущих компаниях мира.
          </p>
          <ApplyForm />
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative z-10 overflow-x-clip bg-black">
        <section id="act-hero">
          <HeroIntro />
        </section>

        <StudentsSection />
        <PricingSection />
        <VideoLessonSection />
        <PartnersGrid />
        <FaqSection />
        <CtaSection />

        <div className="mx-auto max-w-[1200px] px-8">
          <div className="h-px bg-white/10" />
        </div>

        <SiteFooter />
      </main>
    </>
  );
}
