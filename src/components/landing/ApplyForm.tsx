"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TurnstileBox } from "@/components/landing/TurnstileBox";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Status = "idle" | "submitting" | "success" | "error";

export function ApplyForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Скрытое поле «website» иногда заполняет автозаполнение → API считает это ботом и
  // отвечает ok без записи в таблицу. Сбрасываем после монтирования.
  useEffect(() => {
    setWebsite("");
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status === "submitting") return;
      if (turnstileSiteKey && !turnstileToken) {
        setErrorMessage("Пройдите проверку «Я не робот» и отправьте снова.");
        return;
      }
      setErrorMessage(null);
      setStatus("submitting");
      try {
        const bodyStr = JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          website,
          ...(turnstileSiteKey ? { turnstileToken: turnstileToken ?? "" } : {}),
        });
        const res = await fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyStr,
        });
        const raw = await res.text();
        let data: { ok?: boolean; error?: string } = {};
        try {
          if (raw.trim()) {
            data = JSON.parse(raw) as { ok?: boolean; error?: string };
          }
        } catch {
          /* ответ не JSON (например HTML от прокси) */
        }
        if (!res.ok || !data.ok) {
          setStatus("error");
          if (data.error === "rate_limited") {
            setErrorMessage(
              "Слишком много попыток с вашего устройства. Подождите несколько минут и попробуйте снова.",
            );
          } else if (data.error === "not_configured") {
            setErrorMessage(
              "Отправка заявок сейчас недоступна с сайта. Напишите на hello@elevateinterns.com.",
            );
          } else if (data.error === "delivery_failed") {
            setErrorMessage(
              "Заявка не дошла до нас. Попробуйте через минуту или напишите на hello@elevateinterns.com.",
            );
          } else if (data.error === "captcha_failed") {
            setErrorMessage(
              "Проверка безопасности не прошла. Обновите страницу и попробуйте снова.",
            );
          } else if (data.error === "duplicate_request") {
            setErrorMessage(
              "Похоже, вы уже отправили заявку. Подождите 2-3 минуты перед повторной отправкой.",
            );
          } else if (data.error === "invalid_phone") {
            setErrorMessage(
              "Укажите телефон полностью (не меньше 5 символов), например +7 777 123-45-67.",
            );
          } else if (data.error === "invalid_name") {
            setErrorMessage("Укажите имя.");
          } else if (data.error === "invalid_email") {
            setErrorMessage("Проверьте формат email.");
          } else {
            setErrorMessage(
              "Не удалось отправить. Проверьте поля или попробуйте позже.",
            );
          }
          return;
        }
        setStatus("success");
        setTurnstileToken(null);
      } catch {
        setStatus("error");
        setErrorMessage("Ошибка сети. Попробуйте позже или напишите на почту.");
      }
    },
    [name, phone, email, website, status, turnstileToken],
  );

  if (status === "success") {
    return (
      <div className="mt-8 rounded-[14px] border border-[#2a5fff]/40 bg-[#0d1420] px-8 py-7 text-center">
        <p className="text-[20px] font-semibold text-white">Заявка отправлена</p>
        <p className="mt-2 text-[15px] text-white/60">
          Команда свяжется с вами в рабочие часы.
        </p>
      </div>
    );
  }

  const inputClass =
    "mt-3 h-[52px] w-full rounded-[12px] border border-[#282828] bg-[#111] px-5 text-[15px] text-white outline-none transition-all duration-300 placeholder:text-[#6e6e6e] focus:border-[#0078F0] focus:shadow-[0_0_0_3px_rgba(0,120,240,0.15)] disabled:opacity-60";

  return (
    <form
      className="mt-10 space-y-6"
      aria-label="Заявка"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="apply-name"
            className="block text-[14px] font-medium text-white/70"
          >
            Имя*
          </label>
          <input
            id="apply-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Имангали"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "submitting"}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="apply-phone"
            className="block text-[14px] font-medium text-white/70"
          >
            Телефон*
          </label>
          <input
            id="apply-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+7 (777) 777-77-77"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={status === "submitting"}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="apply-email"
          className="block text-[14px] font-medium text-white/70"
        >
          Email*
        </label>
        <input
          id="apply-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="iman78@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          className={inputClass}
        />
      </div>

      {turnstileSiteKey ? (
        <TurnstileBox siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
      ) : null}

      {errorMessage && (
        <p className="text-[14px] text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={
            status === "submitting" || Boolean(turnstileSiteKey && !turnstileToken)
          }
          className="glow-btn h-[48px] rounded-full px-9 text-[16px] font-semibold text-white disabled:cursor-wait disabled:opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #3D9EFF 0%, #053BE5 15%, #053BE5 85%, #0078F0 100%)",
            border: "1px solid #0080FF",
            boxShadow: "0px 0px 18px 0px #4675FF",
            letterSpacing: "-0.3px",
            fontFeatureSettings: "'zero' 1",
          }}
        >
          {status === "submitting" ? "Отправка…" : "Получить доступ"}
        </button>
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

      <p className="text-center text-[12.5px] text-white/45">
        Нужна консультация до заявки?{" "}
        <a
          className="text-white underline underline-offset-2 transition hover:text-white/80"
          href="https://wa.me/77755107079"
          target="_blank"
          rel="noopener noreferrer"
        >
          Связаться с менеджером
        </a>
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
        <label htmlFor="apply-website">Website</label>
        <input
          id="apply-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
    </form>
  );
}
