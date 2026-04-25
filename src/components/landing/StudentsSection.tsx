"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionDecor } from "@/components/landing/SectionDecor";

type Student = {
  id: string;
  name: string;
  description: string;
  photoSrc: string;
  companyName: string;
};

/** Фото из архива Students Partners — имена/компании по смыслу секции, без привязки к конкретному лицу на фото. */
const STUDENTS: Student[] = [
  {
    id: "student-1",
    name: "Исмаил",
    description: "Стажировка в Samsung",
    photoSrc: "/figma/students/Image-1.jpg",
    companyName: "AIFC",
  },
  {
    id: "student-2",
    name: "Арина",
    description: "Стажировка в GAO Tech",
    photoSrc: "/figma/students/Image-2.jpg",
    companyName: "Samsung",
  },
  {
    id: "student-3",
    name: "Алишер",
    description: "Стажировка в ABC Studio",
    photoSrc: "/figma/students/Image-3.jpg",
    companyName: "Mastercard",
  },
  {
    id: "student-4",
    name: "Аружан",
    description: "Стажировка в Coca Cola",
    photoSrc: "/figma/students/Image-4.jpg",
    companyName: "Big4",
  },
  {
    id: "student-5",
    name: "Сабина",
    description: "Стажировка в MARS",
    photoSrc: "/figma/students/Image-5.jpg",
    companyName: "IT",
  },
  {
    id: "student-6",
    name: "Адилет",
    description: "Стажировка в Khan Tengri Innovation hub",
    photoSrc: "/figma/students/Image-6.jpg",
    companyName: "Финансы",
  },
  {
    id: "student-7",
    name: "Ильяс",
    description: "Стажировка в Mekari & XD Studio",
    photoSrc: "/figma/students/Image-7.jpg",
    companyName: "Консалтинг",
  },
  {
    id: "student-8",
    name: "Жаннур",
    description: "Стажировка в PWC",
    photoSrc: "/figma/students/Image-8.jpg",
    companyName: "Корпорация",
  },
  {
    id: "student-9",
    name: "Асылбек",
    description: "Стажировка в Freedom bank",
    photoSrc: "/figma/students/Image-9.jpg",
    companyName: "За рубежом",
  },
  {
    id: "student-10",
    name: "Артур",
    description: "Стажировка в Owlto finance",
    photoSrc: "/figma/students/Image.jpg",
    companyName: "Топ-работодатель",
  },
];

const PHOTO_SIZES =
  "(max-width: 767px) min(92vw, 400px), (max-width: 1200px) calc((100vw - 6rem) / 3), 380px";

export function StudentsSection() {
  const [perPage, setPerPage] = useState(3);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(STUDENTS.length / perPage);

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
    () => STUDENTS.slice(page * perPage, page * perPage + perPage),
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
      id="act-students"
      className="relative overflow-visible py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
    >
      <SectionDecor
        items={[
          { src: "/figma/gradients/blob-3.svg", offsetX: 491, top: -388, width: 1095, height: 1095, opacity: 0.7 },
          { src: "/figma/gradients/blob-4.svg", offsetX: -608, top: 120, width: 1159, height: 1159, opacity: 0.7 },
          { src: "/figma/gradients/grid-2.svg", offsetX: 404, top: 420, width: 596, height: 438, opacity: 0.35 },
        ]}
      />
      <div className="relative mx-auto max-w-[1200px] px-8">
        <div className="flex justify-center">
          <span className="section-icon-box">
            <Image src="/figma/icons/students-icon.svg" alt="" width={24} height={24} />
          </span>
        </div>

        <h2
          className="heading-gradient mt-5 text-center font-semibold uppercase leading-[1.2] tracking-[-0.005em]"
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontSize: "44px",
          }}
        >
          Результаты наших студентов
        </h2>

        <div
          className="mt-14 grid min-h-[480px] grid-cols-1 content-start justify-items-center gap-6 sm:min-h-[420px] md:min-h-[280px] md:grid-cols-3 md:justify-items-stretch"
          role="region"
          aria-roledescription="carousel"
          aria-label="Кейсы студентов"
        >
          {visible.map((s, i) => (
            <article
              key={s.id}
              className="lift-card group relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-[18px] border border-[#282828] bg-[rgba(17,17,17,0.5)] pb-7 pt-7 md:max-w-none"
            >
              <div className="relative mx-5 aspect-[340/310] w-[calc(100%-2.5rem)] overflow-hidden rounded-[14px]">
                <Image
                  src={s.photoSrc}
                  alt={s.name}
                  fill
                  sizes={PHOTO_SIZES}
                  quality={92}
                  className="object-cover object-center transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  priority={page === 0 && i === 0}
                />
              </div>

              <p
                className="mt-6 text-center font-medium text-white"
                style={{ fontSize: "30px", lineHeight: "1.2" }}
              >
                {s.name}
              </p>
              <p
                className="mt-1 px-3 text-center text-white/65"
                style={{ fontSize: "17px", lineHeight: "1.3" }}
              >
                {s.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-5">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={page <= 0}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#282828] text-white transition-all duration-300 hover:border-[#0078f0] hover:bg-[rgba(0,120,240,0.08)] hover:shadow-[0_0_20px_-4px_rgba(0,120,240,0.5)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#282828] disabled:hover:bg-transparent disabled:hover:shadow-none"
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
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#282828] text-white transition-all duration-300 hover:border-[#0078f0] hover:bg-[rgba(0,120,240,0.08)] hover:shadow-[0_0_20px_-4px_rgba(0,120,240,0.5)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#282828] disabled:hover:bg-transparent disabled:hover:shadow-none"
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
      </div>
    </section>
  );
}
