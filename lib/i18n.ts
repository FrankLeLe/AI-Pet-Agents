import type { Language } from "./pets";

export function normalizeLanguage(value: string | string[] | undefined): Language {
  return value === "en" ? "en" : "zh";
}

export function t(language: Language, zh: string, en: string) {
  return language === "zh" ? zh : en;
}

export function withLanguage(path: string, language: Language) {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const pathWithoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const separator = pathWithoutHash.includes("?") ? "&" : "?";
  return `${pathWithoutHash}${separator}lang=${language}${hash}`;
}
