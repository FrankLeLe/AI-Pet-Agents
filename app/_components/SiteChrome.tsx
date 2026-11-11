import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { Language } from "@/lib/pets";
import { normalizeLanguage, t, withLanguage } from "@/lib/i18n";

import {
  DocumentLanguage,
  HashScrollRestorer,
  LanguageSwitch,
} from "./NavigationEnhancements";
import styles from "./site-chrome.module.css";

type SiteHeaderProps = {
  language: Language;
  currentPath: string;
};

type SiteFooterProps = {
  language: Language;
};

type PageShellProps = SiteHeaderProps & {
  children: ReactNode;
};

const NAV_ITEMS = [
  { href: "/pets", zh: "宠物图鉴", en: "Pet Index" },
  { href: "/hatch", zh: "造宠工坊", en: "Pet Workshop" },
  { href: "/install", zh: "安装", en: "Install" },
] as const;

const FOOTER_ITEMS = [
  ...NAV_ITEMS,
  { href: "/help", zh: "安装帮助", en: "Install Help" },
] as const;

export { normalizeLanguage, t, withLanguage };

function isNavItemActive(currentPath: string, itemHref: string) {
  if (itemHref === "/pets" && currentPath.startsWith("/series/")) {
    return true;
  }

  return currentPath === itemHref || currentPath.startsWith(`${itemHref}/`);
}

export function SiteHeader({ language, currentPath }: SiteHeaderProps) {
  return (
    <header className={styles.siteHeader}>
      <Link
        className={styles.brand}
        href={withLanguage("/", language)}
        aria-label={t(language, "Codex Pets 首页", "Codex Pets home")}
      >
        <span className={styles.brandMark} aria-hidden="true">
          <Sparkles size={24} strokeWidth={3} />
        </span>
        <span>CODEX PETS</span>
      </Link>

      <nav className={styles.primaryNav} aria-label={t(language, "主要导航", "Primary navigation")}>
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(currentPath, item.href);

          return (
            <Link
              className={active ? styles.navActive : undefined}
              href={withLanguage(item.href, language)}
              aria-current={active ? "page" : undefined}
              key={item.href}
            >
              {t(language, item.zh, item.en)}
            </Link>
          );
        })}
      </nav>

      <div className={styles.headerActions}>
        <LanguageSwitch language={language} currentPath={currentPath} />
      </div>
    </header>
  );
}

export function SiteFooter({ language }: SiteFooterProps) {
  return (
    <footer className={styles.siteFooter}>
      <div>
        <strong>CODEX PETS</strong>
        <span>{t(language, "给 Codex 桌面加一位会动的伙伴。", "Add an animated companion to your Codex desktop.")}</span>
      </div>
      <nav aria-label={t(language, "页脚导航", "Footer navigation")}>
        {FOOTER_ITEMS.map((item) => (
          <Link href={withLanguage(item.href, language)} prefetch={false} key={item.href}>
            {t(language, item.zh, item.en)}
          </Link>
        ))}
      </nav>
      <p>
        {t(
          language,
          "© 2026 Codex Pets。官方智能伙伴角色。",
          "© 2026 Codex Pets. Official intelligent companion characters.",
        )}
      </p>
    </footer>
  );
}

export function PageShell({ language, currentPath, children }: PageShellProps) {
  return (
    <div className={styles.pageShell} lang={language === "zh" ? "zh-CN" : "en"}>
      <a className={styles.skipLink} href="#main-content">
        {t(language, "跳到主要内容", "Skip to main content")}
      </a>
      <DocumentLanguage language={language} />
      <HashScrollRestorer routeKey={`${currentPath}:${language}`} />
      <SiteHeader language={language} currentPath={currentPath} />
      {children}
      <SiteFooter language={language} />
    </div>
  );
}
