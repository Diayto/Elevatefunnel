export const particleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uCohesion;
uniform float uNoise;
uniform float uDispersion;
uniform float uFlowSpeed;
uniform float uDirectionStrength;
uniform float uDensity;
uniform float uRouteSwirl;
uniform float uNetworkTension;
uniform float uRibbonBand;
uniform float uVolumeDepth;
uniform float uShellIntegrity;
uniform float uFieldDisorder;
uniform float uRouteArc;
uniform float uHubField;
uniform float uConstellation;
uniform float uFieldRecede;
uniform float uContentBreath;
uniform vec4 uHeroZone;
uniform float uHasHeroZone;
uniform vec4 uDepthZ0;
uniform vec4 uDepthZ1;
uniform vec4 uDepthZ2;
uniform float uDepthStrength;
uniform vec3 uDepthLift;
uniform float uMotionScale;
uniform float uPixelRatio;
uniform vec2 uResolution;
uniform vec2 uPointerNDC;
uniform float uPointerStrength;
uniform float uPointerSpray;
uniform float uSandLifecycle;
uniform float uLifeSec;
uniform float uPathSpeedMul;

attribute float aSeed;
attribute float aStratum;

varying float vAlpha;
varying float vRim;
varying float vDepth;
varying float vStratum;
varying float vGrain;
varying float vAccent;
varying float vContentDim;
varying float vRadialAlpha;
varying float vLifeEnv;
varying float vSizeJitter;
varying float vSpark;

float hash3(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}

float rectFalloff(vec2 p, vec4 z, float edgeW) {
  if (z.z < 1e-4 || z.w < 1e-4) return 0.0;
  vec2 mn = z.xy;
  vec2 mx = z.xy + z.zw;
  vec2 q = clamp(p, mn, mx);
  float dist = length(p - q);
  return 1.0 - smoothstep(0.0, edgeW, dist);
}

void main() {
  vec3 base = position;
  float seed = aSeed;
  float st = aStratum;
  float t = uTime * uFlowSpeed * uMotionScale;
  float tIdle = uTime * uMotionScale;
  float rec = clamp(uFieldRecede, 0.0, 1.0);

  vec3 n0 = normalize(base);
  float r0 = length(base);

  float thick = mix(0.11, 0.04, uShellIntegrity) * uVolumeDepth;
  float rJ = r0 * (1.0 + (hash3(base * 3.2 + seed * 0.01) - 0.5) * thick);
  vec3 shell = n0 * rJ;

  vec3 tanX = normalize(cross(n0, vec3(0.0, 1.0, 0.0007)));
  vec3 tanY = cross(n0, tanX);

  vec3 posClassic = shell;
  float breath =
    sin(t * 0.52 + dot(n0, vec3(0.62, 0.38, 0.21)) * 2.8) * 0.028 * (0.35 + uCohesion * 0.65);
  breath += sin(t * 0.31 + seed * 0.017) * 0.014 * (1.0 - rec);
  posClassic *= 1.0 + breath;
  posClassic *= mix(1.0, 0.78, rec);

  float wander = mix(0.018, 0.11, uFieldDisorder) * (0.4 + uNoise * 0.35);
  wander += uRouteArc * 0.035 + uRouteSwirl * 0.03;
  posClassic += tanX * sin(t * 0.21 + dot(n0, vec3(1.4, 0.6, 0.35)) * 4.2 + seed) * wander;
  posClassic += tanY * cos(t * 0.18 + dot(n0, vec3(0.5, 1.3, 0.25)) * 3.8 + seed * 0.6) * wander * 0.92;
  posClassic += n0 * sin(t * 0.14 + seed * 0.08) * uNoise * 0.035;

  float turb =
    mix(0.022, 0.055, uFieldDisorder) * (0.55 + uNoise * 0.45);
  posClassic += tanX * sin(tIdle * 0.36 + dot(n0, vec3(0.9, 1.1, 0.4)) * 3.1 + seed * 0.4) * turb;
  posClassic += tanY * cos(tIdle * 0.33 + dot(n0, vec3(1.2, 0.5, 0.6)) * 2.7 + seed * 0.55) * turb * 0.95;
  posClassic += cross(n0, vec3(0.15, 0.85, 0.12)) * sin(tIdle * 0.22 + seed * 0.03) * turb * 0.55;

  float cons = uConstellation * (1.0 - rec * 0.5);
  float pull = cons * 0.06 * (0.5 + uNetworkTension * 0.5);
  posClassic -= n0 * pull * sin(t * 0.11 + dot(n0, vec3(0.3, 0.7, 0.2)) * 2.0);

  float h0 = fract(hash3(vec3(seed * 0.01, st * 0.1, seed * 0.002)));
  float h1 = fract(sin(seed * 12.9898) * 43758.5453);
  float h2 = fract(sin(seed * 78.233) * 12345.6789);
  float h3 = fract(sin(seed * 39.341) * 98765.4321);

  float rate = uMotionScale / max(uLifeSec, 0.05);
  float phase = fract(h0 + uTime * rate);
  float lifeEnvSand = max(sin(phase * 3.14159265359), 0.001);

  float pm = max(uPathSpeedMul, 0.05);
  float f1 = 1.0 + h1 * 5.5;
  float f2 = 1.0 + h2 * 5.5;
  float f3 = 1.0 + h3 * 4.2;
  float amp = mix(0.065, 0.18, uFieldDisorder) * (0.5 + uNoise * 0.5) * lifeEnvSand;

  vec3 posSand = shell;
  posSand += tanX * sin(phase * 6.2831853 * f1 * pm + seed * 2.7 + h2 * 8.0) * amp;
  posSand += tanY * cos(phase * 6.2831853 * f2 * pm + seed * 1.9 + h3 * 6.0) * amp * 0.95;
  posSand += n0 * sin(phase * 6.2831853 * f3 * 0.48 * pm + seed * 3.1) * amp * 0.28;
  posSand += tanX * sin(phase * 18.849555 * (0.35 + h2 * 1.3) * pm + seed * 4.0) * amp * 0.32;
  posSand += cross(tanX, tanY) * sin(phase * 12.56637 * (0.4 + h3 * 1.1) * pm + seed * 0.6) * amp * 0.26;
  posSand *= 1.0 + lifeEnvSand * 0.028 * sin(phase * 12.56637 * pm + seed);

  float rShell = length(shell);
  float lenSand = length(posSand);
  posSand = normalize(posSand) * clamp(lenSand, rShell * 0.969, rShell * 1.031);

  float sizeJit = pow(clamp(h2, 0.001, 1.0), 0.82);
  vSizeJitter = mix(1.0, mix(0.1, 1.0, sizeJit), uSandLifecycle);

  float sparkAmt = pow(clamp(h3, 0.03, 1.0), 0.72);
  vSpark = mix(1.0, mix(0.2, 1.0, sparkAmt), uSandLifecycle);

  vLifeEnv = mix(1.0, lifeEnvSand, uSandLifecycle);

  vec3 pos = mix(posClassic, posSand, uSandLifecycle);

  vec3 nPos = normalize(pos);
  vec4 mvTry = modelViewMatrix * vec4(pos, 1.0);
  vec4 clipTry = projectionMatrix * mvTry;
  vec2 ndcParticle = clipTry.xy / clipTry.w;
  float pd = distance(ndcParticle, uPointerNDC);
  float pinf = smoothstep(0.88, 0.0, pd) * uPointerStrength;
  float pFall = pinf * pinf;

  pos += nPos * pinf * (0.11 + uHubField * 0.04);

  vec3 orth = normalize(cross(n0, vec3(0.37, 0.82, 0.15)));
  vec3 bitan = normalize(cross(n0, orth));
  float wb = uTime * (2.0 + uSandLifecycle * 2.5);
  pos += orth * sin(seed * 0.071 + wb) * pFall * uPointerSpray * 0.58;
  pos += bitan * cos(seed * 0.064 + wb * 0.85) * pFall * uPointerSpray * 0.52;
  pos += tanX * sin(seed * 0.12 + uTime * 2.8) * pFall * uPointerSpray * 0.42;
  pos += tanY * cos(seed * 0.095 + uTime * 2.35) * pFall * uPointerSpray * 0.4;

  float rMag = length(pos);
  float rNorm = rMag / max(0.42, 1e-4);
  vRadialAlpha = mix(0.94, 1.0, smoothstep(0.12, 0.5, rNorm));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vec4 clipPos = projectionMatrix * mvPosition;
  vec2 screen01 = clipPos.xy / clipPos.w * 0.5 + 0.5;

  float rectP = rectFalloff(screen01, uHeroZone, 0.09);
  float heroPres = rectP * clamp(uHasHeroZone, 0.0, 1.0);
  vContentDim = mix(1.0, 0.82, uContentBreath * heroPres);

  float dz = 1.0;
  float ds = clamp(uDepthStrength, 0.0, 1.0);
  if (ds > 0.008) {
    float edgeD = 0.128;
    float pL = rectFalloff(screen01, uDepthZ0, edgeD);
    float pM = rectFalloff(screen01, uDepthZ1, edgeD);
    float pR = rectFalloff(screen01, uDepthZ2, edgeD);
    float bleed = max(pL, max(pM, pR)) * 0.08;
    dz += ds * (bleed + (uDepthLift.x * pL + uDepthLift.y * pM + uDepthLift.z * pR));
  }

  gl_Position = clipPos;

  vRim = pow(
    clamp(1.0 - abs(dot(normalize(mvPosition.xyz), vec3(0.0, 0.0, 1.0))), 0.0, 1.0),
    0.55
  );
  vDepth = clamp(0.45 + pos.z * 1.1, 0.0, 1.0);
  vStratum = st;
  vGrain = fract(seed * 0.318309886);
  vAccent = step(2.5, st);

  float micro = 0.74 + 0.26 * fract(seed * 12.9898);
  micro *= mix(1.0, 0.68, step(0.5, st) * (1.0 - step(1.5, st)));
  micro *= mix(1.0, 0.75, step(1.5, st) * (1.0 - step(2.5, st)));
  micro *= mix(1.0, 1.06, step(2.5, st));

  float size = (23.5 * uDensity) / max(-mvPosition.z, 0.48);
  size *= uPixelRatio;
  size *= micro;
  size *= mix(0.88, 1.02, vRim);
  size *= mix(1.0, 0.82, rec);
  size *= dz;
  size *= mix(0.92, 1.0, uDirectionStrength);
  size *= mix(1.0, vLifeEnv * vSizeJitter * vSpark * 0.54, uSandLifecycle);
  float sMin = mix(0.35, 0.1, uSandLifecycle);
  float sMax = mix(9.0, 5.85, uSandLifecycle);
  gl_PointSize = clamp(size, sMin, sMax);

  vAlpha = mix(1.0, 0.9, rec);
}
`;

export const particleFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorHi;
uniform float uGlow;
uniform float uGlobalAlpha;
uniform float uTime;
uniform float uNoise;
uniform vec2 uResolution;
uniform vec4 uHotspot;
uniform vec4 uHotspotProof;
uniform vec4 uHotspotAI;
uniform float uSandLifecycle;

varying float vAlpha;
varying float vRim;
varying float vDepth;
varying float vStratum;
varying float vGrain;
varying float vAccent;
varying float vContentDim;
varying float vRadialAlpha;
varying float vLifeEnv;
varying float vSpark;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;

  float st = vStratum;
  float microW = step(0.5, st) * (1.0 - step(1.5, st));
  float coreW = step(1.5, st) * (1.0 - step(2.5, st));

  float coreSoft = smoothstep(0.5, 0.496, d);
  float coreSand = pow(smoothstep(0.5, 0.4995, d), 1.08);
  float core = mix(coreSoft, coreSand, uSandLifecycle);
  float rim = exp(-d * 40.0) * uGlow * mix(0.04, 0.004, uSandLifecycle);
  float mist = exp(-d * 9.5) * uGlow * 0.42 * uSandLifecycle;

  float ph = vGrain * 6.2831853;
  float fa = 0.5 + 0.5 * sin(uTime * 1.48 + ph * 7.0 + vStratum * 0.9);
  float fb = 0.5 + 0.5 * sin(uTime * 0.96 + ph * 2.6 + vAccent * 1.4);
  float fc = 0.5 + 0.5 * sin(uTime * 2.15 + ph * 11.0);
  float flicker = mix(0.86, 1.0, fa * fb) * (0.82 + 0.18 * fc);
  flicker = mix(flicker, 1.0, uSandLifecycle * 0.88);

  float depthTone = mix(0.96, 1.04, vDepth);
  float strataMul = mix(1.0, 0.94, microW * 0.35) * mix(1.0, 0.96, coreW * 0.22);
  strataMul *= mix(1.0, 1.02, vAccent * 0.08);

  float a = core * uGlobalAlpha * vAlpha * depthTone * vContentDim * strataMul * vRadialAlpha;
  a *= mix(1.0, vSpark, uSandLifecycle);
  a += rim * uGlobalAlpha * mix(0.06, 0.015, uSandLifecycle) * vContentDim * vRadialAlpha;
  a *= mix(0.94, 1.0, vGrain);
  a *= flicker;
  a *= vLifeEnv;
  a = clamp(a, 0.0, mix(0.92, 0.98, uSandLifecycle));

  float hi = clamp(rim * 1.1 + vDepth * 0.14 + vAccent * 0.15, 0.0, 1.0);
  float sparkHi = mix(hi * 0.55, vSpark * 0.76 + hi * 0.1, uSandLifecycle);
  vec3 col = mix(uColor, uColorHi, sparkHi);
  col += mist * mix(uColorHi, vec3(1.0), 0.35) * (0.14 + vSpark * 0.14);

  if (uHotspot.w > 0.002) {
    vec2 hp = uHotspot.xy * uResolution;
    float radPx = uHotspot.z * min(uResolution.x, uResolution.y);
    float distH = distance(gl_FragCoord.xy, hp);
    float bump = (1.0 - smoothstep(0.0, radPx, distH)) * uHotspot.w;
    a *= (1.0 + bump * 0.1);
    col = mix(col, uColorHi, bump * 0.06);
  }

  if (uHotspotProof.w > 0.002) {
    vec2 hpp = uHotspotProof.xy * uResolution;
    float radP = uHotspotProof.z * min(uResolution.x, uResolution.y);
    float distP = distance(gl_FragCoord.xy, hpp);
    float bumpP = pow(
      (1.0 - smoothstep(0.0, radP, distP)) * uHotspotProof.w,
      1.25
    );
    a *= (1.0 + bumpP * 0.045);
    col = mix(col, uColorHi, bumpP * 0.028);
  }

  if (uHotspotAI.w > 0.002) {
    vec2 hpa = uHotspotAI.xy * uResolution;
    float radA = uHotspotAI.z * min(uResolution.x, uResolution.y);
    float distA = distance(gl_FragCoord.xy, hpa);
    float bumpA = pow(
      (1.0 - smoothstep(0.0, radA, distA)) * uHotspotAI.w,
      1.25
    );
    a *= (1.0 + bumpA * 0.038);
    col = mix(col, uColorHi, bumpA * 0.022);
  }

  gl_FragColor = vec4(col, a);
}
`;
