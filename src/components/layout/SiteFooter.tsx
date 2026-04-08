const FOOTER_NAV = [
  { href: "#act-route", label: "Программа" },
  { href: "#act-proof-metrics", label: "Результаты" },
  { href: "#act-depth", label: "Участие" },
  { href: "#act-apply", label: "Заявка" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] px-6 py-16 md:px-14 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)]">
            Elevate Interns
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
            Международные стажировки с ментором, опорой на систему и фокусом на
            результат.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-3" aria-label="Нижняя навигация">
          {FOOTER_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-14 max-w-6xl text-[12px] text-[var(--text-muted)]/80">
        © {new Date().getFullYear()} Elevate Interns. Все права защищены.
      </p>
    </footer>
  );
}
