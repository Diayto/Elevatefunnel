"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";
import { revealTransition, revealViewport } from "@/lib/motion/presets";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * До монтирования клиента рендерим статический блок с тем же «скрытым» видом, что и
 * `initial` у motion — иначе `whileInView` на сервере и при гидрации даёт разный opacity.
 */
export function Reveal({ children, className = "" }: Props) {
  const reduced = useReducedMotionSafe();
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(true);
  }, []);

  if (!motionReady) {
    return (
      <div
        className={className}
        style={
          reduced
            ? undefined
            : {
                opacity: 0,
                transform: "translateY(26px)",
              }
        }
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition(reduced)}
    >
      {children}
    </motion.div>
  );
}
