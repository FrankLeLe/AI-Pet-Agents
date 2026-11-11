"use client";

import Link from "next/link";
import { useState } from "react";

import { withLanguage } from "@/lib/i18n";
import { ANIMATIONS } from "@/lib/pet-animation";
import type { AnimationKey } from "@/lib/pet-animation";
import type { Language } from "@/lib/pets";

import { SpritePet } from "./SpritePet";
import styles from "./pet-playground.module.css";

const ANIMATION_LABELS: Record<AnimationKey, { zh: string; en: string }> = {
  idle: { zh: "歇一会儿", en: "Take a break" },
  "running-right": { zh: "向右出发", en: "Move right" },
  "running-left": { zh: "向左出发", en: "Move left" },
  waving: { zh: "打个招呼", en: "Wave" },
  jumping: { zh: "跳跃", en: "Jump" },
  failed: { zh: "有点失落", en: "Feeling down" },
  waiting: { zh: "等待", en: "Waiting" },
  running: { zh: "工作", en: "Working" },
  review: { zh: "仔细看看", en: "Take a closer look" },
  look: { zh: "看看四周", en: "Look around" },
};

const PLAYGROUND_PRELOAD_ANIMATIONS: readonly AnimationKey[] = ANIMATIONS.map(
  (item) => item.key,
);

type PetPlaygroundProps = {
  language: Language;
  petId: string;
  petName: string;
  initialAnimation?: AnimationKey;
};

export function PetPlayground({
  language,
  petId,
  petName,
  initialAnimation = "idle",
}: PetPlaygroundProps) {
  const [animation, setAnimation] = useState<AnimationKey>(initialAnimation);
  const [displayedAnimation, setDisplayedAnimation] =
    useState<AnimationKey>(initialAnimation);
  const [isAwake, setIsAwake] = useState(false);
  const displayedLabel = ANIMATION_LABELS[displayedAnimation][language];

  return (
    <section className={styles.playground} aria-labelledby="playground-title">
      <div className={styles.playgroundCopy}>
        <p className={styles.eyebrow}>{language === "zh" ? "打个招呼" : "Say hello"}</p>
        <h2 id="playground-title" data-copy-role="card-headline">
          {language === "zh" ? "一起玩会儿" : "PLAY TOGETHER"}
        </h2>
        <div
          className={styles.stateButtons}
          role="group"
          aria-label={language === "zh" ? `和${petName}互动` : `Play with ${petName}`}
        >
          {ANIMATIONS.map((item) => (
            <button
              type="button"
              className={
                displayedAnimation === item.key
                  ? styles.stateButtonActive
                  : undefined
              }
              aria-pressed={displayedAnimation === item.key}
              aria-busy={
                isAwake &&
                animation === item.key &&
                displayedAnimation !== item.key
              }
              data-motion-pending={
                isAwake &&
                animation === item.key &&
                displayedAnimation !== item.key
                  ? "true"
                  : "false"
              }
              onClick={() => {
                setAnimation(item.key);
                setIsAwake(true);
              }}
              key={item.key}
            >
              {ANIMATION_LABELS[item.key][language]}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.playgroundStage}>
        <div className={styles.stageStatus}>
          <span>{petName}</span>
          <strong aria-live="polite">
            {isAwake
              ? displayedLabel
              : language === "zh"
                ? "在等你"
                : "Waiting for you"}
          </strong>
        </div>
        <SpritePet
          key={petId}
          petId={petId}
          animation={isAwake ? animation : initialAnimation}
          preloadAnimations={PLAYGROUND_PRELOAD_ANIMATIONS}
          paused={!isAwake}
          getAnimationLabel={(currentAnimation) => {
            const currentLabel = ANIMATION_LABELS[currentAnimation][language];
            return language === "zh"
              ? `${petName}：${currentLabel}`
              : `${petName}: ${currentLabel}`;
          }}
          onDisplayedAnimationChange={setDisplayedAnimation}
          onAnimationError={(failedAnimation) => {
            setAnimation((currentAnimation) =>
              currentAnimation === failedAnimation
                ? displayedAnimation
                : currentAnimation,
            );
          }}
          className={styles.playgroundSprite}
        />
        {isAwake ? (
          <Link
            className={styles.installCta}
            href={`${withLanguage(`/install/${petId}`, language)}#codex-install`}
          >
            {language === "zh" ? `带${petName}回 Codex` : `Bring ${petName} to Codex`}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
