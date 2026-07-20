"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Download,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { AnimationKey, Language } from "@/lib/pets";

import { SiteFooter, SiteHeader, t, withLanguage } from "./SiteChrome";
import { SpritePet } from "./SpritePet";
import styles from "../home.module.css";

type HomeExperienceProps = {
  language: Language;
  petId: string;
  petName: string;
};

type WorkMode = {
  key: "work" | "wait" | "done";
  animation: AnimationKey;
  zhLabel: string;
  enLabel: string;
  zhStatus: string;
  enStatus: string;
  icon: typeof BriefcaseBusiness;
};

const MODES: WorkMode[] = [
  {
    key: "work",
    animation: "running",
    zhLabel: "工作",
    enLabel: "Working",
    zhStatus: "它已经开工，陪你把复杂任务拆成下一步。",
    enStatus: "It is on the job, turning the big task into the next small step.",
    icon: BriefcaseBusiness,
  },
  {
    key: "wait",
    animation: "waiting",
    zhLabel: "等待",
    enLabel: "Waiting",
    zhStatus: "结果还在路上，它先替你安静守着。",
    enStatus: "The result is still on its way. Your pet will keep watch.",
    icon: Clock3,
  },
  {
    key: "done",
    animation: "waving",
    zhLabel: "完成",
    enLabel: "Done",
    zhStatus: "完成啦。今天的认真值得被好好庆祝。",
    enStatus: "Done. Today’s focused work deserves a proper little celebration.",
    icon: CheckCircle2,
  },
];

export function HomeExperience({ language, petId, petName }: HomeExperienceProps) {
  const [activeMode, setActiveMode] = useState(0);
  const mode = MODES[activeMode];

  function showNextReaction() {
    setActiveMode((current) => (current + 1) % MODES.length);
  }

  return (
    <div className={styles.pageShell}>
      <a className="skip-link" href="#main-content">
        {t(language, "跳到主要内容", "Skip to main content")}
      </a>
      <SiteHeader language={language} currentPath="/" />

      <main id="main-content">
        <section className={styles.stage} aria-labelledby="home-heading">
          <div className={styles.copyCard}>
            <span className={styles.eyebrow}>
              {t(language, "你的 Codex 桌面搭子", "YOUR CODEX DESKTOP COMPANION")}
            </span>
            <h1 id="home-heading">
              {t(
                language,
                "它会跟上 Codex 的每一次忙碌。",
                "It keeps up with every busy moment in Codex.",
              )}
            </h1>
            <p>
              {t(
                language,
                "不是冰冷的进度条。它会陪你开工、等结果，也会把任务完成的小小胜利庆祝得更像一回事。",
                "Not another cold progress bar. It works with you, waits with you, and makes a finished task feel worth celebrating.",
              )}
            </p>
            <div className={styles.copyActions}>
              <Link
                className={styles.primaryButton}
                href={withLanguage(`/install/${petId}`, language)}
              >
                <Download aria-hidden="true" size={21} strokeWidth={3} />
                {t(language, "选择我的桌面搭子", "Choose my companion")}
              </Link>
              <Link className={styles.textLink} href={withLanguage("/pets", language)}>
                {t(language, "浏览全部宠物", "Browse all pets")}
                <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
              </Link>
            </div>
          </div>

          <div className={styles.petStage}>
            <span className={styles.liveBadge}>V2 PET · LIVE</span>
            <button
              className={styles.petButton}
              type="button"
              onClick={showNextReaction}
              aria-label={t(
                language,
                `点一下 ${petName}，看看下一个状态`,
                `Click ${petName} to see its next state`,
              )}
            >
              <SpritePet
                className={styles.heroPet}
                petId={petId}
                animation={mode.animation}
                eager
                label={`${petName} — ${t(language, mode.zhLabel, mode.enLabel)}`}
              />
            </button>
            <p className={styles.petName}>{petName}</p>
            <p className={styles.petStatus} aria-live="polite">
              {t(language, mode.zhStatus, mode.enStatus)}
            </p>
          </div>

          <div className={styles.modeDock} aria-label={t(language, "宠物状态", "Pet states")}>
            {MODES.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeMode;

              return (
                <button
                  className={active ? styles.modeActive : undefined}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveMode(index)}
                  key={item.key}
                >
                  <span>
                    <Icon aria-hidden="true" size={24} strokeWidth={3} />
                  </span>
                  {t(language, item.zhLabel, item.enLabel)}
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.nextSteps} aria-label={t(language, "下一步", "Next steps")}>
          <article className={styles.nextCard}>
            <div className={styles.cardIcon}>
              <Download aria-hidden="true" size={28} strokeWidth={3} />
            </div>
            <div>
              <span>01 / INSTALL</span>
              <h2>{t(language, "挑一只，几分钟住进桌面", "Pick one. Move it onto your desktop in minutes.")}</h2>
              <p>
                {t(
                  language,
                  "四只原创 v2 宠物，先看性格和动作，再去安装。",
                  "Meet four original v2 pets, preview their character, then install.",
                )}
              </p>
            </div>
            <Link href={withLanguage("/pets", language)} aria-label={t(language, "查看宠物库", "Open pet library")}>
              <ArrowRight aria-hidden="true" size={25} strokeWidth={3} />
            </Link>
          </article>

          <article className={`${styles.nextCard} ${styles.hatchCard}`}>
            <div className={styles.cardIcon}>
              <WandSparkles aria-hidden="true" size={28} strokeWidth={3} />
            </div>
            <div>
              <span>02 / HATCH PET SKILL</span>
              <h2>{t(language, "想要更像你的那一只？", "Want one that feels more like yours?")}</h2>
              <p>
                {t(
                  language,
                  "安装 Hatch Pet Skill，把角色设定孵化成可用的 Codex 宠物。",
                  "Install Hatch Pet Skill and turn a character idea into a Codex-ready pet.",
                )}
              </p>
            </div>
            <Link href={withLanguage("/hatch", language)} aria-label={t(language, "了解宠物孵化", "Learn about pet hatching")}>
              <ArrowRight aria-hidden="true" size={25} strokeWidth={3} />
            </Link>
          </article>
        </section>
      </main>

      <SiteFooter language={language} />
    </div>
  );
}
