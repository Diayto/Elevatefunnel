import Image from "next/image";

const FOOTER_NAV = [
  { href: "/#act-students", label: "Кейсы" },
  { href: "/#act-pricing", label: "Тарифы" },
  { href: "/#act-video-lesson", label: "Видеоурок" },
  { href: "/#act-partners", label: "Партнеры" },
  { href: "/#act-faq", label: "Вопросы" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 px-8 pb-10 pt-6">
      <div className="mx-auto flex max-w-[1136px] flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Image
            src="/figma/graphics/logo.svg"
            alt="Elevate.Interns"
            width={128}
            height={13}
            className="h-[13px] w-[128px]"
          />
          <p
            className="mt-4 max-w-[329px] text-[14px] leading-[1.5] text-white/60"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Международные стажировки с ментором, опорой на систему и фокусом на
            результат.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2"
            aria-label="Нижняя навигация"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            {FOOTER_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover-underline text-[16px] text-white/90 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <p
            className="text-[14px] text-white/40"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            © {new Date().getFullYear()} Elevate Interns. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
