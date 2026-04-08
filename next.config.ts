import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** R3F + three: stable ESM interop under Webpack (avoids occasional runtime chunk errors). */
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "maath"],
};

export default nextConfig;
