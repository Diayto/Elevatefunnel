"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionDecor } from "@/components/landing/SectionDecor";
import { FUNNEL_SECTION_IDS, STUDENT_CASES } from "@/lib/funnel/config";

const PHOTO_SIZES =
  "(max-width: 767px) min(92vw, 400px), (max-width: 1200px) calc((100vw - 6rem) / 3), 380px";

export function CasesSection() {
  const [perPage, setPerPage] = useState(3);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(STUDENT_CASES.length / perPage);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setPerPage(mq.matches ? 1 : 3);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  const visible = useMemo(
    () => STUDENT_CASES.slice(page * perPage, page * perPage + perPage),
    [page, perPage],
  );

  const go = useCallback(
    (dir: -1 | 1) => {
      setPage((p) => Math.min(pageCount - 1, Math.max(0, p + dir)));
    },
    [pageCount],
  );

  return (
    <section
      id={FUNNEL_SECTION_IDS.cases}
      className="relative overflow-visible py-20 lg:py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
    >
      <SectionDecor
        items={[
          {
            src: "/figma/gradients/blob-3.svg",
            offsetX: 491,
            top: -200,
            width: 1095,
            height: 1095,
            opacity: 0.65,
          },
          {
            src: "/figma/gradients/blob-4.svg",
            offsetX: -608,
            top: 180,
            width: 1159,
            height: 1159,
            opacity: 0.65,
          },
          {
            src: "/figma/gradients/grid-2.svg",
            offsetX: 404,
            top: 420,
            width: 596,
            height: 438,
            opacity: 0.35,
          },
        ]}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-8">
        <h2
          className="heading-gradient text-center font-semibold uppercase leading-[1.2] tracking-[-0.005em]"
          style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
        >
          Результаты студентов
        </h2>

        <div
          className="mt-12 grid min-h-[420px] grid-cols-1 content-start justify-items-center gap-6 md:min-h-[280px] md:grid-cols-3 md:justify-items-stretch"
          role="region"
          aria-roledescription="carousel"
          aria-label="Кейсы студентов"
        >
          {visible.map((item, i) => (
            <article
              key={item.id}
              className="lift-card group relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-[18px] border border-white/25 bg-[rgba(17,17,17,0.5)] pb-7 pt-7 md:max-w-none"
            >
              <div className="relative mx-5 aspect-[340/310] w-[calc(100%-2.5rem)] overflow-hidden rounded-[14px]">
                <Image
                  src={item.photoUrl}
                  alt={item.name}
                  fill
                  sizes={PHOTO_SIZES}
                  quality={92}
                  className="object-cover object-center transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  priority={page === 0 && i === 0}
                />
              </div>

              <p
                className="mt-6 text-center font-medium text-white"
                style={{ fontSize: "26px", lineHeight: "1.2" }}
              >
                {item.name}
              </p>
              <p
                className="mt-2 px-4 text-center text-white/65"
                style={{ fontSize: "16px", lineHeight: "1.4" }}
              >
                {item.result}
              </p>
              {item.videoUrl ? (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-auto mt-4 text-[14px] text-[#3D9EFF] underline underline-offset-2 hover:text-white"
                >
                  Смотреть видео
                </a>
              ) : null}
            </article>
          ))}
        </div>

        {pageCount > 1 ? (
          <div className="mt-8 flex flex-col items-center gap-5">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={page <= 0}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#282828] text-white transition-all duration-300 hover:border-[#0078f0] hover:bg-[rgba(0,120,240,0.08)] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Предыдущая страница кейсов"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={page >= pageCount - 1}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#282828] text-white transition-all duration-300 hover:border-[#0078f0] hover:bg-[rgba(0,120,240,0.08)] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Следующая страница кейсов"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Страницы кейсов">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`Страница ${i + 1} из ${pageCount}`}
                  onClick={() => setPage(i)}
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      i === page ? "w-8 bg-[#0078f0]" : "w-2 bg-white/25 hover:bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
