"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { en } from "@/lib/i18n/en";
import { kn } from "@/lib/i18n/kn";

type Translations = typeof en;

interface LanguageContextType {
  locale: "en" | "kn";
  t: Translations;
  setLocale: (locale: "en" | "kn") => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

const translations = { en, kn };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<"en" | "kn">("en");

  useEffect(() => {
    const stored = localStorage.getItem("madur-life-lang");
    if (stored === "en" || stored === "kn") setLocale(stored);
  }, []);

  const setLocaleAndPersist = (newLocale: "en" | "kn") => {
    setLocale(newLocale);
    localStorage.setItem("madur-life-lang", newLocale);
    document.cookie = `madur-life-lang=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        t: translations[locale],
        setLocale: setLocaleAndPersist,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
