import type { Transition, Variants } from "framer-motion";

/** Editorial ease — calm, not bouncy. */
export const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const revealTransition = (reduced: boolean): Transition =>
  reduced ? { duration: 0.01 }
  : { duration: 0.88, ease: easeOutExpo };

export const revealViewport = {
  once: true,
  margin: "0px 0px -11% 0px" as const,
  amount: 0.14 as const,
};

export function heroContainerVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: {},
      visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
    };
  }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.11, delayChildren: 0.08 },
    },
  };
}

export function heroItemVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0 },
    };
  }
  return {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: easeOutExpo },
    },
  };
}
