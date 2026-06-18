"use client";

import dynamic from "next/dynamic";

const FloatingIngredientsInner = dynamic(
  () => import("@/components/three/floating-ingredients").then((m) => m.FloatingIngredients),
  { ssr: false }
);

export function FloatingIngredientsWrapper({ categorySlug }: { categorySlug?: string }) {
  return <FloatingIngredientsInner categorySlug={categorySlug} />;
}
