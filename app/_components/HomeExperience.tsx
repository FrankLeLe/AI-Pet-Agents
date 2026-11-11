"use client";

import {
  ArrowRight,
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
  selectionTitle: string;
  storyTitle: string;
  storyChapter: string;
  story: string;
  members: HomeMember[];
};

type HomeExperienceProps = {
  language: Language;
  guide: GuideData;
  series: HomeSeries[];
};

type MemberStyle = CSSProperties & {
  "--member-accent": string;
  "--member-soft": string;
};

type HomeSeriesSectionProps = {
  language: Language;
  collection: HomeSeries;
  featured: boolean;
};

const GUIDE_DEMOS: readonly {
  animation: AnimationKey;
  zhLabel: string;
  enLabel: string;
}[] = [
  { animation: "waving", zhLabel: "挥手", enLabel: "Wave" },
  { animation: "running", zhLabel: "专心工作", enLabel: "Getting to work" },
  { animation: "review", zhLabel: "仔细看看", enLabel: "Taking a closer look" },
];

const GUIDE_ANIMATIONS = GUIDE_DEMOS.map((item) => item.animation);

function guideAnimationLabel(animation: AnimationKey, language: Language) {
  const demo = GUIDE_DEMOS.find((item) => item.animation === animation);
  return demo
    ? t(language, demo.zhLabel, demo.enLabel)
    : t(language, "歇一会儿", "Taking a break");
}

function HomeSeriesSection({
  language,
  collection,
  featured,
}: HomeSeriesSectionProps) {
  const memberStripRef = useRef<HTMLDivElement>(null);
  const [memberBounds, setMemberBounds] = useState({ atStart: true, atEnd: false });
  const headingId = `collection-heading-${collection.id}`;
  const charactersId = `characters-${collection.id}`;
  const characterHeadingId = `character-heading-${collection.id}`;
  const stripId = `character-strip-${collection.id}`;

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
    <section
      className={`${styles.seriesBoard} ${
        featured ? styles.featuredSeriesBoard : styles.classicSeriesBoard
      }`}
      id={`collection-${collection.id}`}
      aria-labelledby={headingId}
    >
      <header className={styles.seriesHeader}>
        <div>
          <span className={styles.statusPill}>{collection.status}</span>
          <span className={styles.seriesKicker}>{collection.subtitle}</span>
        </div>
        <div className={styles.seriesCopy}>
          <h2 id={headingId}>{collection.name}</h2>
          <p className={styles.seriesDescription}>{collection.description}</p>
        </div>
      </header>

      <section
        className={styles.characterIndex}
        id={charactersId}
        aria-labelledby={characterHeadingId}
      >
        <div className={styles.indexHeading}>
          <h3 id={characterHeadingId} data-copy-role="card-headline">
            {collection.selectionTitle}
          </h3>
          <span className={styles.desktopHint}>
            {t(
              language,
              "左右滑动，看看更多",
              "Swipe or use the arrows to see more",
            )}
          </span>
        </div>

        <p className={styles.mobileHint}>
          {t(language, "左右滑动，看看更多", "Swipe to see more")}
          <ChevronRight aria-hidden="true" size={17} strokeWidth={3} />
        </p>

        <div className={styles.characterCarousel}>
          <button
            className={styles.carouselButton}
            type="button"
            onClick={() => scrollMembers(-1)}
            disabled={memberBounds.atStart}
            aria-controls={stripId}
            aria-label={t(language, "查看前面的伙伴", "Show previous pets")}
          >
            <ChevronLeft aria-hidden="true" size={24} strokeWidth={3} />
          </button>

          <div className={styles.memberViewport}>
            <div
              className={styles.memberStrip}
              id={stripId}
              ref={memberStripRef}
              role="region"
              tabIndex={0}
              onKeyDown={handleMemberKeys}
              aria-label={t(
                language,
                `${collection.name}伙伴列表`,
                `${collection.name} pet list`,
              )}
            >
              {collection.members.map((member) => (
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
                    label={t(
                      language,
                      `${member.name}形象`,
                      `${member.name} preview`,
                    )}
                  />
                  <span className={styles.memberCopy}>
                    <strong>{member.name}</strong>
                    <small className={styles.memberRole}>{member.role}</small>
                    <small className={styles.memberSpecialty}>
                      {member.specialty}
                    </small>
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
            aria-controls={stripId}
            aria-label={t(language, "查看更多伙伴", "Show more pets")}
          >
            <ChevronRight aria-hidden="true" size={24} strokeWidth={3} />
          </button>
        </div>
      </section>

      <div className={styles.storyRow}>
        <Link
          className={styles.storyCard}
          href={withLanguage(`/series/${collection.id}#story`, language)}
        >
          <BookOpenText aria-hidden="true" size={24} strokeWidth={2.6} />
          <span>
            <small>{t(language, "他们的故事", "THEIR STORY")}</small>
            <strong>{collection.storyTitle}</strong>
            <em>
              {t(
                language,
                "想知道这些伙伴从哪里来？",
                "See where these companions came from.",
              )}
            </em>
          </span>
          <span className={styles.storyLink}>
            {t(language, "读故事", "Read the story")}
            <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
          </span>
        </Link>
      </div>
    </section>
  );
}

export function HomeExperience({ language, guide, series }: HomeExperienceProps) {
  const [guideDemoIndex, setGuideDemoIndex] = useState<number | null>(null);
  const [displayedGuideAnimation, setDisplayedGuideAnimation] =
    useState<AnimationKey>("idle");
  const guideDemo = GUIDE_DEMOS[guideDemoIndex ?? 0];
  const requestedGuideAnimation =
    guideDemoIndex === null ? "idle" : guideDemo.animation;
  const displayedGuideLabel = guideAnimationLabel(displayedGuideAnimation, language);
  function showNextGuideDemo() {
    setGuideDemoIndex((current) =>
      current === null ? 0 : (current + 1) % GUIDE_DEMOS.length,
    );
  }

  return (
    <main className={styles.homeMain} id="main-content">
      <section className={styles.heroPanel} aria-labelledby="home-heading">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{t(language, "CODEX PETS · 你的桌面伙伴", "CODEX PETS · DESKTOP COMPANIONS")}</span>
          <h1 id="home-heading" data-copy-role="page-headline">
            {t(
              language,
              "让等待有个伴",
              "Never wait alone",
            )}
          </h1>
          <p className={styles.heroLead}>
            {t(
              language,
              "工作时陪跑，等待时发呆，完成时和你一起庆祝。",
              "It works beside you, waits with you, and celebrates when the task is done.",
            )}
          </p>

          <div className={styles.heroActions}>
            <a className={styles.primaryCta} href="#characters">
              {t(language, "先看看新来的伙伴", "Meet the new companions")}
              <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
            </a>
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
                ? `点击${guide.name}打个招呼`
                : `${guide.name}：${displayedGuideLabel}。再点一下，看看别的小动作`,
              guideDemoIndex === null
                ? `Click ${guide.name} to say hello`
                : `${guide.name}: ${displayedGuideLabel}. Click to try another little move`,
            )}
          >
            <SpritePet
              key={guide.petId}
              className={styles.guidePet}
              petId={guide.petId}
              animation={requestedGuideAnimation}
              preloadAnimations={GUIDE_ANIMATIONS}
              paused={guideDemoIndex === null}
              eager
              getAnimationLabel={(currentAnimation) =>
                `${guide.name}: ${guideAnimationLabel(currentAnimation, language)}`
              }
              onDisplayedAnimationChange={setDisplayedGuideAnimation}
              onAnimationError={(failedAnimation) => {
                setGuideDemoIndex((currentIndex) => {
                  const currentAnimation =
                    currentIndex === null
                      ? "idle"
                      : GUIDE_DEMOS[currentIndex].animation;
                  if (currentAnimation !== failedAnimation) return currentIndex;
                  if (displayedGuideAnimation === "idle") return null;

                  const displayedIndex = GUIDE_DEMOS.findIndex(
                    (item) => item.animation === displayedGuideAnimation,
                  );
                  return displayedIndex >= 0 ? displayedIndex : null;
                });
              }}
            />
            <span className={styles.guideMotionHint}>
              <MousePointerClick aria-hidden="true" size={16} strokeWidth={3} />
              {guideDemoIndex === null
                ? t(language, "点点看", "Say hello")
                : displayedGuideLabel}
            </span>
          </button>
          <span className={styles.srOnly} role="status" aria-live="polite">
            {guideDemoIndex === null
              ? ""
              : t(
                  language,
                  `${guide.name}：${displayedGuideLabel}`,
                  `${guide.name}: ${displayedGuideLabel}`,
                )}
          </span>
        </aside>
      </section>

      <div className={styles.seriesStack} id="characters">
        {series.map((collection, index) => (
          <HomeSeriesSection
            language={language}
            collection={collection}
            featured={index === 0}
            key={collection.id}
          />
        ))}
      </div>
    </main>
  );
}
