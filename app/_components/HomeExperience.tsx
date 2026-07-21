"use client";

import {
  ArrowRight,
  BookOpenText,
  Download,
  MousePointerClick,
  Play,
  Route,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";

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

type GuideStop = {
  key: "series" | "motion" | "install";
  animation: AnimationKey;
  zhLabel: string;
  enLabel: string;
  zhMessage: string;
  enMessage: string;
  icon: typeof Route;
};

const GUIDE_STOPS: readonly GuideStop[] = [
  {
    key: "series",
    animation: "waving",
    zhLabel: "先看系列",
    enLabel: "Start with a series",
    zhMessage: "从主题和角色职责开始，挑一个最合拍的。",
    enMessage: "Start with the theme and roles, then choose the best match.",
    icon: Route,
  },
  {
    key: "motion",
    animation: "running",
    zhLabel: "再试动作",
    enLabel: "Then try actions",
    zhMessage: "进入角色页，工作、等待和完成动作都能现场试玩。",
    enMessage: "Open a character page to try work, wait, and done actions live.",
    icon: Play,
  },
  {
    key: "install",
    animation: "review",
    zhLabel: "最后安装",
    enLabel: "Install when ready",
    zhMessage: "选好后，下载 ZIP 或把安全安装指令交给 Codex。",
    enMessage: "When ready, use the ZIP or hand Codex a safe install request.",
    icon: Download,
  },
];

type MemberStyle = CSSProperties & {
  "--member-accent": string;
  "--member-soft": string;
};

export function HomeExperience({ language, guide, series }: HomeExperienceProps) {
  const [activeStop, setActiveStop] = useState(0);
  const [guideAwake, setGuideAwake] = useState(false);
  const stop = GUIDE_STOPS[activeStop];
  const GuideIcon = stop.icon;
  const featuredMembers = series.members.slice(0, 3);

  function showNextGuideStop() {
    setGuideAwake(true);
    setActiveStop((current) => (current + 1) % GUIDE_STOPS.length);
  }

  return (
    <main className={styles.homeMain} id="main-content">
      <section className={styles.heroGrid} aria-labelledby="home-heading">
        <aside className={styles.guideRail} aria-labelledby="guide-heading">
          <span className={styles.guideLabel}>{guide.title}</span>

          <div className={styles.guideSpeech} aria-live="polite">
            <span>{guide.role}</span>
            <h2 id="guide-heading">
              {t(language, "给 Codex 挑一位会动的桌面伙伴", "Pick a moving companion for Codex")}
            </h2>
            <p>{guideAwake ? t(language, stop.zhMessage, stop.enMessage) : guide.description}</p>
          </div>

          <button
            className={styles.guidePetButton}
            type="button"
            onClick={showNextGuideStop}
            aria-label={t(language, `点一下 ${guide.name}，看看下一条建议`, `Ask ${guide.name} for another suggestion`)}
          >
            {guideAwake ? (
              <SpritePet
                className={styles.guidePet}
                petId={guide.petId}
                animation={stop.animation}
                eager
                label={`${guide.name} — ${t(language, stop.zhLabel, stop.enLabel)}`}
              />
            ) : (
              <PetPreview
                className={styles.guidePet}
                petId={guide.petId}
                eager
                label={t(language, `${guide.name}静态预览`, `${guide.name} preview`)}
              />
            )}
            <span className={styles.tapHint}>
              <GuideIcon aria-hidden="true" size={17} strokeWidth={3} />
              {t(language, stop.zhLabel, stop.enLabel)}
              <MousePointerClick aria-hidden="true" size={16} strokeWidth={3} />
            </span>
          </button>

          <div className={styles.guideActions}>
            <Link href={withLanguage(`/series/${series.id}`, language)}>
              {t(language, "开始挑选", "Start choosing")}
              <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
            </Link>
            <Link href={withLanguage("/install", language)}>
              {t(language, "怎么安装", "How to install")}
            </Link>
          </div>
        </aside>

        <section className={styles.seriesBoard} aria-labelledby="home-heading">
          <header className={styles.seriesHeader}>
            <div className={styles.seriesCopy}>
              <span className={styles.statusPill}>{series.status}</span>
              <h1 id="home-heading">{series.name}</h1>
              <p className={styles.seriesSubtitle}>{series.subtitle}</p>
              <p className={styles.seriesDescription}>{series.description}</p>
            </div>
            <div className={styles.seriesVisual} aria-label={t(language, "系列角色预览", "Series character preview")}>
              {featuredMembers.map((member, index) => (
                <Link
                  href={withLanguage(`/pets/${member.petId}`, language)}
                  style={{ "--feature-index": index } as CSSProperties}
                  key={member.petId}
                >
                  <PetPreview
                    className={styles.seriesPet}
                    petId={member.petId}
                    eager
                    label={t(language, `${member.name}静态预览`, `${member.name} preview`)}
                  />
                </Link>
              ))}
            </div>
          </header>

          <section className={styles.characterIndex} aria-labelledby="character-index-heading">
            <div className={styles.indexHeading}>
              <div>
                <span>CHARACTER INDEX</span>
                <h2 id="character-index-heading">{t(language, "角色索引", "Character index")}</h2>
              </div>
              <span>{t(language, "横向滑动查看更多", "Scroll sideways for more")}</span>
            </div>

            <div className={styles.memberStrip}>
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
                  <span>
                    <strong>{member.name}</strong>
                    <small>{member.role}</small>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <Link className={styles.storyCard} href={withLanguage(`/series/${series.id}#story`, language)}>
            <span className={styles.storyIcon}>
              <BookOpenText aria-hidden="true" size={28} strokeWidth={3} />
            </span>
            <span>
              <small>{series.storyChapter}</small>
              <strong>{series.storyTitle}</strong>
              <em>{series.story}</em>
            </span>
            <span className={styles.storyLink}>
              {t(language, "从序章开始", "Start with the prologue")}
              <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
            </span>
          </Link>

          <footer className={styles.boardFooter}>
            <Link href={withLanguage(`/series/${series.id}#characters`, language)}>
              {t(language, "查看全部角色", "View all characters")}
              <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
            </Link>
            <Link href={withLanguage(`/series/${series.id}#story`, language)}>
              <BookOpenText aria-hidden="true" size={19} strokeWidth={3} />
              {t(language, "系列故事", "Series story")}
              <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
            </Link>
          </footer>
        </section>
      </section>
    </main>
  );
}
