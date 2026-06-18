"use client";

import { useLanguage } from "@/hooks/use-language";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "kn" : "en")}
      className="flex h-8 items-center rounded-full border border-border px-3 text-xs font-medium text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
    >
      {locale === "en" ? "ಕನ್ನಡ" : "English"}
    </button>
  );
}
