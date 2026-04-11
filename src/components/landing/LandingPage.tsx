"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NarrativeCanvas from "@/components/canvas/NarrativeCanvas";
import { MENTORS } from "@/data/mentors";
import { TESTIMONIAL_SHORTS } from "@/data/testimonialVideos";
import { AiAssistantGuided } from "@/components/landing/AiAssistantGuided";
import { ApplyForm } from "@/components/landing/ApplyForm";
import { FounderSection } from "@/components/landing/FounderSection";
import { HeroIntro } from "@/components/landing/HeroIntro";
import { PartnerTicker } from "@/components/landing/PartnerTicker";
import { CASE_PARTNER_LOGOS } from "@/data/partners";
import { Reveal } from "@/components/landing/Reveal";
import { AtmosphereBackdrop } from "@/components/layout/AtmosphereBackdrop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ZERO_HOTSPOT } from "@/lib/narrative/hotspot";
import { INITIAL_PARTICLE_ZONES } from "@/lib/narrative/particleFieldZones";
import { DEFAULT_UNIFORMS } from "@/lib/narrative/types";
import { useNarrativeScroll } from "@/lib/narrative/useNarrativeScroll";
import { rectToVec4, toGlViewportRect } from "@/lib/narrative/viewportRects";

function ActLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)] text-balance md:mb-4">
      {children}
    </p>
  );
}

export function LandingPage() {
  const { motionScale, reducedMotion, narrativeReady } =
    useNarrativeScroll();
  const caseItems = TESTIMONIAL_SHORTS;
  const [fixedHeroZones, setFixedHeroZones] = useState(INITIAL_PARTICLE_ZONES);
  const mentorScrollRef = useRef<HTMLDivElement>(null);
  const [teamIndex, setTeamIndex] = useState(0);
  const [teamAnimating, setTeamAnimating] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    if (caseItems.length === 0) return;
    setActiveTestimonial((prev) => prev % caseItems.length);
  }, [caseItems.length]);

  useEffect(() => {
    const syncHeroZone = () => {
      const heroEl = document.getElementById("act-hero-content");
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const gl = toGlViewportRect(rect);
      const hasHero = gl.width > 0.004 && gl.height > 0.004;
      setFixedHeroZones({
        ...INITIAL_PARTICLE_ZONES,
        heroZone: hasHero ? rectToVec4(gl) : [0, 0, 0, 0],
        hasHeroZone: hasHero,
      });
    };

    // Keep sphere composition tied to the hero layout only.
    syncHeroZone();
    window.addEventListener("resize", syncHeroZone, { passive: true });
    return () => window.removeEventListener("resize", syncHeroZone);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (!mq.matches) return;

    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const t = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 60);

    return () => {
      window.clearTimeout(t);
      window.history.scrollRestoration = prev;
    };
  }, []);

  const maxTeamIndex = Math.max(0, MENTORS.length - 2);

  const getMentorStep = () => {
    const scroller = mentorScrollRef.current;
    if (!scroller) return 0;
    const firstCard = scroller.firstElementChild as HTMLElement | null;
    if (!firstCard) return 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const styles = window.getComputedStyle(scroller);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return cardWidth + gap;
  };

  const scrollMentorsBy = (direction: -1 | 1) => {
    const scroller = mentorScrollRef.current;
    if (!scroller) return;
    if (teamAnimating) return;
    const step = getMentorStep();
    if (!step) return;

    const targetIndex = Math.min(maxTeamIndex, Math.max(0, teamIndex + direction));
    if (targetIndex === teamIndex) return;

    const start = scroller.scrollLeft;
    const target = targetIndex * step;
    const duration = 680;
    const startedAt = performance.now();
    setTeamAnimating(true);

    const easeInOutQuint = (t: number) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

    const tick = (now: number) => {
      const p = Math.min(1, (now - startedAt) / duration);
      const e = easeInOutQuint(p);
      scroller.scrollLeft = start + (target - start) * e;
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTeamIndex(targetIndex);
        setTeamAnimating(false);
      }
    };
    requestAnimationFrame(tick);
  };

  return (
    <>
      <AtmosphereBackdrop />
      <SiteHeader />

      <main className="relative z-10 pt-[4.75rem] md:pt-[5.25rem]">
        <section
          id="act-hero"
          className="relative isolate flex min-h-[100dvh] flex-col justify-start overflow-hidden px-5 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-6 sm:px-6 md:min-h-[min(92vh,960px)] md:px-14 md:pb-14 md:pt-8 lg:px-20"
        >
          <HeroIntro />
          {narrativeReady ? (
            <NarrativeCanvas
              uniforms={DEFAULT_UNIFORMS.heroField}
              motionScale={motionScale}
              hotspot={ZERO_HOTSPOT}
              zones={fixedHeroZones}
              reducedMotion={reducedMotion}
            />
          ) : null}
        </section>

        <section
          id="act-credibility"
          className="border-t border-white/[0.06] px-5 sm:px-6 py-20 md:px-14 md:py-24 lg:px-20"
        >
          <Reveal className="mx-auto max-w-5xl text-center">
          <div>
            <ActLabel>С подтверждёнными результатами</ActLabel>
            <h2 className="font-[family-name:var(--font-serif)] text-[clamp(1.75rem,4vw,2.5rem)] font-normal tracking-tight text-[var(--text-primary)]">
              Партнёры
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
              Нам доверяют команды, которые нанимают за границей.
            </p>
          </div>
          </Reveal>
          <div className="mt-14 md:mt-16">
            <PartnerTicker />
          </div>
        </section>

        <section
          id="act-problem"
          className="min-h-screen px-5 sm:px-6 py-28 md:px-14 md:py-36 lg:px-20"
        >
          <ActLabel>Фрагментированный ландшафт</ActLabel>
          <Reveal className="mx-auto max-w-3xl">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl">
              Рынок глобальных возможностей большой. Без системы он воспринимается как шум.
            </h2>
            <ul className="mt-14 space-y-10 text-[17px] leading-relaxed text-[var(--text-muted)]">
              <li>
                Вакансии разбросаны по странам и форматам. Без системы легко теряется фокус.
              </li>
              <li>
                Профиль и позиционирование проседают, если нет связки от CV до интервью.
              </li>
              <li>
                Обычно проблема не в потенциале, а в отсутствии маршрута и поддержки.
              </li>
            </ul>
          </div>
          </Reveal>
        </section>

        <section
          id="act-route"
          className="min-h-[90vh] border-t border-white/[0.06] px-5 sm:px-6 py-28 md:px-14 md:py-32 lg:px-20"
        >
          <ActLabel>Маршрут</ActLabel>
          <Reveal className="mx-auto max-w-3xl">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl">
              Семь недель пошагового маршрута - не хаотичный набор советов.
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)]">
              Вы получаете один цельный трек: профиль, отклики, интервью и поддержка ментора.
            </p>
            <ol className="mt-12 list-none space-y-12 text-[17px] leading-relaxed text-[var(--text-muted)] md:mt-14">
              <li className="border-l border-white/10 pl-8">
                <span className="block text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Недели 1-2
                </span>
                <span className="mt-2 block text-[var(--text-primary)]">
                  Цель, позиционирование и география; тезис о роли - до массовых
                  откликов.
                </span>
              </li>
              <li className="border-l border-white/10 pl-8">
                <span className="block text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Недели 3-5
                </span>
                <span className="mt-2 block text-[var(--text-primary)]">
                  CV и LinkedIn, стратегия подачи, отклики и круги интервью с
                  обратной связью ментора.
                </span>
              </li>
              <li className="border-l border-white/10 pl-8">
                <span className="block text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Недели 6-7
                </span>
                <span className="mt-2 block text-[var(--text-primary)]">
                  Углубление в интервью и офферы, решения по предложениям и спокойная
                  передача дальше - по ситуации.
                </span>
              </li>
            </ol>
            <p className="mt-12 max-w-2xl border-t border-white/[0.08] pt-10 text-[14px] leading-relaxed text-[var(--text-muted)]">
              <span className="font-medium text-[var(--text-primary)]/90">
                Каркас программы:
              </span>{" "}
              7 недель маршрута, 3 уровня сопровождения (Silver / Gold / Diamond),
              до 9 месяцев доступа к материалам после основной части по условиям
              выбранного уровня.
            </p>
          </div>
          </Reveal>
        </section>

        <section
          id="act-support"
          className="min-h-[95vh] border-t border-white/[0.06] px-5 sm:px-6 py-28 md:px-14 md:py-32 lg:px-20"
        >
          <ActLabel>Команда</ActLabel>
          <Reveal className="mx-auto max-w-5xl">
            <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl">
                Команда Elevate.Interns
              </h2>
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)]">
                Профили команды, которая ведет участников от заявки до результата.
              </p>
            </div>
            <div className="mt-8 lg:mt-0" />
            </div>
            <div className="mt-12 flex items-start gap-4 md:gap-6">
              <div className="flex w-10 shrink-0 flex-col gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => scrollMentorsBy(-1)}
                  disabled={teamIndex <= 0}
                  className={`rounded-sm border border-white/12 bg-white/[0.02] px-3 py-2 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)] ${
                    teamIndex <= 0 ? "invisible pointer-events-none" : ""
                  }`}
                  aria-label="Прокрутить менторов влево"
                >
                  ←
                </button>
              </div>
              <div
                ref={mentorScrollRef}
                className={`no-scrollbar flex-1 flex items-start gap-8 overflow-x-auto pb-2 ${
                  teamAnimating ? "snap-none" : "snap-x snap-mandatory"
                }`}
              >
                {MENTORS.map((m) => (
                  <article
                    key={m.id}
                    className="w-[calc((100%-2rem)/2)] min-w-[calc((100%-2rem)/2)] shrink-0 snap-start"
                  >
                    <div className="relative mx-auto aspect-[4/5] w-[66%] overflow-hidden rounded-[12px] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(16,26,40,0.9)_0%,rgba(11,19,32,0.92)_100%)] shadow-[0_20px_60px_-34px_rgba(0,0,0,0.88)]">
                      <Image
                        src={m.photoSrc}
                        alt={
                          m.roleAboveName
                            ? `${m.role} ${m.name}`
                            : `${m.name}, ${m.role}`
                        }
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 768px) 44vw, 44vw"
                        className="object-cover object-center grayscale-[18%]"
                      />
                    </div>
                    <div className="mx-auto w-[66%] pt-4">
                      {m.roleAboveName ? (
                        <>
                          <p className="text-[13px] leading-relaxed text-[var(--text-primary)]/88">
                            {m.role}
                          </p>
                          <p className="mt-1 font-[family-name:var(--font-serif)] text-[1.45rem] leading-tight text-[var(--text-primary)]">
                            {m.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-[family-name:var(--font-serif)] text-[1.45rem] leading-tight text-[var(--text-primary)]">
                            {m.name}
                          </p>
                          <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-primary)]/88">
                            {m.role}
                          </p>
                        </>
                      )}
                      {m.intro.trim() ? (
                        <p className="mt-4 text-[12px] leading-relaxed text-[var(--text-muted)]">
                          {m.intro}
                        </p>
                      ) : null}
                      {m.details.length > 0 ? (
                        <div className="mt-4 space-y-3 text-[12px] leading-relaxed text-[var(--text-muted)]">
                          {m.details.map((block, i) => (
                            <p key={i} className="whitespace-pre-line">
                              {block}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
              <div className="flex w-10 shrink-0 flex-col gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => scrollMentorsBy(1)}
                  disabled={teamIndex >= maxTeamIndex}
                  className={`rounded-sm border border-white/12 bg-white/[0.02] px-3 py-2 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)] ${
                    teamIndex >= maxTeamIndex ? "invisible pointer-events-none" : ""
                  }`}
                  aria-label="Прокрутить менторов вправо"
                >
                  →
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          id="act-proof-metrics"
          className="min-h-[78vh] border-t border-white/[0.06] px-5 sm:px-6 py-28 md:px-14 md:py-32 lg:px-20"
          aria-labelledby="proof-metrics-heading"
        >
          <ActLabel>Доказательства · метрики</ActLabel>
          <Reveal className="mx-auto max-w-5xl">
          <div data-proof-status="pending-verified-outcomes">
            <h2
              id="proof-metrics-heading"
              className="max-w-2xl font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl"
            >
              Предварительные ориентиры - не аудированная отчётность
            </h2>
            <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-[var(--text-muted)]">
              Цифры ниже - рабочие ориентиры до публикации проверенных метрик по
              участникам, географиям и трудоустройству. После верификации данные
              будут обновлены; до этого момента блок не следует читать как
              финальные итоги программы.
            </p>
            <p
              className="mt-6 max-w-2xl rounded-sm border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-[var(--text-muted)]"
              role="note"
            >
              <span className="font-medium text-[var(--text-primary)]">
                Важно:
              </span>{" "}
              это не юридически или финансово аудированные показатели, а внутренние
              ориентиры для коммуникации прогресса.
            </p>
            <div className="mt-12 grid gap-10 text-center sm:mt-14 md:grid-cols-3 md:gap-8 md:text-left">
              <div className="md:border-r md:border-white/[0.06] md:pr-8">
                <p className="font-[family-name:var(--font-serif)] text-3xl text-[var(--text-primary)] md:text-[2.15rem]">
                  120+
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Студентов в структурированных когортах - ориентир до верификации.
                </p>
              </div>
              <div className="md:border-r md:border-white/[0.06] md:pr-8">
                <p className="font-[family-name:var(--font-serif)] text-3xl text-[var(--text-primary)] md:text-[2.15rem]">
                  14
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Рынков с движением к офферу - ориентир до верификации.
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-serif)] text-3xl text-[var(--text-primary)] md:text-[2.15rem]">
                  84%
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Сигнал интервью или оффера в окне - ориентир до верификации.
                </p>
              </div>
            </div>
          </div>
          </Reveal>
        </section>

        <section
          id="act-proof-cases"
          className="min-h-[72vh] border-t border-white/[0.06] px-5 sm:px-6 py-24 md:px-14 md:py-28 lg:px-20"
          aria-labelledby="proof-cases-heading"
        >
          <ActLabel>Доказательства · кейсы</ActLabel>
          <Reveal className="mx-auto max-w-5xl">
          <div>
            <h2
              id="proof-cases-heading"
              className="max-w-2xl font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl"
            >
              Кейсы
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)]">
              Видео и визуальные кейсы участников в одном потоке.
            </p>
            <div className="mt-14">
              <div className="relative overflow-hidden p-1 md:p-2">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                >
                  {caseItems.map((v) => (
                    <div key={v.id} className="w-full shrink-0 px-1 md:px-2">
                      <div className="mx-auto max-w-[292px] overflow-hidden rounded-sm border border-white/[0.08] bg-black/25 shadow-[0_20px_60px_-36px_rgba(0,0,0,0.9)]">
                        <div className="relative aspect-[9/16] w-full">
                          {v.imageSrc ? (
                            <Image
                              src={v.imageSrc}
                              alt={v.label}
                              fill
                              sizes="292px"
                              className="object-cover object-center"
                            />
                          ) : v.videoSrc ? (
                            <video
                              className="absolute inset-0 h-full w-full border-0 object-cover"
                              controls
                              playsInline
                              preload="metadata"
                              aria-label={v.label}
                            >
                              <source src={v.videoSrc} type="video/mp4" />
                            </video>
                          ) : (
                            <iframe
                              title={v.label}
                              src={`https://www.youtube.com/embed/${v.id}`}
                              className="absolute inset-0 h-full w-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          )}
                        </div>
                        <div className="min-h-[4.5rem] border-t border-white/[0.08] bg-gradient-to-b from-black/45 to-black/55 px-4 py-3.5 text-left">
                          {v.name || v.role || v.outcomeLine ? (
                            <div className="space-y-1.5">
                              {v.name ? (
                                <p className="text-[14px] font-medium leading-snug tracking-tight text-[var(--text-primary)]">
                                  {v.name}
                                </p>
                              ) : null}
                              {v.role ? (
                                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]/95">
                                  {v.role}
                                </p>
                              ) : null}
                              {v.outcomeLine ? (
                                <p className="pt-0.5 text-[13px] leading-relaxed text-[var(--text-muted)]">
                                  {v.outcomeLine}
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                              {v.label}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {caseItems.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveTestimonial(i)}
                      className={`h-1.5 w-6 rounded-full transition ${
                        i === activeTestimonial ? "bg-[var(--accent)]" : "bg-white/20"
                      }`}
                      aria-label={`Перейти к отзыву ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-12 md:mt-14">
              <PartnerTicker logos={CASE_PARTNER_LOGOS} variant="compact" />
            </div>
          </div>
          </Reveal>
        </section>

        <section
          id="act-depth"
          className="min-h-[90vh] border-t border-white/[0.06] px-5 sm:px-6 py-28 md:px-14 md:py-32 lg:px-20"
        >
          <ActLabel>Глубина участия</ActLabel>
          <Reveal className="mx-auto max-w-5xl">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl">
              Три уровня сопровождения - одна семинедельная программа.
            </h2>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--text-muted)]">
              Silver, Gold и Diamond: форматы участия, а не «пакеты», от системы и
              направления до глубокой работы с ментором. В ряду читайте слева
              направо; на узком экране сверху вниз. Стоимость и детали обсуждаются отдельно,
              после заявки и разговора с командой.
            </p>
            <div className="relative mt-18">
              <div
                className="pointer-events-none absolute inset-0 -z-10"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(ellipse 44% 62% at 50% 42%, rgba(79,125,255,0.1) 0%, rgba(79,125,255,0.03) 40%, transparent 78%)",
                }}
              />
              <div className="grid gap-6 md:grid-cols-3 md:gap-6">
              {[
                {
                  title: "Silver",
                  subtitle: "Для первого системного выхода на международные стажировки.",
                  buttonLabel: "Начать с Silver",
                  includeLabel: "Включено",
                  bullets: [
                    "Фокус на рынке и позиционировании до массовых откликов",
                    "Упаковка CV и LinkedIn под международные стажировки",
                    "Базовая система подачи и откликов с маршрутом на 7 недель",
                  ],
                },
                {
                  title: "Gold",
                  subtitle: "Оптимальный темп с плотной обратной связью и сопровождением.",
                  buttonLabel: "Выбрать Gold",
                  includeLabel: "Все из Silver, плюс",
                  highlight: true,
                  bullets: [
                    "Регулярная обратная связь по материалам и стратегии откликов",
                    "Сопровождение на пути к откликам и интервью",
                    "Более быстрый темп относительно Silver при той же программе",
                  ],
                },
                {
                  title: "Diamond",
                  subtitle: "Максимум персонализации и приоритетная индивидуальная работа.",
                  buttonLabel: "Обсудить Diamond",
                  includeLabel: "Все из Gold, плюс",
                  bullets: [
                    "Индивидуальный маршрут под целевые компании и роли",
                    "Приоритетное сопровождение и большая глубина персонализации",
                    "Акцент на сильных работодателях - по ситуации участника",
                  ],
                },
              ].map((col, colIndex) => (
                <div
                  key={col.title}
                  id={`act-depth-col-${colIndex}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[14px] px-7 py-7 shadow-[0_20px_46px_-30px_rgba(0,0,0,0.86)] transition-[transform,box-shadow,background-color] duration-[280ms] ease-out hover:-translate-y-[2px] md:px-8 md:py-8 ${
                    col.highlight
                      ? "bg-[linear-gradient(180deg,rgba(46,72,140,0.36)_0%,rgba(23,35,64,0.72)_58%,rgba(10,14,20,0.03)_100%)] shadow-[0_22px_56px_-34px_rgba(0,0,0,0.9)] hover:shadow-[0_24px_58px_-34px_rgba(0,0,0,0.92)]"
                      : "bg-[linear-gradient(180deg,rgba(31,48,90,0.36)_0%,rgba(18,28,50,0.68)_58%,rgba(10,14,20,0.03)_100%)] hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  <div
                    className="pointer-events-none absolute inset-[1px] rounded-[13px]"
                    aria-hidden
                    style={{
                      border: "1px solid rgba(255,255,255,0.035)",
                      maskImage: "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.48) 58%, rgba(0,0,0,0.06) 100%)",
                      WebkitMaskImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.48) 58%, rgba(0,0,0,0.06) 100%)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-5 top-0 h-7 rounded-b-[16px] opacity-35"
                    aria-hidden
                    style={{
                      background:
                        col.highlight
                          ? "linear-gradient(180deg, rgba(150,176,240,0.1) 0%, rgba(150,176,240,0) 100%)"
                          : "linear-gradient(180deg, rgba(230,236,250,0.05) 0%, rgba(230,236,250,0) 100%)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(10,14,20,0) 0%, rgba(10,14,20,0.5) 58%, rgba(10,14,20,0.86) 100%)",
                    }}
                  />
                  <p className={`text-[11px] uppercase tracking-[0.2em] ${col.highlight ? "text-[var(--text-primary)]/95" : "text-[var(--text-primary)]/82"}`}>
                    {col.title}
                  </p>
                  {col.highlight ? (
                    <p className="mt-3 inline-flex w-fit rounded-full border border-[var(--accent)]/30 bg-[linear-gradient(180deg,rgba(79,125,255,0.2)_0%,rgba(79,125,255,0.08)_100%)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-primary)]/94">
                      Recommended
                    </p>
                  ) : null}
                  <p className={`mt-5 min-h-[3.8rem] text-[15px] leading-[1.55] ${col.highlight ? "text-[var(--text-primary)]/95" : "text-[var(--text-muted)]"}`}>
                    {col.subtitle}
                  </p>
                  <a
                    href="#act-apply"
                    className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-[9px] border px-4 text-[13px] font-medium transition-[background-color,color,box-shadow,border-color] duration-[240ms] ease-out ${
                      col.highlight
                        ? "border-[var(--accent)]/28 bg-[linear-gradient(180deg,rgba(67,102,198,0.2)_0%,rgba(46,74,146,0.18)_100%)] text-[var(--text-primary)] shadow-none hover:border-[var(--accent)]/38 hover:bg-[linear-gradient(180deg,rgba(67,102,198,0.25)_0%,rgba(46,74,146,0.22)_100%)]"
                        : "border-white/16 bg-[rgba(7,11,20,0.22)] text-[var(--text-primary)]/92 hover:border-white/26 hover:bg-[rgba(18,28,50,0.38)]"
                    }`}
                  >
                    {col.buttonLabel}
                  </a>
                  <p className="mt-7 text-[12px] font-medium text-[var(--text-primary)]/90">
                    {col.includeLabel}
                  </p>
                  <ul className="mt-3 list-none space-y-2.5 text-[13px] leading-[1.68] text-[var(--text-primary)]/84">
                    {col.bullets.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]/58" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <p className="text-[12px] leading-relaxed text-[var(--text-muted)]/90">
                      Стоимость подбирается индивидуально после заявки.
                    </p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
          </Reveal>
        </section>

        <div className="border-t border-white/[0.06] px-5 py-14 text-center md:px-14 lg:px-20">
          <a
            href="#act-apply"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--accent)] bg-[var(--accent)] px-8 py-3.5 text-sm font-medium text-[var(--bg-deep)] transition hover:bg-transparent hover:text-[var(--text-primary)]"
          >
            Подать заявку
          </a>
          <p className="mx-auto mt-4 max-w-md text-[13px] text-[var(--text-muted)]">
            Короткий контакт - команда подскажет формат и ответит на вопросы по программе.
          </p>
        </div>

        <section
          id="act-ai"
          className="border-t border-white/[0.06] px-5 sm:px-6 py-28 md:px-14 md:py-32 lg:px-20"
        >
          <ActLabel>AI-ассистент</ActLabel>
          <Reveal className="mx-auto max-w-3xl">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl">
              Ответы перед заявкой без лишней сложности.
            </h2>
            <p className="mt-8 text-[17px] leading-relaxed text-[var(--text-muted)]">
              Нажмите вопрос и сразу получите короткий ориентир по формату, стоимости
              и следующему шагу.
            </p>
            <div id="act-ai-panel">
              <AiAssistantGuided />
            </div>
          </div>
          </Reveal>
        </section>

        <FounderSection />

        <section
          id="act-apply"
          className="min-h-[70vh] border-t border-white/[0.06] px-5 sm:px-6 py-28 md:px-14 md:pb-40 md:pt-32 lg:px-20"
        >
          <ActLabel>Заявка</ActLabel>
          <Reveal className="mx-auto max-w-xl">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl">
              Первый шаг к международной стажировке
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-[var(--text-muted)]">
              Оставьте контакт. Команда подскажет формат, стоимость и следующий шаг.
              На этом этапе без обязательств.
            </p>
            <ApplyForm />
            <p className="mt-8 text-center text-[13px] leading-relaxed text-[var(--text-muted)] md:text-left">
              Нужна консультация до заявки?{" "}
              <a
                className="text-[var(--text-primary)] underline decoration-white/20 underline-offset-4 transition hover:decoration-[var(--accent)]/60"
                href="https://wa.me/77755107079"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Связаться с менеджером в WhatsApp"
              >
                Связаться с менеджером
              </a>
              <span className="mt-2 block text-[12px] text-[var(--text-muted)]">
                Ответ команды - в рабочие часы.
              </span>
            </p>
          </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
