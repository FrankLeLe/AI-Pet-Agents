"use client";

import { useState } from "react";

import { ANIMATIONS } from "@/lib/pet-animation";
import type { AnimationKey } from "@/lib/pet-animation";
import type { Language } from "@/lib/pets";

import { PetPreview } from "./PetPreview";
import { SpritePet } from "./SpritePet";
import styles from "./pet-playground.module.css";

const ANIMATION_LABELS: Record<AnimationKey, { zh: string; en: string }> = {
  idle: { zh: "待机", en: "Idle" },
  "running-right": { zh: "向右出发", en: "Move right" },
  "running-left": { zh: "向左出发", en: "Move left" },
  waving: { zh: "打个招呼", en: "Wave" },
  jumping: { zh: "跳跃", en: "Jump" },
  failed: { zh: "出错", en: "Error" },
  waiting: { zh: "等待", en: "Waiting" },
  running: { zh: "工作", en: "Working" },
  review: { zh: "检查", en: "Review" },
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
        <p className={styles.eyebrow}>ACTION PLAYGROUND</p>
        <h2 id="playground-title">
          {language === "zh" ? "动作试玩" : "TRY THE ACTIONS"}
        </h2>
        <p>
          {language === "zh"
            ? "选择一种状态，查看角色在 Codex 里的对应动作。"
            : "Choose a state to preview the character's matching action in Codex."}
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
                ? "选择一个动作开始试玩"
                : "Choose an action to begin"}
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
              ? "这就是角色安装到 Codex 后的动作效果。"
              : "完整动画会在你选择动作后加载。"
            : isAwake
              ? "This is how the character moves after installation."
              : "The full animation loads after you choose an action."}
        </p>
      </div>
    </section>
  );
}
