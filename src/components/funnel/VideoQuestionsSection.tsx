"use client";

import { useCallback, useMemo } from "react";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { GlowButton } from "@/components/funnel/GlowButton";
import { TrackedYouTubePlayer } from "@/components/funnel/TrackedYouTubePlayer";
import {
  FUNNEL_SECTION_IDS,
  FUNNEL_VIDEO_QUEUE,
  TOTAL_VIDEOS,
} from "@/lib/funnel/config";
import type { VideoWatchKey } from "@/lib/funnel/config";
import { isVideoUnlocked, type VideoWatchState } from "@/lib/funnel/videoWatch";

type VideoQuestionsSectionProps = {
  watchState: VideoWatchState;
  watchedCount: number;
  allWatched: boolean;
  onMarkWatched: (key: VideoWatchKey) => void;
};

function WatchedBadge({ watched }: { watched: boolean }) {
  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[14px] font-semibold transition-colors ${
        watched
          ? "border-[#0080FF] bg-[#053BE5] text-white shadow-[0_0_12px_0_#4675FF]"
          : "border-white/20 bg-white/5 text-white/30"
      }`}
      aria-hidden
    >
      {watched ? "✓" : ""}
    </span>
  );
}

function LockedVideoPlaceholder({ step }: { step: number }) {
  return (
    <div
      className="relative flex aspect-[750/421] w-full flex-col items-center justify-center rounded-[18px] border border-dashed border-white/15 bg-[rgba(17,17,17,0.65)] px-6 text-center"
      style={{
        boxShadow: "inset 0 0 60px -20px rgba(5, 59, 229, 0.25)",
      }}
    >
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6v-9Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="text-[15px] font-medium text-white/70">Видео {step} откроется после просмотра предыдущего</p>
      <p className="mt-2 max-w-[360px] text-[13px] leading-[1.5] text-white/45">
        Смотрите ролики по порядку сверху вниз — так вы не пропустите важные шаги.
      </p>
    </div>
  );
}

export function VideoQuestionsSection({
  watchState,
  watchedCount,
  allWatched,
  onMarkWatched,
}: VideoQuestionsSectionProps) {
  const handleWatched = useCallback(
    (key: VideoWatchKey) => () => onMarkWatched(key),
    [onMarkWatched],
  );

  const unlockMap = useMemo(
    () => FUNNEL_VIDEO_QUEUE.map((_, index) => isVideoUnlocked(watchState, index)),
    [watchState],
  );

  return (
    <section
      id={FUNNEL_SECTION_IDS.video}
      className="relative overflow-visible py-20 lg:py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
    >
      <SectionDecor
        items={[
          {
            src: "/figma/gradients/blob-5.svg",
            offsetX: -320,
            top: 80,
            width: 1200,
            height: 900,
            opacity: 0.55,
          },
          {
            src: "/figma/gradients/blob-6.svg",
            offsetX: 420,
            top: 1400,
            width: 900,
            height: 700,
            opacity: 0.45,
          },
          {
            src: "/figma/gradients/grid-3.svg",
            offsetX: 380,
            top: 120,
            width: 500,
            height: 367,
            opacity: 0.3,
          },
          {
            src: "/figma/gradients/grid-4.svg",
            offsetX: -440,
            top: 900,
            width: 500,
            height: 367,
            opacity: 0.28,
          },
          {
            src: "/figma/gradients/grid-2.svg",
            offsetX: 300,
            top: 2200,
            width: 500,
            height: 367,
            opacity: 0.24,
          },
        ]}
      />

      <div className="relative mx-auto max-w-[820px] px-4 sm:px-8">
        <h2
          className="heading-gradient text-center font-semibold uppercase leading-[1.15] tracking-[-0.005em]"
          style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
        >
          Видео-разбор
        </h2>

        <p
          className="mx-auto mt-4 max-w-[640px] text-center text-[16px] leading-[1.5] text-white/65"
          role="status"
          aria-live="polite"
        >
          Просмотрено {watchedCount} из {TOTAL_VIDEOS}
        </p>

        <ol className="mt-12 flex flex-col gap-10 sm:gap-12">
          {FUNNEL_VIDEO_QUEUE.map((item, index) => {
            const unlocked = unlockMap[index];
            const watched = watchState[item.id];

            return (
              <li key={item.id}>
                <article
                  className={`lift-card rounded-[18px] border bg-[rgba(17,17,17,0.5)] p-5 sm:p-6 ${
                    unlocked ? "border-white/25" : "border-white/10 opacity-90"
                  }`}
                >
                  <div className="mb-4 flex items-start gap-4">
                    <span className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 px-2 text-[13px] font-semibold text-white/75">
                      {item.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[17px] font-medium leading-[1.35] text-white sm:text-[18px]">
                        {item.title}
                      </h3>
                      {!unlocked ? (
                        <p className="mt-1 text-[13px] text-white/45">Доступно после предыдущего видео</p>
                      ) : null}
                    </div>
                    <WatchedBadge watched={watched} />
                  </div>

                  {unlocked ? (
                    <TrackedYouTubePlayer
                      videoUrl={item.videoUrl}
                      title={item.title}
                      watched={watched}
                      onWatched={handleWatched(item.id)}
                    />
                  ) : (
                    <LockedVideoPlaceholder step={item.step} />
                  )}
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-3">
          <GlowButton
            as="a"
            href={allWatched ? `#${FUNNEL_SECTION_IDS.warmup}` : undefined}
            className={`h-[48px] px-8 text-[16px] ${!allWatched ? "cursor-not-allowed opacity-50" : ""}`}
            aria-disabled={!allWatched}
            onClick={(e) => {
              if (!allWatched) e.preventDefault();
            }}
            style={!allWatched ? { boxShadow: "none", filter: "none" } : undefined}
          >
            Далее
          </GlowButton>
          {!allWatched ? (
            <p className="max-w-[420px] text-center text-[14px] text-white/50">
              Посмотрите все 7 видео по порядку, чтобы перейти дальше.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
