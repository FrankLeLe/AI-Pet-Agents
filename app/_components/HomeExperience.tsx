"use client";

import {
  ArrowRight,
  Check,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { t, withLanguage } from "@/lib/i18n";
import type { AnimationKey } from "@/lib/pet-animation";
import type { Language } from "@/lib/pets";

import styles from "../home.module.css";
import { PetPreview } from "./PetPreview";
import { SpritePet } from "./SpritePet";

type GuideData = {
  petId: string;
  name: string;
  title: string;
  role: string;
  description: string;
};

type HomeMember = {
  petId: string;
  name: string;
  zodiac: string;
  role: string;
  specialty: string;
  accent: string;
  softAccent: string;
};

type HomeSeries = {
  id: string;
  name: string;
  subtitle: string;
  status: string;
  description: string;
  storyTitle: string;
  storyChapter: string;
  story: string;
  members: HomeMember[];
};

type HomeExperienceProps = {
  language: Language;
  guide: GuideData;
  series: HomeSeries;
};

type MemberStyle = CSSProperties & {
  "--member-accent": string;
  "--member-soft": string;
};

const GUIDE_DEMOS: readonly {
  animation: AnimationKey;
  zhLabel: string;
  enLabel: string;
}[] = [
  { animation: "waving", zhLabel: "挥手", enLabel: "Wave" },
  { animation: "running", zhLabel: "工作", enLabel: "Work" },
  { animation: "review", zhLabel: "检查", enLabel: "Review" },
];

export function HomeExperience({ language, guide, series }: HomeExperienceProps) {
  const memberStripRef = useRef<HTMLDivElement>(null);
  const [guideDemoIndex, setGuideDemoIndex] = useState<number | null>(null);
  const [memberBounds, setMemberBounds] = useState({ atStart: true, atEnd: false });
  const guideDemo = GUIDE_DEMOS[guideDemoIndex ?? 0];

  useEffect(() => {
    const strip = memberStripRef.current;
    if (!strip) return;

    const updateBounds = () => {
      const maxScroll = Math.max(strip.scrollWidth - strip.clientWidth, 0);
      setMemberBounds({
        atStart: strip.scrollLeft <= 2,
        atEnd: strip.scrollLeft >= maxScroll - 2,
      });
    };

    updateBounds();
    strip.addEventListener("scroll", updateBounds, { passive: true });
    window.addEventListener("resize", updateBounds);

    return () => {
      strip.removeEventListener("scroll", updateBounds);
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  function showNextGuideDemo() {
    setGuideDemoIndex((current) =>
      current === null ? 0 : (current + 1) % GUIDE_DEMOS.length,
    );
  }

  function scrollMembers(direction: -1 | 1) {
    const strip = memberStripRef.current;
    if (!strip) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    strip.scrollBy({
      left: direction * Math.max(strip.clientWidth * 0.82, 240),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function handleMemberKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollMembers(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollMembers(1);
    }
  }

  return (
    <main className={styles.homeMain} id="main-content">
      <section className={styles.heroPanel} aria-labelledby="home-heading">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>CODEX PETS · DESKTOP COMPANIONS</span>
          <h1 id="home-heading">
            {language === "zh" ? (
              <>
                给 Codex Desktop 装一只会动的
                <span className={styles.noBreak}>桌面宠物</span>
                ：<span className={styles.noBreak}>先试玩</span>，再本地安装。
              </>
            ) : (
              "Add an animated pet to Codex Desktop—preview it first, then install it locally."
            )}
          </h1>

          <ol className={styles.pathSteps} aria-label={t(language, "安装路径", "Install path")}>
            <li>{t(language, "选宠", "Choose")}</li>
            <li>{t(language, "试玩", "Preview")}</li>
            <li>{t(language, "安装", "Install")}</li>
          </ol>

          <div className={styles.heroActions}>
            <a className={styles.primaryCta} href="#characters">
              {t(language, "开始选择宠物", "Start choosing a pet")}
              <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
            </a>
            <Link className={styles.installLink} href={withLanguage("/install", language)}>
              {t(language, "先看安装方式", "See install options")}
              <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
            </Link>
          </div>
        </div>

        <aside className={styles.guideCard} aria-labelledby="guide-heading">
          <div className={styles.guideCopy}>
            <span>{guide.role}</span>
            <strong id="guide-heading">{guide.title}</strong>
            <p>{guide.description}</p>
          </div>
          <button
            className={styles.guidePetButton}
            type="button"
            onClick={showNextGuideDemo}
            aria-label={t(
              language,
              guideDemoIndex === null
                ? `点击${guide.name}试玩下一个动作`
                : `当前动作：${guideDemo.zhLabel}。点击试玩下一个动作`,
              guideDemoIndex === null
                ? `Click ${guide.name} to preview the next motion`
                : `Current motion: ${guideDemo.enLabel}. Click to preview the next motion`,
            )}
          >
            {guideDemoIndex === null ? (
              <PetPreview
                className={styles.guidePet}
                petId={guide.petId}
                eager
                label={t(language, `${guide.name}静态预览`, `${guide.name} preview`)}
              />
            ) : (
              <SpritePet
                className={styles.guidePet}
                petId={guide.petId}
                animation={guideDemo.animation}
                eager
                label={`${guide.name} — ${t(language, guideDemo.zhLabel, guideDemo.enLabel)}`}
              />
            )}
            <span className={styles.guideMotionHint}>
              <MousePointerClick aria-hidden="true" size={16} strokeWidth={3} />
              {guideDemoIndex === null
                ? t(language, "试玩动作", "Preview animation")
                : t(language, guideDemo.zhLabel, guideDemo.enLabel)}
            </span>
          </button>
          <span className={styles.srOnly} role="status" aria-live="polite">
            {guideDemoIndex === null
              ? ""
              : t(
                  language,
                  `${guide.name}正在${guideDemo.zhLabel}`,
                  `${guide.name} is showing ${guideDemo.enLabel.toLowerCase()}`,
                )}
          </span>
        </aside>
      </section>

      <section className={styles.seriesBoard} aria-labelledby="series-heading">
        <header className={styles.seriesHeader}>
          <div>
            <span className={styles.statusPill}>{series.status}</span>
            <span className={styles.seriesKicker}>{t(language, "宠物系列", "PET COLLECTION")}</span>
          </div>
          <div className={styles.seriesCopy}>
            <h2 id="series-heading">{series.name}</h2>
            <p className={styles.seriesSubtitle}>{series.subtitle}</p>
            <p className={styles.seriesDescription}>{series.description}</p>
          </div>
        </header>

        <section
          className={styles.characterIndex}
          id="characters"
          aria-labelledby="character-index-heading"
        >
          <div className={styles.indexHeading}>
            <div>
              <span>CHOOSE · PREVIEW · INSTALL</span>
              <h3 id="character-index-heading">
                {t(language, "选择一位桌面伙伴", "Choose your desktop companion")}
              </h3>
            </div>
            <span className={styles.desktopHint}>
              {t(language, "使用左右按钮或方向键浏览", "Use the buttons or arrow keys")}
            </span>
          </div>

          <p className={styles.mobileHint}>
            {t(language, "横向滑动查看更多角色", "Swipe sideways for more characters")}
            <ChevronRight aria-hidden="true" size={17} strokeWidth={3} />
          </p>

          <div className={styles.characterCarousel}>
            <button
              className={styles.carouselButton}
              type="button"
              onClick={() => scrollMembers(-1)}
              disabled={memberBounds.atStart}
              aria-controls="home-character-strip"
              aria-label={t(language, "查看上一组角色", "Show previous characters")}
            >
              <ChevronLeft aria-hidden="true" size={24} strokeWidth={3} />
            </button>

            <div className={styles.memberViewport}>
              <div
                className={styles.memberStrip}
                id="home-character-strip"
                ref={memberStripRef}
                role="region"
                tabIndex={0}
                onKeyDown={handleMemberKeys}
                aria-label={t(language, "可横向浏览的角色列表", "Scrollable character list")}
              >
                {series.members.map((member) => (
                  <Link
                    className={styles.memberCard}
                    href={withLanguage(`/pets/${member.petId}`, language)}
                    style={{
                      "--member-accent": member.accent,
                      "--member-soft": member.softAccent,
                    } as MemberStyle}
                    key={member.petId}
                  >
                    <PetPreview
                      className={styles.memberImage}
                      petId={member.petId}
                      label={t(language, `${member.name}静态预览`, `${member.name} preview`)}
                    />
                    <span className={styles.memberCopy}>
                      <strong>{member.name}</strong>
                      <small className={styles.memberRole}>{member.role}</small>
                      <small className={styles.memberSpecialty}>{member.specialty}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <button
              className={styles.carouselButton}
              type="button"
              onClick={() => scrollMembers(1)}
              disabled={memberBounds.atEnd}
              aria-controls="home-character-strip"
              aria-label={t(language, "查看下一组角色", "Show next characters")}
            >
              <ChevronRight aria-hidden="true" size={24} strokeWidth={3} />
            </button>
          </div>
        </section>

        <div className={styles.supportRow}>
          <section className={styles.installTrust} aria-labelledby="install-trust-heading">
            <span>{t(language, "下载与安装", "DOWNLOAD & INSTALL")}</span>
            <h3 id="install-trust-heading">
              {t(language, "安装前先看清楚", "Know before you install")}
            </h3>
            <ul>
              {[
                t(language, "无需登录，免费下载", "No account, free download"),
                t(
                  language,
                  "本地 ZIP 安装，无需运行安装程序",
                  "Local ZIP install, no installer to run",
                ),
                t(
                  language,
                  "只添加宠物文件，不改 Codex 设置",
                  "Adds only pet files; Codex settings stay unchanged",
                ),
              ].map((promise) => (
                <li key={promise}>
                  <Check aria-hidden="true" size={18} strokeWidth={3} />
                  {promise}
                </li>
              ))}
            </ul>
          </section>

          <Link className={styles.storyCard} href={withLanguage(`/series/${series.id}#story`, language)}>
            <BookOpenText aria-hidden="true" size={24} strokeWidth={2.6} />
            <span>
              <small>{t(language, "系列世界观", "SERIES LORE")}</small>
              <strong>{series.storyTitle}</strong>
              <em>{t(language, "想了解这些角色从哪里来？", "Curious where these characters came from?")}</em>
            </span>
            <span className={styles.storyLink}>
              {t(language, "读系列故事", "Read the series story")}
              <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
