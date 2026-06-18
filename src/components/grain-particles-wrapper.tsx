"use client";

import dynamic from "next/dynamic";

const GrainParticlesInner = dynamic(
  () => import("@/components/three/grain-particles").then((m) => m.GrainParticles),
  { ssr: false }
);

export function GrainParticlesWrapper() {
  return <GrainParticlesInner />;
}
