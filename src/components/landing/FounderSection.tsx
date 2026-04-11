import { Reveal } from "@/components/landing/Reveal";

/**
 * Левая колонка — встроенное видео команды (YouTube).
 */
export function FounderSection() {
  return (
    <section
      id="act-founder"
      className="border-t border-white/[0.06] px-5 sm:px-6 py-24 md:px-14 md:py-28 lg:px-20"
      aria-labelledby="founder-heading"
    >
      <Reveal className="mx-auto max-w-5xl">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)] md:mb-4">
          Люди за системой
        </p>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[16/10] w-full max-w-lg overflow-hidden rounded-sm border border-white/[0.1] bg-black/30 shadow-[0_32px_90px_-48px_rgba(0,0,0,0.9)] lg:aspect-[4/3]">
            <iframe
              title="Сообщение команды Elevate.Interns"
              src="https://www.youtube.com/embed/4tZ2VoDWrLs"
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div>
            <h2
              id="founder-heading"
              className="font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl"
            >
              Программа держится на дисциплине и человеческом контакте
            </h2>
            <p className="mt-8 text-[17px] leading-relaxed text-[var(--text-muted)]">
              За маршрутом стоят реальные люди: отбор, сопровождение и обратная связь.
              Мы даём не обещания, а понятную систему действий.
            </p>
            <p className="mt-6 border-l border-[var(--accent)]/35 pl-5 text-[14px] leading-relaxed text-[var(--text-muted)]">
              Если вы подаёте заявку, вы имеете дело с командой, а не с безликой воронкой:
              разговор о формате, ожиданиях и следующих шагах - это часть нормальной работы программы.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
