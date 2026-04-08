"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ParticleQualityTier, StratumLayer } from "@/lib/canvas/particleQuality";
import { getStrataForTier } from "@/lib/canvas/particleQuality";
import type { NarrativeHotspot } from "@/lib/narrative/hotspot";
import type { ParticleFieldZones } from "@/lib/narrative/particleFieldZones";
import { DEFAULT_UNIFORMS, type ParticleUniforms } from "@/lib/narrative/types";
import { particleFragmentShader, particleVertexShader } from "./particleShaders";

/** Стабильная яркость/плотность: не тянуть globalAlpha/glow/density от blend при скролле. */
const HERO_PARTICLE_VIS = DEFAULT_UNIFORMS.heroField;

function fract01(n: number) {
  return n - Math.floor(n);
}

/**
 * Fibonacci directions + thin spherical shells (hollow globe, dense rim — Infracorp-style read).
 */
function buildSphereFieldGeometry(strata: StratumLayer[]) {
  const total = strata.reduce((s, L) => s + L.count, 0);
  const positions = new Float32Array(total * 3);
  const seeds = new Float32Array(total);
  const strataAttr = new Float32Array(total);

  let idx = 0;
  for (const L of strata) {
    const { count, stratum } = L;
    const shellR = 0.298 + stratum * 0.022;
    const band = 0.0055 + (1.0 - stratum * 0.14) * 0.0045;
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.73);
      const rnd = fract01(Math.sin(stratum * 127.1 + i * 311.7) * 43758.5453123);
      const rJitter = (rnd - 0.5) * 2.0 * band;
      const r = shellR * (1.0 + rJitter * 0.92) * 0.9;
      const sp = Math.sin(phi);
      positions[idx * 3] = r * sp * Math.cos(theta);
      positions[idx * 3 + 1] = r * sp * Math.sin(theta);
      positions[idx * 3 + 2] = r * Math.cos(phi);
      seeds[idx] = Math.random() * 10000;
      strataAttr[idx] = L.stratum;
      idx++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute("aStratum", new THREE.BufferAttribute(strataAttr, 1));
  return geo;
}

type Props = {
  uniforms: ParticleUniforms;
  motionScale: number;
  hotspot: NarrativeHotspot;
  zones: ParticleFieldZones;
  reducedMotion: boolean;
  qualityTier: ParticleQualityTier;
};

const DEPTH_LIFT = { x: 0.065, y: 0.095, z: 0.072 };

/** X/Z anchor; Y задаётся динамически — центр полосы от низа хедера до низа вьюпорта. */
const FIELD_OFFSET_XZ: [number, number, number] = [0.46, 0, 0];

/** ~2× previous scale — larger on-screen globe (see camera z in NarrativeCanvas). */
const FIELD_GROUP_SCALE = 1.48 * 1.15;

/** Sand lifecycle: ~2s per particle cycle; path wobble ×1.5 vs baseline. */
const HERO_LIFE_SEC = 2;
const HERO_PATH_SPEED_MUL = 1.5;

const GROUP_YAW_SPEED = 0.1;
const GROUP_YAW_SPEED_REDUCED = 0.016;
const MOBILE_MAX_WIDTH = 768;

const HEADER_SELECTOR = "[data-site-header]";
/** Match vertical fit helper to scaled group (FIELD_GROUP_SCALE includes ~+15% hero size). */
const SPHERE_RADIUS_WORLD = 0.52 * 1.15;
const PLANE_Z = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const _offsetHit = new THREE.Vector3();
const _offsetProj = new THREE.Vector3();
const _offsetRaycaster = new THREE.Raycaster();

/**
 * Один вызов `useThree` на компонент: луч + clamp по кромкам шара (см. `useParticleFieldOffsetY` ранее в lib — убрано из-за webpack/HMR).
 */
function useParticleFieldOffsetY(camera: THREE.Camera, gl: THREE.WebGLRenderer, fieldWorldX: number) {
  const [y, setY] = useState(0.06);

  useLayoutEffect(() => {
    const canvas = gl.domElement;
    let canvasRect = canvas.getBoundingClientRect();

    const sphereVerticalExtent = (worldY: number): { top: number; bottom: number } => {
      _offsetProj.set(fieldWorldX, worldY + SPHERE_RADIUS_WORLD, 0).project(camera);
      const c1 = (1 - _offsetProj.y) / 2 * canvasRect.height + canvasRect.top;
      _offsetProj.set(fieldWorldX, worldY - SPHERE_RADIUS_WORLD, 0).project(camera);
      const c2 = (1 - _offsetProj.y) / 2 * canvasRect.height + canvasRect.top;
      return { top: Math.min(c1, c2), bottom: Math.max(c1, c2) };
    };

    const update = () => {
      canvasRect = canvas.getBoundingClientRect();
      const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);
      const h = canvasRect.height;
      if (!header || h < 8) return;

      const hb = header.getBoundingClientRect().bottom;
      const bottomEdge = canvasRect.bottom;
      const bandCenterClientY = (hb + bottomEdge) / 2;

      const localY = bandCenterClientY - canvasRect.top;
      const ndcY = -(localY / h) * 2 + 1;
      _offsetProj.set(fieldWorldX, 0, 0).project(camera);
      const ndcX = _offsetProj.x;

      _offsetRaycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      _offsetRaycaster.ray.intersectPlane(PLANE_Z, _offsetHit);
      let idealY = _offsetHit.y;

      const margin = 8;
      const topBound = hb + margin;
      const bottomBound = bottomEdge - margin;

      const fits = (worldY: number) => {
        const { top, bottom } = sphereVerticalExtent(worldY);
        return top >= topBound && bottom <= bottomBound;
      };

      if (!fits(idealY)) {
        const step = 0.014;
        for (let i = 0; i < 48; i++) {
          const { top, bottom } = sphereVerticalExtent(idealY);
          if (top >= topBound && bottom <= bottomBound) break;
          if (top < topBound) idealY -= step;
          else if (bottom > bottomBound) idealY += step;
          else break;
        }
      }

      if (!fits(idealY)) {
        const midLocal = (topBound + bottomBound) / 2 - canvasRect.top;
        const ndcYM = -(midLocal / h) * 2 + 1;
        _offsetRaycaster.setFromCamera(new THREE.Vector2(ndcX, ndcYM), camera);
        _offsetRaycaster.ray.intersectPlane(PLANE_Z, _offsetHit);
        idealY = _offsetHit.y;
        for (let i = 0; i < 48; i++) {
          const { top, bottom } = sphereVerticalExtent(idealY);
          if (top >= topBound && bottom <= bottomBound) break;
          if (top < topBound) idealY -= 0.014;
          else if (bottom > bottomBound) idealY += 0.014;
          else break;
        }
      }

      setY(idealY);
    };

    update();

    const roCanvas = new ResizeObserver(update);
    roCanvas.observe(canvas);

    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);
    const roHeader = new ResizeObserver(update);
    if (header) roHeader.observe(header);

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      roCanvas.disconnect();
      roHeader.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [camera, gl, fieldWorldX]);

  return y;
}

/**
 * Scroll-driven `uniforms` from `useNarrativeScroll` are not applied to the shader:
 * blending with calm/credibility/calmField tanked globalAlpha and sand mode while the
 * fixed canvas stayed visible — looked like pixelated noise (see partner sections).
 * Hotspot + hero zones still update from scroll.
 */
export function ParticleField({
  motionScale,
  hotspot,
  zones,
  reducedMotion,
  qualityTier,
  ..._rest
}: Props) {
  void _rest.uniforms;
  const { camera, size, gl } = useThree();
  const [isMobile, setIsMobile] = useState(false);
  const fieldOffsetX = isMobile ? 0.54 : FIELD_OFFSET_XZ[0];
  const dynamicFieldOffsetY = useParticleFieldOffsetY(camera, gl, fieldOffsetX);
  // iOS viewport height changes while scrolling (address bar), so keep mobile sphere anchored.
  const fieldOffsetY = isMobile ? 0.06 : dynamicFieldOffsetY;
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pointerNDC = useRef(new THREE.Vector2(0, 0));
  const tabHiddenRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onVis = () => {
      tabHiddenRef.current = document.visibilityState === "hidden";
    };
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerNDC.current.set(x, y);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [gl]);

  const geometry = useMemo(
    () => buildSphereFieldGeometry(getStrataForTier(qualityTier)),
    [qualityTier],
  );

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((state, delta) => {
    const m = materialRef.current;
    const pts = pointsRef.current;
    if (!m) return;

    if (tabHiddenRef.current) {
      if (pts) pts.visible = false;
      return;
    }
    if (pts) pts.visible = true;

    const u = m.uniforms;
    const H = HERO_PARTICLE_VIS;
    const mobileVisual = isMobile && !reducedMotion;
    u.uTime.value = state.clock.elapsedTime;
    u.uCohesion.value = H.cohesion;
    u.uNoise.value = H.noise;
    u.uDispersion.value = H.dispersion;
    u.uFlowSpeed.value = H.flowSpeed;
    u.uDirectionStrength.value = H.directionStrength;
    u.uDensity.value = H.density;
    u.uRouteSwirl.value = H.routeSwirl;
    u.uNetworkTension.value = H.networkTension;
    u.uRibbonBand.value = H.ribbonBand;
    u.uVolumeDepth.value = H.volumeDepth;
    u.uShellIntegrity.value = H.shellIntegrity;
    u.uFieldDisorder.value = H.fieldDisorder;
    u.uRouteArc.value = H.routeArc;
    u.uHubField.value = H.hubField;
    u.uConstellation.value = H.constellation;
    u.uFieldRecede.value = H.fieldRecede;
    u.uContentBreath.value = H.contentBreath;
    u.uHeroZone.value.set(...zones.heroZone);
    u.uHasHeroZone.value = zones.hasHeroZone ? 1 : 0;
    u.uDepthZ0.value.set(...zones.depthZones[0]);
    u.uDepthZ1.value.set(...zones.depthZones[1]);
    u.uDepthZ2.value.set(...zones.depthZones[2]);
    u.uDepthStrength.value = 0;
    u.uDepthLift.value.set(DEPTH_LIFT.x, DEPTH_LIFT.y, DEPTH_LIFT.z);
    u.uGlow.value = H.glow * (mobileVisual ? 0.58 : 1);
    u.uGlobalAlpha.value = H.globalAlpha * (mobileVisual ? 0.6 : 1);
    u.uMotionScale.value = motionScale;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uResolution.value.set(size.width, size.height);
    u.uPointerNDC.value.copy(pointerNDC.current);
    u.uPointerStrength.value = reducedMotion || isMobile ? 0 : 1;
    u.uPointerSpray.value = reducedMotion || isMobile ? 0 : 1.22;

    u.uSandLifecycle.value = H.sandLifecycle;
    u.uLifeSec.value = HERO_LIFE_SEC;
    u.uPathSpeedMul.value = reducedMotion ? 0.5 : HERO_PATH_SPEED_MUL * (mobileVisual ? 0.52 : 1);

    const hs = reducedMotion ? 0.28 : 1;
    u.uHotspot.value.set(hotspot.nx, hotspot.ny, hotspot.nr, hotspot.strength * hs);
    u.uHotspotProof.value.set(
      zones.hotspotProof.nx,
      zones.hotspotProof.ny,
      zones.hotspotProof.nr,
      zones.hotspotProof.strength * hs,
    );
    u.uHotspotAI.value.set(
      zones.hotspotAI.nx,
      zones.hotspotAI.ny,
      zones.hotspotAI.nr,
      zones.hotspotAI.strength * hs,
    );

    const g = groupRef.current;
    if (g) {
      const ω = reducedMotion ? GROUP_YAW_SPEED_REDUCED : GROUP_YAW_SPEED;
      const sandLock = 1 - H.sandLifecycle * 0.92;
      g.rotation.y += delta * ω * sandLock * (mobileVisual ? 0.52 : 1);
    }

    m.blending = THREE.AdditiveBlending;
  });

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCohesion: { value: HERO_PARTICLE_VIS.cohesion },
      uNoise: { value: HERO_PARTICLE_VIS.noise },
      uDispersion: { value: HERO_PARTICLE_VIS.dispersion },
      uFlowSpeed: { value: HERO_PARTICLE_VIS.flowSpeed },
      uDirectionStrength: { value: HERO_PARTICLE_VIS.directionStrength },
      uDensity: { value: HERO_PARTICLE_VIS.density },
      uRouteSwirl: { value: HERO_PARTICLE_VIS.routeSwirl },
      uNetworkTension: { value: HERO_PARTICLE_VIS.networkTension },
      uRibbonBand: { value: HERO_PARTICLE_VIS.ribbonBand },
      uVolumeDepth: { value: HERO_PARTICLE_VIS.volumeDepth },
      uShellIntegrity: { value: HERO_PARTICLE_VIS.shellIntegrity },
      uFieldDisorder: { value: HERO_PARTICLE_VIS.fieldDisorder },
      uRouteArc: { value: HERO_PARTICLE_VIS.routeArc },
      uHubField: { value: HERO_PARTICLE_VIS.hubField },
      uConstellation: { value: HERO_PARTICLE_VIS.constellation },
      uFieldRecede: { value: HERO_PARTICLE_VIS.fieldRecede },
      uContentBreath: { value: HERO_PARTICLE_VIS.contentBreath },
      uHeroZone: { value: new THREE.Vector4(0, 0, 0, 0) },
      uHasHeroZone: { value: 0 },
      uDepthZ0: { value: new THREE.Vector4(0, 0, 0, 0) },
      uDepthZ1: { value: new THREE.Vector4(0, 0, 0, 0) },
      uDepthZ2: { value: new THREE.Vector4(0, 0, 0, 0) },
      uDepthStrength: { value: 0 },
      uDepthLift: { value: new THREE.Vector3(DEPTH_LIFT.x, DEPTH_LIFT.y, DEPTH_LIFT.z) },
      uGlow: { value: HERO_PARTICLE_VIS.glow },
      uGlobalAlpha: { value: HERO_PARTICLE_VIS.globalAlpha },
      uMotionScale: { value: motionScale },
      uPixelRatio: { value: 1 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointerNDC: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uPointerSpray: { value: 1.22 },
      uSandLifecycle: { value: HERO_PARTICLE_VIS.sandLifecycle },
      uLifeSec: { value: HERO_LIFE_SEC },
      uPathSpeedMul: { value: HERO_PATH_SPEED_MUL },
      uColor: { value: new THREE.Color("#8eb5ff") },
      uColorHi: { value: new THREE.Color("#ffffff") },
      uHotspot: { value: new THREE.Vector4(0.5, 0.5, 0.4, 0) },
      uHotspotProof: { value: new THREE.Vector4(0.5, 0.5, 0.4, 0) },
      uHotspotAI: { value: new THREE.Vector4(0.5, 0.5, 0.4, 0) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- synced in useFrame
    [],
  );

  return (
    <group
      position={[fieldOffsetX, fieldOffsetY, FIELD_OFFSET_XZ[2]]}
      ref={groupRef}
      scale={isMobile ? FIELD_GROUP_SCALE * 0.72 : FIELD_GROUP_SCALE}
    >
      <points ref={pointsRef} frustumCulled={false} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          uniforms={shaderUniforms}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
