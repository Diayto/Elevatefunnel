import Image from "next/image";
import { FUNNEL_SECTION_IDS } from "@/lib/funnel/config";

export function FunnelFooter() {
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
            className="mt-4 max-w-[360px] text-[14px] leading-[1.5] text-white/60"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Стратегическая сессия: международные стажировки, разбор профиля и
            план действий.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <a
            href={`#${FUNNEL_SECTION_IDS.form}`}
            className="hover-underline text-[16px] text-white/90 transition hover:text-white"
          >
            Записаться на сессию
          </a>
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
