"use client";

import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "@/components/toast";
import type { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        {children}
        <ToastContainer />
      </LanguageProvider>
    </ThemeProvider>
  );
}
