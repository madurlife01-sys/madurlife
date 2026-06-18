"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function usePageTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.killTweensOf(ref.current);
      
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
      );

      const items = ref.current.querySelectorAll(".animate-item");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            delay: 0.15,
          }
        );
      }
    }
  }, []);

  return ref;
}
