"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { useDprCap, useParticleQualityTier } from "@/lib/canvas/useCanvasPresentation";
import type { NarrativeHotspot } from "@/lib/narrative/hotspot";
import type { ParticleFieldZones } from "@/lib/narrative/particleFieldZones";
import type { ParticleUniforms } from "@/lib/narrative/types";
import { HeroBloom } from "./HeroBloom";
import { ParticleField } from "./ParticleField";

type Props = {
  uniforms: ParticleUniforms;
  motionScale: number;
  hotspot: NarrativeHotspot;
  zones: ParticleFieldZones;
  reducedMotion: boolean;
};

function Scene({ uniforms, motionScale, hotspot, zones, reducedMotion }: Props) {
  const qualityTier = useParticleQualityTier(reducedMotion);
  return (
    <>
      <ParticleField
        uniforms={uniforms}
        motionScale={motionScale}
        hotspot={hotspot}
        zones={zones}
        reducedMotion={reducedMotion}
        qualityTier={qualityTier}
      />
      <HeroBloom reducedMotion={reducedMotion} />
    </>
  );
}

function NarrativeCanvas({
  uniforms,
  motionScale,
  hotspot,
  zones,
  reducedMotion,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const dprCap = useDprCap();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
      data-layer="particulate"
    >
      <div className="relative h-full min-h-0 w-full lg:translate-x-[clamp(0.4rem,1.85vw,1.1rem)]">
        <Canvas
          className="!h-full !w-full"
          camera={{ position: [0, 0, 1.46], fov: 45.5 }}
          dpr={[Math.min(1.65, dprCap), dprCap]}
          onCreated={({ gl: renderer, scene }) => {
            scene.background = null;
            renderer.setClearColor(0x000000, 0);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.NoToneMapping;
          }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
            stencil: false,
            depth: true,
          }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Scene
              uniforms={uniforms}
              motionScale={motionScale}
              hotspot={hotspot}
              zones={zones}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
export default NarrativeCanvas;

