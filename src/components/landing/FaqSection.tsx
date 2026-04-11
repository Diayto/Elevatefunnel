"use client";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Как устроена программа по времени?",
    a: "Семинедельный маршрут с фокусом на профиль, стратегию откликов и подготовку к интервью. Детали формата и загрузки согласуются после заявки.",
  },
  {
    q: "Где узнать стоимость и условия участия?",
    a: "Стоимость и формат обсуждаются с командой после заявки или запроса консультации, без обязательств на первом шаге.",
  },
  {
    q: "Что с доступом к материалам после основных семи недель?",
    a: "По выбранному уровню сопровождения предусмотрен доступ к материалам до девяти месяцев после основной части; конкретика при разборе формата.",
  },
  {
    q: "Как связаться, если не готов оставлять заявку?",
    a: "Можно написать менеджеру в WhatsApp: ответ в рабочие часы; ссылка есть рядом с формой заявки.",
  },
];

export function FaqSection() {
  return (
    <section
      id="act-faq"
      className="border-t border-white/[0.06] px-5 sm:px-6 py-24 md:px-14 md:py-28 lg:px-20"
      aria-labelledby="faq-heading"
    >
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)] md:mb-4">
        Вопросы
      </p>
      <h2
        id="faq-heading"
        className="max-w-2xl font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)] md:text-4xl"
      >
        Коротко о формате и следующем шаге
      </h2>
      <div className="mx-auto mt-12 max-w-2xl space-y-2">
        {ITEMS.map((item) => (
          <details
            key={item.q}
            className="group border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition hover:border-white/[0.12]"
          >
            <summary className="cursor-pointer list-none text-[15px] font-medium text-[var(--text-primary)] [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {item.q}
                <span
                  className="mt-0.5 shrink-0 text-[var(--text-muted)] transition group-open:rotate-180"
                  aria-hidden
                >
                  ↓
                </span>
              </span>
            </summary>
            <p className="mt-3 border-t border-white/[0.06] pt-3 text-[14px] leading-relaxed text-[var(--text-muted)]">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
