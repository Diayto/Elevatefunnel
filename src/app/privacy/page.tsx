import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24 sm:px-6 md:py-32">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Юридическая информация
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-serif)] text-3xl font-normal tracking-tight text-[var(--text-primary)]">
        Политика конфиденциальности
      </h1>
      <p className="mt-8 text-[17px] leading-relaxed text-[var(--text-muted)]">
        Полный текст политики готовится к публикации. По вопросам обработки данных
        свяжитесь с командой через контакты, указанные в заявке или на сайте.
      </p>
      <p className="mt-10">
        <Link
          className="text-sm text-[var(--accent)] underline-offset-4 transition hover:underline"
          href="/#act-apply"
        >
          ← К форме заявки
        </Link>
      </p>
    </main>
  );
}
