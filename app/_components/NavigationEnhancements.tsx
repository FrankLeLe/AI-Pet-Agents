"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { t } from "@/lib/i18n";
import type { Language } from "@/lib/pets";

import styles from "./site-chrome.module.css";

type LanguageSwitchProps = {
  language: Language;
  currentPath: string;
};

type HashScrollRestorerProps = {
  routeKey: string;
};

type DocumentLanguageProps = {
  language: Language;
};

export function DocumentLanguage({ language }: DocumentLanguageProps) {
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  return null;
}

export function LanguageSwitch({ language, currentPath }: LanguageSwitchProps) {
  const [currentLocation, setCurrentLocation] = useState(currentPath);

  useEffect(() => {
    const syncLocation = () => {
      setCurrentLocation(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    };

    syncLocation();
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);

    return () => {
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
    };
  }, [currentPath]);

  function languageHref(nextLanguage: Language) {
    const url = new URL(currentLocation, "https://aipetsagent.com");
    url.searchParams.set("lang", nextLanguage);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  return (
    <div className={styles.languageSwitch} aria-label={t(language, "选择语言", "Choose language")}>
      <Link
        className={language === "zh" ? styles.languageActive : undefined}
        href={languageHref("zh")}
        lang="zh-CN"
        aria-current={language === "zh" ? "true" : undefined}
      >
        中
      </Link>
      <Link
        className={language === "en" ? styles.languageActive : undefined}
        href={languageHref("en")}
        lang="en"
        aria-current={language === "en" ? "true" : undefined}
      >
        EN
      </Link>
    </div>
  );
}

export function HashScrollRestorer({ routeKey }: HashScrollRestorerProps) {
  useEffect(() => {
    function scrollToHash(smooth: boolean) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        block: "start",
        behavior: smooth && !reduceMotion ? "smooth" : ("instant" as ScrollBehavior),
      });

      if (target instanceof HTMLElement) {
        if (!target.hasAttribute("tabindex")) {
          target.tabIndex = -1;
        }
        target.focus({ preventScroll: true });
      }
    }

    function restoreInitialHash() {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToHash(false));
      });
    }

    restoreInitialHash();

    if (document.readyState !== "complete") {
      window.addEventListener("load", restoreInitialHash, { once: true });
    }

    const handleHashChange = () => scrollToHash(true);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("load", restoreInitialHash);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [routeKey]);

  return null;
}
