"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ApplyForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status === "submitting") return;
      setErrorMessage(null);
      setStatus("submitting");
      try {
        const res = await fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            course: course.trim() || undefined,
          }),
        });
        const data = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !data.ok) {
          setStatus("error");
          if (data.error === "not_configured") {
            setErrorMessage(
              "Отправка заявок сейчас недоступна с сайта. Напишите на hello@elevateinterns.com, ответим в рабочие часы.",
            );
          } else if (data.error === "delivery_failed") {
            setErrorMessage(
              "Заявка не дошла до нас. Попробуйте через минуту или напишите на hello@elevateinterns.com.",
            );
          } else {
            setErrorMessage("Не удалось отправить. Проверьте поля или попробуйте позже.");
          }
          return;
        }
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage("Ошибка сети. Попробуйте позже или напишите на почту.");
      }
    },
    [name, phone, email, course, status],
  );

  if (status === "success") {
    return (
      <div className="mt-12 rounded-sm border border-[var(--accent)]/35 bg-[var(--bg-mid)]/40 px-5 py-6 text-[15px] leading-relaxed text-[var(--text-primary)]">
        <p className="font-medium">Заявка отправлена</p>
        <p className="mt-2 text-[var(--text-muted)]">
          Команда свяжется с вами в рабочие часы.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-12 space-y-6" aria-label="Заявка" onSubmit={onSubmit} noValidate>
      <p className="text-[12px] leading-relaxed text-[var(--text-muted)]">
        Отправка по защищённому соединению (HTTPS). Условия обработки данных в блоке под кнопкой.
      </p>
      <div>
        <label htmlFor="apply-name" className="block text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Имя
        </label>
        <input
          id="apply-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "submitting"}
          className="mt-2 w-full rounded-sm border border-white/15 bg-white/[0.02] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]/55 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="apply-phone" className="block text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Телефон
        </label>
        <input
          id="apply-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={status === "submitting"}
          className="mt-2 w-full rounded-sm border border-white/15 bg-white/[0.02] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]/55 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="apply-email" className="block text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Email
        </label>
        <input
          id="apply-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          className="mt-2 w-full rounded-sm border border-white/15 bg-white/[0.02] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]/55 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="apply-course" className="block text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Курс / вуз <span className="normal-case text-[10px] text-[var(--text-muted)]/80">(необязательно)</span>
        </label>
        <input
          id="apply-course"
          name="course"
          type="text"
          autoComplete="organization"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          disabled={status === "submitting"}
          className="mt-2 w-full rounded-sm border border-white/15 bg-white/[0.02] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]/55 disabled:opacity-60"
          placeholder="Например: 3 курс, ВШЭ"
        />
      </div>
      {errorMessage ? (
        <p className="text-sm text-red-300/90" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full border border-[var(--accent)] bg-[var(--accent)] py-3.5 text-sm font-medium text-[var(--bg-deep)] transition hover:bg-transparent hover:text-[var(--text-primary)] disabled:opacity-60 md:w-auto md:px-12"
      >
        {status === "submitting" ? "Отправка…" : "Отправить заявку"}
      </button>
      <p className="text-[12px] leading-relaxed text-[var(--text-muted)]">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных в соответствии с{" "}
        <Link
          className="text-[var(--text-primary)] underline decoration-white/25 underline-offset-[3px] transition hover:decoration-[var(--accent)]/55"
          href="/privacy"
        >
          Политикой конфиденциальности
        </Link>
        .
      </p>
    </form>
  );
}
