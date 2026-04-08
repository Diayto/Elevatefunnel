"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";

type Props = {
  reducedMotion: boolean;
};

/**
 * Soft bloom on bright particles — «туман» и свечение как у premium-лендингов.
 * Отключается при prefers-reduced-motion.
 */
export function HeroBloom({ reducedMotion }: Props) {
  if (reducedMotion) {
    return null;
  }

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.1}
        luminanceSmoothing={0.22}
        intensity={0.52}
        radius={0.58}
        levels={7}
        mipmapBlur
      />
    </EffectComposer>
  );
}
