"use client";

import { useCallback } from "react";
import { SectionDecor } from "@/components/landing/SectionDecor";
import { GlowButton } from "@/components/funnel/GlowButton";
import { TrackedYouTubePlayer } from "@/components/funnel/TrackedYouTubePlayer";
import {
  FUNNEL_SECTION_IDS,
  MAIN_VIDEO_URL,
  QUESTION_VIDEOS,
  TOTAL_VIDEOS,
} from "@/lib/funnel/config";
import type { VideoWatchKey } from "@/lib/funnel/config";
import type { VideoWatchState } from "@/lib/funnel/videoWatch";

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
            top: 900,
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
            top: 680,
            width: 500,
            height: 367,
            opacity: 0.28,
          },
        ]}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-8">
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

        <div className="mx-auto mt-10 max-w-[820px]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[15px] font-medium text-white/80">Основное видео</p>
            <WatchedBadge watched={watchState.main} />
          </div>
          <TrackedYouTubePlayer
            videoUrl={MAIN_VIDEO_URL}
            title="Основное видео стратегической сессии"
            watched={watchState.main}
            onWatched={handleWatched("main")}
          />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {QUESTION_VIDEOS.map((item) => (
            <article
              key={item.id}
              className="lift-card rounded-[18px] border border-white/25 bg-[rgba(17,17,17,0.5)] p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="text-[17px] font-medium leading-[1.35] text-white">
                  {item.question}
                </h3>
                <WatchedBadge watched={watchState[item.id]} />
              </div>
              <TrackedYouTubePlayer
                videoUrl={item.videoUrl}
                title={item.question}
                watched={watchState[item.id]}
                onWatched={handleWatched(item.id)}
              />
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <GlowButton
            as="a"
            href={allWatched ? `#${FUNNEL_SECTION_IDS.warmup}` : undefined}
            className={`h-[48px] px-8 text-[16px] ${!allWatched ? "cursor-not-allowed opacity-50" : ""}`}
            aria-disabled={!allWatched}
            onClick={(e) => {
              if (!allWatched) e.preventDefault();
            }}
            style={
              !allWatched
                ? { boxShadow: "none", filter: "none" }
                : undefined
            }
          >
            Далее
          </GlowButton>
          {!allWatched ? (
            <p className="max-w-[420px] text-center text-[14px] text-white/50">
              Посмотрите все видео, чтобы перейти к следующему шагу.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
