"use client";

import { useEffect, useId, useRef } from "react";
import { extractYouTubeId } from "@/lib/funnel/youtube";

type YTPlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiReadyPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!apiReadyPromise) {
    apiReadyPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };

      if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const poll = window.setInterval(() => {
          if (window.YT?.Player) {
            window.clearInterval(poll);
            resolve();
          }
        }, 50);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    });
  }

  return apiReadyPromise;
}

function VideoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="lift-card relative aspect-[750/421] w-full overflow-hidden rounded-[18px]"
      style={{
        border: "1.5px solid #3B6AFF",
        boxShadow:
          "0 0 80px -10px rgba(30, 80, 200, 0.35), 0 0 160px -30px rgba(30, 80, 200, 0.25)",
      }}
    >
      {children}
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#060a12] text-white/60"
      style={{
        backgroundImage:
          "radial-gradient(80% 80% at 50% 50%, rgba(30,80,200,0.25) 0%, rgba(0,0,0,0) 70%)",
      }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="mt-4 px-6 text-center text-[13px] uppercase tracking-[0.14em] text-white/50">
        Видео скоро появится
      </p>
    </div>
  );
}

type TrackedYouTubePlayerProps = {
  videoUrl: string;
  title: string;
  watched: boolean;
  onWatched: () => void;
};

export function TrackedYouTubePlayer({
  videoUrl,
  title,
  watched,
  onWatched,
}: TrackedYouTubePlayerProps) {
  const reactId = useId();
  const containerId = `yt-${reactId.replace(/:/g, "")}`;
  const playerRef = useRef<YTPlayer | null>(null);
  const markedRef = useRef(false);
  const pollRef = useRef<number | null>(null);
  const videoId = extractYouTubeId(videoUrl);

  useEffect(() => {
    markedRef.current = watched;
  }, [watched]);

  useEffect(() => {
    if (!videoId || watched) return;

    let cancelled = false;

    const markOnce = () => {
      if (markedRef.current || cancelled) return;
      markedRef.current = true;
      onWatched();
    };

    const startProgressPoll = (player: YTPlayer) => {
      if (pollRef.current !== null) return;
      pollRef.current = window.setInterval(() => {
        try {
          const duration = player.getDuration();
          const current = player.getCurrentTime();
          if (duration > 0 && current / duration >= 0.9) {
            markOnce();
            if (pollRef.current !== null) {
              window.clearInterval(pollRef.current);
              pollRef.current = null;
            }
          }
        } catch {
          /* player may be destroyed */
        }
      }, 1000);
    };

    void loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            startProgressPoll(event.target);
          },
          onStateChange: (event) => {
            if (event.data === window.YT!.PlayerState.ENDED) {
              markOnce();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (pollRef.current !== null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [videoId, watched, onWatched, containerId]);

  if (!videoId) {
    return (
      <VideoFrame>
        <VideoPlaceholder />
      </VideoFrame>
    );
  }

  if (watched) {
    const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
    return (
      <VideoFrame>
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </VideoFrame>
    );
  }

  return (
    <VideoFrame>
      <div id={containerId} className="absolute inset-0 h-full w-full" title={title} />
    </VideoFrame>
  );
}
