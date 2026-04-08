"use client";

import { useEffect, useState } from "react";

/**
 * Совпадает с SSR и первым проходом гидрации: всегда `false`, затем синхронизация с
 * `prefers-reduced-motion`. Хук Framer `useReducedMotion()` на сервере часто даёт `null`,
 * на клиенте — реальное значение → разный `initial` у motion и hydration mismatch.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
