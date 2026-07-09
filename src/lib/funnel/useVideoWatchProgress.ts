"use client";

import { useCallback, useEffect, useState } from "react";
import type { VideoWatchKey } from "@/lib/funnel/config";
import {
  allVideosWatched,
  countWatched,
  createEmptyWatchState,
  parseWatchState,
  serializeWatchState,
  VIDEO_WATCH_STORAGE_KEY,
  type VideoWatchState,
} from "@/lib/funnel/videoWatch";

export function useVideoWatchProgress() {
  const [state, setState] = useState<VideoWatchState>(createEmptyWatchState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = parseWatchState(localStorage.getItem(VIDEO_WATCH_STORAGE_KEY));
    setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(VIDEO_WATCH_STORAGE_KEY, serializeWatchState(state));
  }, [state, hydrated]);

  const markWatched = useCallback((key: VideoWatchKey) => {
    setState((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
  }, []);

  return {
    state,
    hydrated,
    watchedCount: countWatched(state),
    allWatched: allVideosWatched(state),
    markWatched,
  };
}
