"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GlowButton } from "@/components/funnel/GlowButton";
import {
  getVisibleQuestions,
  isPageValid,
  LEAD_AGE_OPTIONS,
  LEAD_FORM_INTRO,
  LEAD_FORM_PAGES,
  type LeadFormData,
  type LeadFormQuestion,
  labelForOption,
  serializeMultiValue,
} from "@/lib/funnel/leadFormConfig";
import { trackMetaLead } from "@/lib/metaPixel";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";
import {
  formatVideosWatched,
  serializeWatchState,
  type VideoWatchState,
} from "@/lib/funnel/videoWatch";

type LeadFormOverlayProps = {
  open: boolean;
  onClose: () => void;
  watchState: VideoWatchState;
  onSubmitted: () => void;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const INPUT_CLASS =
  "mt-3 w-full rounded-[12px] border border-[#282828] bg-[#111] px-4 py-3.5 text-[15px] text-white outline-none transition-all duration-300 placeholder:text-[#6e6e6e] focus:border-[#0078F0] focus:shadow-[0_0_0_3px_rgba(0,120,240,0.15)] disabled:opacity-60";

const TEXTAREA_CLASS = `${INPUT_CLASS} min-h-[120px] resize-y leading-[1.5]`;

function ChoiceOption({
  selected,
  onClick,
  letter,
  children,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  letter: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-3 text-left text-[15px] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
        selected
          ? "border-[#0080FF] bg-[rgba(5,59,229,0.28)] text-white shadow-[0_0_16px_-6px_#4675FF]"
          : "border-[#282828] bg-[#111] text-white/85 hover:border-white/20"
      }`}
    >
      <span
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border text-[12px] font-semibold ${
          selected ? "border-[#0080FF]/60 bg-[#053BE5]/40" : "border-white/12 bg-white/5"
        }`}
      >
        {letter}
      </span>
      <span className="leading-[1.35]">{children}</span>
    </button>
  );
}

function QuestionBlock({
  question,
  data,
  onChange,
  disabled,
}: {
  question: LeadFormQuestion;
  data: LeadFormData;
  onChange: (id: string, value: string | string[]) => void;
  disabled?: boolean;
}) {
  const label = (
    <p className="text-[17px] font-medium leading-[1.4] text-white sm:text-[18px]">
      {question.number}. {question.label}
      {question.required ? <span className="text-[#3D9EFF]"> *</span> : null}
    </p>
  );

  if (question.type === "text") {
    return (
      <div>
        {label}
        <input
          type="text"
          value={typeof data[question.id] === "string" ? data[question.id] : ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          disabled={disabled}
          className={INPUT_CLASS}
        />
      </div>
    );
  }

  if (question.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          value={typeof data[question.id] === "string" ? data[question.id] : ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          disabled={disabled}
          rows={question.rows ?? 4}
          className={TEXTAREA_CLASS}
        />
      </div>
    );
  }

  if (question.type === "single") {
    const selected = typeof data[question.id] === "string" ? data[question.id] : "";
    return (
      <div>
        {label}
        <div className="mt-3 grid gap-2">
          {question.options.map((option, index) => (
            <ChoiceOption
              key={option.value}
              letter={String.fromCharCode(65 + index)}
              selected={selected === option.value}
              onClick={() => onChange(question.id, option.value)}
              disabled={disabled}
            >
              {option.label}
            </ChoiceOption>
          ))}
        </div>
      </div>
    );
  }

  const rawValue = data[question.id];
  const selected: string[] = Array.isArray(rawValue) ? rawValue : [];
  return (
    <div>
      {label}
      <div className="mt-3 grid gap-2">
        {question.options.map((option, index) => {
          const isSelected = selected.includes(option.value);
          return (
            <ChoiceOption
              key={option.value}
              letter={String.fromCharCode(65 + index)}
              selected={isSelected}
              onClick={() => {
                const next = isSelected
                  ? selected.filter((v) => v !== option.value)
                  : [...selected, option.value];
                onChange(question.id, next);
              }}
              disabled={disabled}
            >
              {option.label}
            </ChoiceOption>
          );
        })}
      </div>
    </div>
  );
}

export function LeadFormOverlay({ open, onClose, watchState, onSubmitted }: LeadFormOverlayProps) {
  const reduced = useReducedMotionSafe();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState<LeadFormData>({});
  const [website, setWebsite] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPages = LEAD_FORM_PAGES.length;
  const currentPage = LEAD_FORM_PAGES[pageIndex];
  const isLastPage = pageIndex === totalPages - 1;
  const pageValid = currentPage ? isPageValid(currentPage, data) : false;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setWebsite("");
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && submitStatus !== "submitting") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, submitStatus]);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    }
  }, [open, pageIndex, reduced]);

  const resetForm = useCallback(() => {
    setPageIndex(0);
    setData({});
    setSubmitStatus("idle");
    setErrorMessage(null);
  }, []);

  const handleClose = useCallback(() => {
    if (submitStatus === "submitting") return;
    onClose();
    window.setTimeout(resetForm, reduced ? 0 : 280);
  }, [onClose, reduced, resetForm, submitStatus]);

  const handleChange = useCallback((id: string, value: string | string[]) => {
    setData((prev) => {
      const next = { ...prev, [id]: value };
      if (id === "status" && value !== "studying" && value !== "studying_working") {
        delete next.course;
      }
      return next;
    });
    setErrorMessage(null);
  }, []);

  const goBack = () => {
    if (pageIndex === 0) {
      handleClose();
      return;
    }
    setErrorMessage(null);
    setPageIndex((p) => Math.max(0, p - 1));
  };

  const goNext = () => {
    if (!pageValid) return;
    setErrorMessage(null);
    setPageIndex((p) => Math.min(p + 1, totalPages - 1));
  };

  const buildPayload = useMemo(() => {
    const get = (key: string) => (typeof data[key] === "string" ? String(data[key]).trim() : "");
    const multi = (key: string) =>
      Array.isArray(data[key]) ? serializeMultiValue(data[key] as string[]) : "";

    return {
      name: get("name"),
      age: labelForOption(LEAD_AGE_OPTIONS, get("age")),
      age_value: get("age"),
      country: get("country"),
      status: get("status"),
      course: get("course"),
      specialty: get("specialty"),
      interest_reason: get("interest_reason"),
      internship_understanding: get("internship_understanding"),
      career_importance: get("career_importance"),
      experience: get("experience"),
      english_level: get("english_level"),
      english_certificate: get("english_certificate"),
      internship_field: get("internship_field"),
      target_countries: get("target_countries"),
      start_timing: get("start_timing"),
      financial_situation: get("financial_situation"),
      financial_decision: get("financial_decision"),
      career_blockers: get("career_blockers"),
      consultation_goals: multi("consultation_goals"),
      additional_notes: get("additional_notes"),
      contact: get("contact"),
      website,
      videos_watched: formatVideosWatched(watchState),
      watch_log: serializeWatchState(watchState),
    };
  }, [data, watchState, website]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastPage || !pageValid || submitStatus === "submitting") return;

    setErrorMessage(null);
    setSubmitStatus("submitting");

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload),
      });

      const raw = await res.text();
      let parsed: { ok?: boolean; error?: string } = {};
      try {
        if (raw.trim()) parsed = JSON.parse(raw) as { ok?: boolean; error?: string };
      } catch {
        /* non-JSON */
      }

      if (!res.ok || !parsed.ok) {
        setSubmitStatus("error");
        if (parsed.error === "webhook_unauthorized") {
          setErrorMessage(
            "Ошибка связи с Google Таблицей: не совпадает секрет. Проверьте GOOGLE_SHEETS_WEBHOOK_SECRET на Vercel и WEBHOOK_SECRET в Apps Script.",
          );
        } else if (parsed.error === "not_configured") {
          setErrorMessage("Форма не настроена на сервере. Добавьте GOOGLE_SHEETS_WEBHOOK_URL в Vercel.");
        } else if (parsed.error === "rate_limited") {
          setErrorMessage("Слишком много попыток. Подождите несколько минут.");
        } else {
          setErrorMessage("Попробуйте ещё раз");
        }
        return;
      }

      setSubmitStatus("success");
      trackMetaLead();
      onSubmitted();
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Попробуйте ещё раз");
    }
  };

  const pageMotion = reduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-[#050508]"
      role="dialog"
      aria-modal="true"
      aria-label="Анкета для консультации"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5,59,229,0.35) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(0,120,240,0.12) 0%, transparent 50%)",
        }}
      />

      <div ref={scrollRef} className="relative flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-[640px] px-5 py-8 sm:px-8 sm:py-12">
          {submitStatus === "success" ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#0080FF]/40 bg-[rgba(5,59,229,0.2)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12l5 5L19 7"
                    stroke="#3D9EFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2
                className="heading-gradient mt-8 font-semibold uppercase leading-[1.2]"
                style={{ fontSize: "clamp(26px, 4vw, 34px)" }}
              >
                Успешно отправлено
              </h2>
              <p className="mt-5 max-w-[420px] text-[17px] leading-[1.55] text-white/70">
                Менеджер с вами свяжется, спасибо большое.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-10 text-[15px] text-white/55 underline underline-offset-4 transition hover:text-white"
              >
                Вернуться на страницу
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={goBack}
                disabled={submitStatus === "submitting"}
                className="inline-flex items-center gap-2 text-[14px] text-white/50 transition hover:text-white disabled:opacity-40"
              >
                <span aria-hidden>←</span>
                {pageIndex === 0 ? "Вернуться на страницу" : "Назад"}
              </button>

              <form onSubmit={onSubmit} noValidate className="mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage?.id}
                    {...pageMotion}
                    transition={{ duration: reduced ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {currentPage?.showIntro ? (
                      <header className="mb-10">
                        <p className="text-[28px] leading-none" aria-hidden>
                          👋
                        </p>
                        <h1
                          className="heading-gradient mt-4 font-semibold uppercase leading-[1.15] tracking-[-0.005em]"
                          style={{ fontSize: "clamp(26px, 4.5vw, 36px)" }}
                        >
                          {LEAD_FORM_INTRO.title}
                        </h1>
                        <p className="mt-5 text-[17px] font-medium text-white/90">
                          {LEAD_FORM_INTRO.greeting}
                        </p>
                        <p className="mt-3 text-[15px] leading-[1.55] text-white/60">
                          {LEAD_FORM_INTRO.description}
                        </p>
                      </header>
                    ) : null}

                    {currentPage?.sectionHeading ? (
                      <h2 className="mb-8 text-[22px] font-semibold text-white sm:text-[24px]">
                        {currentPage.sectionHeading}
                      </h2>
                    ) : null}

                    <div className="space-y-8">
                      {currentPage
                        ? getVisibleQuestions(currentPage, data).map((question) => (
                            <QuestionBlock
                              key={question.id}
                              question={question}
                              data={data}
                              onChange={handleChange}
                              disabled={submitStatus === "submitting"}
                            />
                          ))
                        : null}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {errorMessage ? (
                  <p className="mt-6 text-[14px] text-red-400" role="alert">
                    {errorMessage}
                  </p>
                ) : null}

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[13px] text-white/40">
                    {pageIndex + 1} / {totalPages}
                  </p>

                  {isLastPage ? (
                    <div className="flex flex-col gap-4">
                      <p className="text-[12.5px] leading-[1.5] text-white/45">
                        Нажимая кнопку, вы соглашаетесь на обработку персональных данных в
                        соответствии с{" "}
                        <Link
                          href="/privacy"
                          className="text-white/70 underline underline-offset-2 hover:text-white"
                          target="_blank"
                        >
                          Политикой конфиденциальности
                        </Link>
                        .
                      </p>
                      <GlowButton
                        type="submit"
                        disabled={submitStatus === "submitting" || !pageValid}
                        className="h-[48px] w-full px-9 text-[16px] sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitStatus === "submitting" ? "Отправка…" : "Заполнить и отправить"}
                      </GlowButton>
                    </div>
                  ) : (
                    <GlowButton
                      type="button"
                      onClick={goNext}
                      disabled={!pageValid || submitStatus === "submitting"}
                      className="h-[48px] px-9 text-[16px] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Далее →
                    </GlowButton>
                  )}
                </div>

                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-10000px",
                    top: "auto",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                >
                  <label htmlFor="lead-website-overlay">Website</label>
                  <input
                    id="lead-website-overlay"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
