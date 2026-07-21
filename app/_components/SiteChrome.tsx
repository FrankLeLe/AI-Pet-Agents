import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { Language } from "@/lib/pets";
import { normalizeLanguage, t, withLanguage } from "@/lib/i18n";

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
  { href: "/help", zh: "安装帮助", en: "Install Help" },
] as const;

const FOOTER_ITEMS = [
  ...NAV_ITEMS,
  { href: "/install", zh: "安装", en: "Install" },
] as const;

export { normalizeLanguage, t, withLanguage };

export function SiteHeader({ language, currentPath }: SiteHeaderProps) {
  return (
    <header className={styles.siteHeader}>
      <Link
        className={styles.brand}
        href={withLanguage("/", language)}
        prefetch={false}
        aria-label={t(language, "Codex Pets 首页", "Codex Pets home")}
      >
        <span className={styles.brandMark} aria-hidden="true">
          <Sparkles size={24} strokeWidth={3} />
        </span>
        <span>CODEX PETS</span>
      </Link>

      <nav className={styles.primaryNav} aria-label={t(language, "主要导航", "Primary navigation")}>
        {NAV_ITEMS.map((item) => {
          const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);

          return (
            <Link
              className={active ? styles.navActive : undefined}
              href={withLanguage(item.href, language)}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              key={item.href}
            >
              {t(language, item.zh, item.en)}
            </Link>
          );
        })}
      </nav>

      <div className={styles.headerActions}>
        <div className={styles.languageSwitch} aria-label={t(language, "选择语言", "Choose language")}>
          <Link
            className={language === "zh" ? styles.languageActive : undefined}
            href={withLanguage(currentPath, "zh")}
            prefetch={false}
            lang="zh-CN"
            aria-current={language === "zh" ? "true" : undefined}
          >
            中
          </Link>
          <Link
            className={language === "en" ? styles.languageActive : undefined}
            href={withLanguage(currentPath, "en")}
            prefetch={false}
            lang="en"
            aria-current={language === "en" ? "true" : undefined}
          >
            EN
          </Link>
        </div>
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
          "© 2026 Codex Pets。角色与故事均为原创；无需登录即可浏览和下载。本项目独立制作，不代表 OpenAI 官方背书。",
          "© 2026 Codex Pets. Characters and stories are original. Browse and download without an account. This independent project is not officially endorsed by OpenAI.",
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
      <SiteHeader language={language} currentPath={currentPath} />
      {children}
      <SiteFooter language={language} />
    </div>
  );
}
