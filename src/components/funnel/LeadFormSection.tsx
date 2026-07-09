"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SectionDecor } from "@/components/landing/SectionDecor";
import { GlowButton } from "@/components/funnel/GlowButton";
import {
  AGE_RANGES,
  COURSE_OPTIONS,
  FUNNEL_SECTION_IDS,
  STUDY_STATUSES,
} from "@/lib/funnel/config";
import {
  formatVideosWatched,
  serializeWatchState,
  type VideoWatchState,
} from "@/lib/funnel/videoWatch";

type Status = "idle" | "submitting" | "success" | "error";

type LeadFormSectionProps = {
  watchState: VideoWatchState;
  onSubmitted?: () => void;
};

export function LeadFormSection({ watchState, onSubmitted }: LeadFormSectionProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");
  const [course, setCourse] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("");
  const [formStatus, setFormStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setWebsite("");
  }, []);

  const showCourse = status === "studying" || status === "studying_working";

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (formStatus === "submitting") return;

      setErrorMessage(null);
      setFormStatus("submitting");

      try {
        const res = await fetch("/api/submit-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            age,
            country: country.trim(),
            status,
            course: showCourse ? course : "",
            specialty: specialty.trim(),
            contact: contact.trim(),
            website,
            videos_watched: formatVideosWatched(watchState),
            watch_log: serializeWatchState(watchState),
          }),
        });

        const raw = await res.text();
        let data: { ok?: boolean; error?: string } = {};
        try {
          if (raw.trim()) data = JSON.parse(raw) as { ok?: boolean; error?: string };
        } catch {
          /* non-JSON */
        }

        if (!res.ok || !data.ok) {
          setFormStatus("error");
          setErrorMessage("Попробуйте ещё раз");
          return;
        }

        setFormStatus("success");
        onSubmitted?.();
      } catch {
        setFormStatus("error");
        setErrorMessage("Попробуйте ещё раз");
      }
    },
    [
      name,
      age,
      country,
      status,
      course,
      specialty,
      contact,
      website,
      formStatus,
      showCourse,
      watchState,
      onSubmitted,
    ],
  );

  if (formStatus === "success") {
    return (
      <section
        id={FUNNEL_SECTION_IDS.form}
        className="relative overflow-visible py-24"
        style={{ fontFamily: "var(--font-inter-tight)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 select-none opacity-40"
        >
          <Image src="/figma/gradients/blob-5.svg" alt="" fill className="object-contain" />
        </div>

        <div className="relative z-10 mx-auto max-w-[640px] px-4 text-center sm:px-8">
          <h2
            className="heading-gradient font-semibold uppercase leading-[1.2]"
            style={{ fontSize: "clamp(26px, 3.5vw, 34px)" }}
          >
            Успешно отправлено
          </h2>
          <p className="mt-5 text-[17px] leading-[1.55] text-white/70">
            Менеджер с вами свяжется, спасибо большое.
          </p>
        </div>
      </section>
    );
  }

  const inputClass =
    "mt-2 h-[52px] w-full rounded-[12px] border border-[#282828] bg-[#111] px-5 text-[15px] text-white outline-none transition-all duration-300 placeholder:text-[#6e6e6e] focus:border-[#0078F0] focus:shadow-[0_0_0_3px_rgba(0,120,240,0.15)] disabled:opacity-60";

  return (
    <section
      id={FUNNEL_SECTION_IDS.form}
      className="relative overflow-visible py-20 lg:py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
    >
      <SectionDecor
        items={[
          {
            src: "/figma/gradients/footer-gradient-star.svg",
            offsetX: -23,
            top: -280,
            width: 1800,
            height: 1200,
            opacity: 0.45,
          },
          {
            src: "/figma/gradients/grid-5.svg",
            offsetX: -481,
            top: 40,
            width: 500,
            height: 367,
            opacity: 0.25,
            flipY: true,
          },
        ]}
      />

      <div className="relative mx-auto max-w-[820px] px-4 sm:px-8">
        <div
          className="relative overflow-hidden rounded-[24px] border border-white/25 px-6 pb-10 pt-12 backdrop-blur-[18px] sm:px-10 md:backdrop-blur-[30px]"
          style={{
            background:
              "radial-gradient(110% 120% at 20% 100%, rgba(5, 59, 229, 0.45) 0%, rgba(1, 7, 29, 0.55) 55%, rgba(0, 0, 0, 0.4) 100%)",
          }}
        >
          <h2
            className="heading-gradient text-center font-semibold uppercase leading-[1.2] tracking-[-0.005em]"
            style={{ fontSize: "clamp(24px, 3.5vw, 32px)" }}
          >
            Анкета на консультацию
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-[15px] leading-[1.5] text-white/60">
            Заполните форму — мы свяжемся с вами и назначим стратегическую сессию.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate aria-label="Анкета">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="lead-name" className="block text-[14px] font-medium text-white/70">
                  Имя*
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={formStatus === "submitting"}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lead-age" className="block text-[14px] font-medium text-white/70">
                  Возраст*
                </label>
                <select
                  id="lead-age"
                  name="age"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={formStatus === "submitting"}
                  className={inputClass}
                >
                  <option value="">Выберите диапазон</option>
                  {AGE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="lead-country" className="block text-[14px] font-medium text-white/70">
                  Страна*
                </label>
                <input
                  id="lead-country"
                  name="country"
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={formStatus === "submitting"}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lead-status" className="block text-[14px] font-medium text-white/70">
                  Статус*
                </label>
                <select
                  id="lead-status"
                  name="status"
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={formStatus === "submitting"}
                  className={inputClass}
                >
                  <option value="">Выберите статус</option>
                  {STUDY_STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showCourse ? (
              <div>
                <label htmlFor="lead-course" className="block text-[14px] font-medium text-white/70">
                  Курс*
                </label>
                <select
                  id="lead-course"
                  name="course"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  disabled={formStatus === "submitting"}
                  className={inputClass}
                >
                  <option value="">Выберите курс</option>
                  {COURSE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <label htmlFor="lead-specialty" className="block text-[14px] font-medium text-white/70">
                Специальность*
              </label>
              <input
                id="lead-specialty"
                name="specialty"
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                disabled={formStatus === "submitting"}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="lead-contact" className="block text-[14px] font-medium text-white/70">
                Телефон или Telegram*
              </label>
              <input
                id="lead-contact"
                name="contact"
                type="text"
                required
                placeholder="+7 … или @username"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                disabled={formStatus === "submitting"}
                className={inputClass}
              />
            </div>

            {errorMessage ? (
              <p className="text-center text-[14px] text-red-400" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex justify-center pt-2">
              <GlowButton
                type="submit"
                disabled={formStatus === "submitting"}
                className="h-[48px] px-9 text-[16px] disabled:cursor-wait disabled:opacity-70"
              >
                {formStatus === "submitting" ? "Отправка…" : "Заполнить и отправить"}
              </GlowButton>
            </div>

            <p className="text-center text-[12.5px] leading-[1.5] text-white/45">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных в
              соответствии с{" "}
              <Link
                className="text-white/70 underline underline-offset-2 transition hover:text-white"
                href="/privacy"
              >
                Политикой конфиденциальности
              </Link>
              .
            </p>

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
              <label htmlFor="lead-website">Website</label>
              <input
                id="lead-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
