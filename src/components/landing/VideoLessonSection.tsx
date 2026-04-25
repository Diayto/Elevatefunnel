import Image from "next/image";
import { SectionDecor } from "@/components/landing/SectionDecor";

/**
 * Видеоурок. Сюда вставляется YouTube-ссылка — видео стартует с 0:00.
 * Поменяйте VIDEO_URL на любой формат:
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/embed/ID
 *   https://www.youtube.com/shorts/ID
 * Пустая строка — показать заглушку «видео скоро».
 */
const VIDEO_URL = "https://www.youtube.com/watch?v=4tZ2VoDWrLs&t=9s";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{6,})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{6,})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function VideoLessonSection() {
  const videoId = extractYouTubeId(VIDEO_URL);
  // start=0 — видео откроется c 0:00, без автостарта
  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&start=0`
    : null;

  return (
    <section
      id="act-video-lesson"
      className="relative overflow-visible py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
    >
      <SectionDecor
        items={[
          // grid-3 сверху по центру.
          { src: "/figma/gradients/grid-3.svg", offsetX: 0, top: -80, width: 596, height: 438, opacity: 0.3 },
          // blob-5 большой центральный. Native SVG 1547x1194, core ellipse = 989x636.
          { src: "/figma/gradients/blob-5.svg", offsetX: 0, top: -157, width: 1547, height: 1194, opacity: 0.7 },
        ]}
      />
      <div className="relative mx-auto max-w-[1200px] px-8">
        {/* Star icon */}
        <div className="flex justify-center">
          <Image
            src="/figma/icons/star-icon.svg"
            alt=""
            width={48}
            height={48}
            className="transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Heading */}
        <h2
          className="heading-gradient mx-auto mt-5 max-w-[680px] text-center font-semibold uppercase leading-[1.15] tracking-[-0.005em]"
          style={{ fontFamily: "var(--font-inter-tight)", fontSize: "44px" }}
        >
          Как с нуля выйти на стажировку за рубежом
        </h2>

        {/* Video frame */}
        <div className="mx-auto mt-12 max-w-[820px]">
          <div
            className="lift-card relative aspect-[750/421] w-full overflow-hidden rounded-[18px]"
            style={{
              border: "1.5px solid #3B6AFF",
              boxShadow:
                "0 0 80px -10px rgba(30, 80, 200, 0.35), 0 0 160px -30px rgba(30, 80, 200, 0.25)",
            }}
          >
            {embedSrc ? (
              <iframe
                src={embedSrc}
                title="Бесплатный видеоурок от Elevate.Interns"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#060a12] text-white/60"
                style={{
                  backgroundImage:
                    "radial-gradient(80% 80% at 50% 50%, rgba(30,80,200,0.25) 0%, rgba(0,0,0,0) 70%)",
                }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-transform duration-500 hover:scale-110">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="mt-5 text-[14px] uppercase tracking-[0.18em] text-white/50">
                  Бесплатный видеоурок от Elevate.Interns
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
