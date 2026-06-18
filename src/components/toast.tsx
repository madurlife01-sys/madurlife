"use client";

import { useState, useEffect, useCallback } from "react";

let toastId = 0;

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error";
}

let listeners: Array<(t: Toast) => void> = [];

export function toast(message: string, type?: "success" | "error") {
  const t = { id: ++toastId, message, type };
  listeners.forEach((l) => l(t));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, 3000);
  }, []);

  useEffect(() => {
    listeners.push(add);
    return () => {
      listeners = listeners.filter((l) => l !== add);
    };
  }, [add]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      {toasts.map((t) => {
        const isError = t.type === "error";
        return (
          <div
            key={t.id}
            className="pointer-events-auto animate-slide-in-left"
          >
            <div
              className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-xl border backdrop-blur-md ${
                isError
                  ? "bg-red-50/95 dark:bg-red-950/95 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
                  : "bg-white/95 dark:bg-zinc-900/95 text-foreground border-border"
              }`}
            >
              {isError ? (
                <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{t.message}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
