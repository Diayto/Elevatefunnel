"use client";

import { useState } from "react";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

const TOPICS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "q1",
    question: "Кому подойдёт эта программа?",
    answer:
      "Программа подойдёт студентам 1-4 курса из любой точки мира, которые хотят выйти на международную стажировку, но пока не понимают, как выстроить сильный профиль, правильно подаваться и конкурировать за лучшие возможности. Неважно, из какой ты страны и на каком уровне стартуешь сейчас - важно, что у тебя есть цель и готовность системно двигаться к ней.",
  },
  {
    id: "q2",
    question: "Подойдёт ли программа, если у меня ещё нет опыта?",
    answer:
      "Да, именно для таких студентов программа особенно ценна. Большинство сильных карьер не начинается с большого опыта - они начинаются с правильной стратегии. Мы помогаем выстроить профиль, упаковать твои сильные стороны, усилить резюме и подготовиться к откликам так, чтобы ты выглядел сильнее большинства кандидатов с похожим стартом.",
  },
  {
    id: "q3",
    question: "Что я получу за время программы?",
    answer:
      "За 7 недель ты получишь не просто знания, а систему выхода на международные стажировки. Это включает понимание карьерного направления, усиление CV и LinkedIn, стратегию отклика, подготовку к интервью и более ясную карьерную траекторию. После завершения основной части у тебя также сохраняется 9 месяцев доступа к материалам и инфраструктуре программы.",
  },
  {
    id: "q4",
    question: "Как проходит программа?",
    answer:
      "Программа построена как пошаговый 7-недельный маршрут. Сначала ты определяешь цель и карьерный вектор, затем усиливаешь профиль, готовишь материалы для отклика, выстраиваешь стратегию подачи и проходишь подготовку к интервью. Это не хаотичный набор уроков, а структурированный путь от стартовой точки к реальным возможностям.",
  },
  {
    id: "q5",
    question: "В чём разница между уровнями участия?",
    answer:
      "Уровни отличаются глубиной сопровождения и объёмом персональной поддержки. Базовый формат даёт систему, материалы и направление. Более глубокие форматы добавляют регулярную работу с ментором, персональную обратную связь, более глубокую стратегию и индивидуальную проработку. То есть ты выбираешь не просто доступ, а уровень вовлечённости наставников в твой результат.",
  },
  {
    id: "q6",
    question: "Сколько времени нужно уделять программе?",
    answer:
      "В среднем достаточно нескольких часов в неделю, если ты проходишь программу в нормальном темпе и реально внедряешь рекомендации. Но чем серьёзнее ты относишься к заданиям, откликам и подготовке, тем сильнее будет результат. Программа помогает не распыляться, а двигаться по понятной системе без лишнего хаоса.",
  },
  {
    id: "q7",
    question: "Это только для студентов из СНГ?",
    answer:
      "Нет. Программа подходит студентам из любой точки мира. Если твоя цель - международная стажировка, география не ограничивает участие. Наоборот, мы делаем акцент на глобальном рынке и на том, как выстраивать путь к международным возможностям вне зависимости от страны, в которой ты сейчас находишься.",
  },
  {
    id: "q8",
    question: "Почему мне стоит начать сейчас, а не потом?",
    answer:
      "Потому что международный профиль не строится за один день. Пока одни студенты откладывают, другие уже усиливают резюме, проходят подготовку, получают интервью и выходят на более сильные карьерные возможности. Чем раньше ты начнёшь действовать системно, тем выше шанс получить значимый опыт уже во время учёбы.",
  },
  {
    id: "q9",
    question: "Сколько стоит программа?",
    answer:
      "Стоимость зависит от выбранного уровня участия и глубины сопровождения. У нас несколько форматов, поэтому финальная стоимость определяется тем, какой уровень поддержки, персонализации и работы с ментором тебе подходит. Чтобы узнать актуальную стоимость, оставь заявку - менеджеры помогут подобрать подходящий формат и подробно всё расскажут.",
  },
  {
    id: "q10",
    question: "Какие есть варианты оплаты?",
    answer:
      "Оплату можно произвести из любой точки мира. Мы принимаем оплату по всему миру и предлагаем гибкие условия: можно оплатить программу полностью или выбрать оплату по частям. Чтобы узнать доступные варианты именно для твоего формата участия, оставь заявку, и менеджеры подскажут все детали.",
  },
];

export function AiAssistantGuided() {
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const current = TOPICS[active] ?? TOPICS[0];
  const maxIndex = TOPICS.length - 1;

  const focusTab = (index: number) => {
    const safe = Math.max(0, Math.min(maxIndex, index));
    const id = `ai-topic-${TOPICS[safe]?.id}`;
    const next = document.getElementById(id) as HTMLButtonElement | null;
    next?.focus();
  };

  const onTabKeyDown = (index: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = index >= maxIndex ? 0 : index + 1;
      setActive(next);
      focusTab(next);
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = index <= 0 ? maxIndex : index - 1;
      setActive(prev);
      focusTab(prev);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
      focusTab(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActive(maxIndex);
      focusTab(maxIndex);
    }
  };

  return (
    <div className="mt-10 md:mt-12">
      <div className="rounded-sm border border-white/[0.09] bg-[var(--bg-mid)]/35 p-4 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.85)] backdrop-blur-md md:p-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]/90">
              AI-ассистент
            </p>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">
              Готовые ответы на ключевые вопросы перед заявкой.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            online
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
          <div
            className="no-scrollbar max-h-[420px] space-y-2 overflow-y-auto rounded-sm border border-white/[0.08] bg-black/15 p-2.5"
            role="tablist"
            aria-label="Список вопросов ассистента"
          >
            {TOPICS.map((t, i) => {
              const selected = i === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  id={`ai-topic-${t.id}`}
                  aria-controls="ai-answer-panel"
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKeyDown(i, e)}
                  className={`w-full rounded-sm border px-3 py-2.5 text-left text-[12px] leading-relaxed transition ${
                    selected
                      ? "border-[var(--accent)]/42 bg-[var(--accent)]/12 text-[var(--text-primary)]"
                      : "border-white/10 bg-white/[0.02] text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-primary)]"
                  }`}
                  style={reduced ? undefined : { transitionDuration: "0.2s" }}
                >
                  {t.question}
                </button>
              );
            })}
          </div>

          <div
            id="ai-answer-panel"
            role="tabpanel"
            aria-labelledby={`ai-topic-${current.id}`}
            className="rounded-sm border border-white/[0.07] bg-black/20 p-4 md:p-5"
          >
            <div className="flex justify-end">
              <div className="max-w-[92%] rounded-[14px] rounded-br-[4px] border border-white/10 bg-white/[0.02] px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Вопрос
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--text-primary)]">
                  {current.question}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-start">
              <div className="max-w-[95%] rounded-[14px] rounded-bl-[4px] border border-[var(--accent)]/26 bg-[linear-gradient(180deg,rgba(79,125,255,0.12)_0%,rgba(79,125,255,0.05)_100%)] px-4 py-3.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]/85">
                  Ответ ассистента
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-primary)]/90">
                  {current.answer}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-[var(--text-muted)]">
              Это подготовленные ответы для быстрого ориентирования перед заявкой.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
