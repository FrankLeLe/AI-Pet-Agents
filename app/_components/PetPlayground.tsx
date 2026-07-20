"use client";

import { useState } from "react";

import { ANIMATIONS } from "@/lib/pet-animation";
import type { AnimationKey } from "@/lib/pet-animation";
import type { Language } from "@/lib/pets";

import { PetPreview } from "./PetPreview";
import { SpritePet } from "./SpritePet";
import styles from "./pet-playground.module.css";

const ANIMATION_LABELS: Record<AnimationKey, { zh: string; en: string }> = {
  idle: { zh: "安静陪伴", en: "Idle" },
  "running-right": { zh: "向右出发", en: "Move right" },
  "running-left": { zh: "向左出发", en: "Move left" },
  waving: { zh: "打个招呼", en: "Wave" },
  jumping: { zh: "开心一下", en: "Jump" },
  failed: { zh: "遇到难题", en: "A setback" },
  waiting: { zh: "等你回应", en: "Waiting" },
  running: { zh: "认真工作", en: "Working" },
  review: { zh: "仔细检查", en: "Review" },
  look: { zh: "看看四周", en: "Look around" },
};

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
  const [isAwake, setIsAwake] = useState(false);
  const label = ANIMATION_LABELS[animation][language];

  return (
    <section className={styles.playground} aria-labelledby="playground-title">
      <div className={styles.playgroundCopy}>
        <p className={styles.eyebrow}>LIVE PLAYGROUND</p>
        <h2 id="playground-title">
          {language === "zh" ? "看看它如何回应你" : "SEE HOW YOUR PET RESPONDS"}
        </h2>
        <p>
          {language === "zh"
            ? "点一下状态，不用读说明书。工作、等待、失败和完成，都有自己的小动作。"
            : "Choose a state and skip the manual. Work, waiting, setbacks, and small wins each have their own motion."}
        </p>
        <div
          className={styles.stateButtons}
          role="group"
          aria-label={language === "zh" ? "宠物动画状态" : "Pet animation states"}
        >
          {ANIMATIONS.map((item) => (
            <button
              type="button"
              className={animation === item.key ? styles.stateButtonActive : undefined}
              aria-pressed={animation === item.key}
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
              ? label
              : language === "zh"
                ? "选择一个状态唤醒它"
                : "Choose a state to wake your pet"}
          </strong>
        </div>
        {isAwake ? (
          <SpritePet
            petId={petId}
            animation={animation}
            label={language === "zh" ? `${petName}正在${label}` : `${petName}: ${label}`}
            className={styles.playgroundSprite}
          />
        ) : (
          <PetPreview
            petId={petId}
            label={language === "zh" ? `${petName}静态预览` : `${petName} preview`}
            className={styles.playgroundSprite}
          />
        )}
        <p className={styles.stageHint}>
          {language === "zh"
            ? isAwake
              ? "动画来自你下载到 Codex 的同一张 spritesheet。"
              : "选择左侧任一状态后，才会加载完整动画。"
            : isAwake
              ? "This animation comes from the same spritesheet you install in Codex."
              : "The full animation loads only after you choose a state."}
        </p>
      </div>
    </section>
  );
}
