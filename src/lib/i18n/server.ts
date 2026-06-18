import { cookies } from "next/headers";
import { en } from "./en";
import { kn } from "./kn";

const translations = { en, kn };

export async function getServerTranslations() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("madur-life-lang")?.value === "kn" ? "kn" : "en";
  return { t: translations[locale], locale };
}
