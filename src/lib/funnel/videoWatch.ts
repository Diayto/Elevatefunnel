import {
  TOTAL_VIDEOS,
  VIDEO_WATCH_KEYS,
  type VideoWatchKey,
} from "@/lib/funnel/config";

export type VideoWatchState = Record<VideoWatchKey, boolean>;

export const VIDEO_WATCH_STORAGE_KEY = "elevate-funnel-video-progress";

export function createEmptyWatchState(): VideoWatchState {
  return {
    main: false,
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false,
    q6: false,
  };
}

export function countWatched(state: VideoWatchState): number {
  return VIDEO_WATCH_KEYS.filter((key) => state[key]).length;
}

export function allVideosWatched(state: VideoWatchState): boolean {
  return countWatched(state) === TOTAL_VIDEOS;
}

export function formatVideosWatched(state: VideoWatchState): string {
  return `${countWatched(state)}/${TOTAL_VIDEOS}`;
}

export function parseWatchState(raw: string | null): VideoWatchState {
  const base = createEmptyWatchState();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<VideoWatchState>;
    for (const key of VIDEO_WATCH_KEYS) {
      if (typeof parsed[key] === "boolean") {
        base[key] = parsed[key]!;
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return base;
}

export function serializeWatchState(state: VideoWatchState): string {
  return JSON.stringify(state);
}
