"use client";

import {
  Check,
  Copy,
  Monitor,
  MousePointer2,
  PawPrint,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SpritePet } from "../_components/SpritePet";
import { withLanguage } from "../_components/SiteChrome";
import type { AnimationKey } from "@/lib/pet-animation";
import type { Language } from "@/lib/pets";

import styles from "./hatch.module.css";

type HatchMode = "first" | "ready";
type CopyState = "idle" | "success" | "error";

const SOURCE_COMMIT = "6bfce72ca689966918c3bb85c68007914a27f54c";
const SKILL_SHA256 = "eca94ccace67c739ecc687986e096ba1f3d2a3d43233ff38c18918e516bc578f";
const SKILL_URL = `https://aipetsagent.com/downloads/${SOURCE_COMMIT}/hatch-pet.zip`;

const INSTALL_PROMPTS: Record<Language, string> = {
  zh: `请从固定版本地址 ${SKILL_URL} 下载 Hatch Pet Skill，并严格校验 SHA-256 为 ${SKILL_SHA256}。只把压缩包内的 hatch-pet 文件夹安装到 CODEX_HOME/skills/hatch-pet；如果没有设置 CODEX_HOME，就使用用户目录下的 .codex/skills/hatch-pet。若目标已存在，先告诉我并等待确认，不要覆盖。安装完成后提醒我完整退出并重新打开 Codex Desktop。`,
  en: `Download Hatch Pet Skill from the pinned URL ${SKILL_URL} and verify that its SHA-256 is exactly ${SKILL_SHA256}. Install only the hatch-pet folder from the archive into CODEX_HOME/skills/hatch-pet; if CODEX_HOME is not set, use .codex/skills/hatch-pet in my user folder. If the target already exists, stop and ask before replacing anything. When installation finishes, remind me to fully quit and reopen Codex Desktop.`,
};

const HATCH_PROMPTS: Record<Language, string> = {
  zh: "使用 $hatch-pet，把我刚附上的角色图做成 Codex Desktop v2 宠物：请先理解角色并为它取名，待机时保留自然的小动作，工作时专注思考，拖动时左右小跑，其余动作按规范补全；完成生成与检查后安装到我的 pets 目录，不要覆盖已有同名宠物；如果需要确认或遇到阻塞请直接问我。",
  en: "Use $hatch-pet to turn the character image I just attached into a Codex Desktop v2 pet. Understand the character and name it, keep a natural subtle idle motion, make it look focused while working, and let it trot left and right while being dragged; complete the remaining required motions, then install it into my pets directory only after generation and checks pass. Do not overwrite a pet with the same name, and ask me whenever confirmation or more information is needed.",
};

const PROOF_STATES: ReadonlyArray<{
  key: AnimationKey;
  zh: string;
  en: string;
}> = [
  { key: "idle", zh: "待机", en: "Idle" },
  { key: "running-right", zh: "拖动", en: "Drag" },
  { key: "running", zh: "工作", en: "Work" },
];

const PROOF_ANIMATIONS = PROOF_STATES.map((item) => item.key);

async function writeClipboard(value: string) {
  if (
    process.env.NODE_ENV !== "production" &&
    new URLSearchParams(window.location.search).get("copy-test") === "fail"
  ) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    try {
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
}

export function HatchExperience({ language }: { language: Language }) {
  const [mode, setMode] = useState<HatchMode>("first");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [animation, setAnimation] = useState<AnimationKey>("idle");
  const [displayedAnimation, setDisplayedAnimation] =
    useState<AnimationKey>("idle");
  const isChinese = language === "zh";
  const prompt = mode === "first" ? INSTALL_PROMPTS[language] : HATCH_PROMPTS[language];

  function selectMode(nextMode: HatchMode) {
    setMode(nextMode);
    setCopyState("idle");
  }

  async function copyCurrentPrompt() {
    const didCopy = await writeClipboard(prompt);
    setCopyState(didCopy ? "success" : "error");
  }

  return (
    <main className={styles.main} id="main-content">
      <section className={styles.workshop} aria-labelledby="hatch-title">
        <div className={styles.heroStage}>
          <div className={styles.heroCopy}>
            <div className={styles.heroDecor} aria-hidden="true">
              <PawPrint />
              <Sparkles />
              <PawPrint />
            </div>
            <h1 id="hatch-title">{isChinese ? "带你的宠物回家" : "BRING YOUR PET HOME"}</h1>
            <p>
              {isChinese
                ? "把喜欢的角色，变成会动的 Codex Desktop 宠物。"
                : "Turn a favorite character into an animated Codex Desktop pet."}
            </p>
          </div>

          <aside className={styles.proofPanel} aria-labelledby="proof-title">
            <div className={styles.proofHeading}>
              <h2 id="proof-title">{isChinese ? "星铠团团" : "STAR-ARMOR TUANTUAN"}</h2>
              <p>{isChinese ? "选择一个动作试试。" : "Choose a motion to try."}</p>
            </div>

            <SpritePet
              petId="star-armor-tuantuan"
              animation={animation}
              preloadAnimations={PROOF_ANIMATIONS}
              getAnimationLabel={(currentAnimation) =>
                isChinese
                  ? `星铠团团正在展示${PROOF_STATES.find((item) => item.key === currentAnimation)?.zh ?? "待机"}`
                  : `Star-Armor Tuantuan showing ${PROOF_STATES.find((item) => item.key === currentAnimation)?.en ?? "Idle"}`
              }
              onDisplayedAnimationChange={setDisplayedAnimation}
              onAnimationError={(failedAnimation) => {
                setAnimation((currentAnimation) =>
                  currentAnimation === failedAnimation
                    ? displayedAnimation
                    : currentAnimation,
                );
              }}
              eager
              className={styles.proofPet}
            />

            <div className={styles.motionTabs} role="group" aria-label={isChinese ? "切换真实动作" : "Switch real motions"}>
              {PROOF_STATES.map((item) => (
                <button
                  type="button"
                  aria-pressed={displayedAnimation === item.key}
                  aria-busy={
                    animation === item.key && displayedAnimation !== item.key
                  }
                  data-motion-pending={
                    animation === item.key && displayedAnimation !== item.key
                      ? "true"
                      : "false"
                  }
                  className={
                    displayedAnimation === item.key
                      ? styles.motionTabActive
                      : undefined
                  }
                  onClick={() => setAnimation(item.key)}
                  key={item.key}
                >
                  {item.key === "idle" ? <Sparkles aria-hidden="true" /> : item.key === "running-right" ? <MousePointer2 aria-hidden="true" /> : <Monitor aria-hidden="true" />}
                  {isChinese ? item.zh : item.en}
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className={`${styles.actionDock} ${mode === "ready" ? styles.actionDockReady : ""}`}>
          <div className={styles.actionMain}>
          <div className={styles.modeTabs} role="tablist" aria-label={isChinese ? "选择当前状态" : "Choose your current state"}>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "first"}
              aria-controls="hatch-action-panel"
              className={mode === "first" ? styles.modeTabActive : undefined}
              onClick={() => selectMode("first")}
            >
              <span aria-hidden="true">1</span>
              {isChinese ? "第一次使用" : "First time"}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "ready"}
              aria-controls="hatch-action-panel"
              className={mode === "ready" ? styles.modeTabActive : undefined}
              onClick={() => selectMode("ready")}
            >
              <Check aria-hidden="true" size={20} strokeWidth={3} />
              {isChinese ? "已经装好" : "Already installed"}
            </button>
          </div>

            <div
              className={styles.actionPanel}
              id="hatch-action-panel"
              role="tabpanel"
              data-hatch-mode={mode}
            >
              <div className={styles.actionIntro}>
                <h2>{isChinese ? "创造您的宠物" : "CREATE YOUR PET"}</h2>
                <p className={styles.actionHint}>
                  {mode === "first"
                    ? isChinese
                      ? "复制后，到 Codex 新任务粘贴发送；装好后重启。"
                      : "Copy it into a new Codex task and send; reopen Codex when finished."
                    : isChinese
                      ? "在 Codex 新任务里附图，粘贴并发送。"
                      : "In a new Codex task, attach the image, paste, and send."}
                </p>
              </div>

              <button
                className={styles.copyButton}
                type="button"
                onClick={copyCurrentPrompt}
                data-copy-state={copyState}
              >
                {copyState === "success" ? (
                  <Check aria-hidden="true" size={23} strokeWidth={3} />
                ) : (
                  <Copy aria-hidden="true" size={23} strokeWidth={3} />
                )}
                {copyState === "success"
                  ? isChinese
                    ? "已复制"
                    : "COPIED"
                  : mode === "first"
                    ? isChinese
                      ? "复制，去 Codex 安装"
                      : "COPY TO INSTALL IN CODEX"
                    : isChinese
                      ? "复制，去 Codex 造宠"
                      : "COPY TO MAKE YOUR PET"}
              </button>
            </div>
          </div>

          {copyState === "success" ? (
            <div className={styles.copySuccess} role="status" aria-live="polite">
              <Check aria-hidden="true" size={20} strokeWidth={3} />
              <span>
                {mode === "first"
                  ? isChinese
                    ? "已复制。回到 Codex 粘贴发送；装好后重启 Codex。"
                    : "Copied. Paste and send it in Codex, then reopen Codex."
                  : isChinese
                    ? "已复制。附上角色图，粘贴并发送。"
                    : "Copied. Attach the image, paste, and send."}
              </span>
            </div>
          ) : null}

          {copyState === "error" ? (
            <div className={styles.copyError} role="alert" aria-live="assertive">
              <strong>{isChinese ? "复制失败" : "Copy failed"}</strong>
              <span>{isChinese ? "展开内容后手动复制。" : "Open the text and copy it manually."}</span>
            </div>
          ) : null}

          <div className={styles.dockFooter}>
            <details className={styles.fullPrompt} open={copyState === "error"}>
              <summary>
                {mode === "first"
                  ? isChinese
                    ? "查看安装内容与来源"
                    : "View install text and source"
                  : isChinese
                    ? "查看完整内容"
                    : "View full text"}
              </summary>
              {mode === "first" ? (
                <div className={styles.sourceMeta}>
                  <a href={SKILL_URL} target="_blank" rel="noreferrer">Cloudflare CDN · {SOURCE_COMMIT.slice(0, 8)}</a>
                  <code>SHA-256 · {SKILL_SHA256}</code>
                </div>
              ) : null}
              <textarea
                aria-label={mode === "first" ? (isChinese ? "完整安装内容" : "Full install text") : (isChinese ? "完整造宠内容" : "Full pet-making text")}
                readOnly
                value={prompt}
                onFocus={(event) => event.currentTarget.select()}
              />
            </details>
            <nav className={styles.readyMade} aria-label={isChinese ? "已有宠物" : "Finished pets"}>
              <Link href={withLanguage("/pets", language)}>{isChinese ? "先试玩已有宠物" : "TRY A FINISHED PET"}</Link>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
