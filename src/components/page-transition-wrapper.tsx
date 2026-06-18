"use client";

import type { ReactNode } from "react";
import { usePageTransition } from "@/lib/animations/page-transitions";

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const ref = usePageTransition();
  return <div ref={ref}>{children}</div>;
}
