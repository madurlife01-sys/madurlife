"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-in-up" | "fade-in" | "scale-in" | "slide-in-left";
}

const animationMap = {
  "fade-in-up": "animate-fade-in-up",
  "fade-in": "animate-fade-in",
  "scale-in": "animate-scale-in",
  "slide-in-left": "animate-slide-in-left",
};

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  animation = "fade-in-up",
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? undefined : 0,
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className={isVisible ? animationMap[animation] : ""}
        style={{
          animationDelay: `${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
