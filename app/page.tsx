"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Language = "zh" | "en";
type Platform = "windows" | "unix";
type AnimationKey =
  | "idle"
  | "running-right"
  | "running-left"
  | "waving"
  | "jumping"
  | "failed"
  | "waiting"
  | "running"
  | "review"
  | "look";

type Pet = {
  id: string;
  zhName: string;
  enName: string;
  zhDescription: string;
  enDescription: string;
  badge: string;
  accent: string;
  softAccent: string;
};

const PETS: Pet[] = [
  {
    id: "star-armor-tuantuan",
    zhName: "星铠团团",
    enName: "Star-Armor Tuantuan",
    zhDescription: "穿着原创星座铠甲、勇敢又软萌的猫科星界守护宠物。",
    enDescription:
      "A brave, soft-hearted feline guardian in original constellation armor.",
    badge: "HERO 01",
    accent: "#4b68ff",
    softAccent: "#dfe5ff",
  },
  {
    id: "gemini-twincrest-duck",
    zhName: "双子镜辉鸭",
    enName: "Gemini Twincrest Duck",
    zhDescription: "原创双子座黄金甲守护鸭，明亮、灵动，随时准备加入 Codex。",
    enDescription:
      "A bright, nimble Gemini guardian duck in original golden armor.",
    badge: "TWIN 02",
    accent: "#ffce43",
    softAccent: "#fff0ad",
  },
  {
    id: "aries-ramcrest-duck",
    zhName: "白羊金翎鸭",
    enName: "Aries Ramcrest Duck",
    zhDescription: "原创白羊座黄金甲守护鸭，热情、勇敢，又萌态十足。",
    enDescription:
      "A spirited Aries guardian duck in original golden armor.",
    badge: "RAM 03",
    accent: "#ff6b58",
    softAccent: "#ffd8d2",
  },
  {
    id: "taurus-bullguard-duck",
    zhName: "金牛鎏甲鸭",
    enName: "Taurus Bullguard Duck",
    zhDescription: "原创金牛座黄金甲守护鸭，稳重、可靠，是桌面的耐心搭子。",
    enDescription:
      "A steady Taurus guardian duck in original golden armor.",
    badge: "BULL 04",
    accent: "#38b98c",
    softAccent: "#c9f5e5",
  },
];

const ANIMATIONS: Array<{
  key: AnimationKey;
  zh: string;
  en: string;
  row: number;
  frames: number;
  durations: number[];
}> = [
  {
    key: "idle",
    zh: "待机",
    en: "Idle",
    row: 0,
    frames: 6,
    durations: [280, 110, 110, 140, 140, 320],
  },
  {
    key: "running-right",
    zh: "向右移动",
    en: "Move right",
    row: 1,
    frames: 8,
    durations: [120, 120, 120, 120, 120, 120, 120, 220],
  },
  {
    key: "running-left",
    zh: "向左移动",
    en: "Move left",
    row: 2,
    frames: 8,
    durations: [120, 120, 120, 120, 120, 120, 120, 220],
  },
  {
    key: "waving",
    zh: "挥手",
    en: "Wave",
    row: 3,
    frames: 4,
    durations: [140, 140, 140, 280],
  },
  {
    key: "jumping",
    zh: "跳跃",
    en: "Jump",
    row: 4,
    frames: 5,
    durations: [140, 140, 140, 140, 280],
  },
  {
    key: "failed",
    zh: "失败",
    en: "Failed",
    row: 5,
    frames: 8,
    durations: [140, 140, 140, 140, 140, 140, 140, 240],
  },
  {
    key: "waiting",
    zh: "等待",
    en: "Waiting",
    row: 6,
    frames: 6,
    durations: [150, 150, 150, 150, 150, 260],
  },
  {
    key: "running",
    zh: "工作中",
    en: "Working",
    row: 7,
    frames: 6,
    durations: [120, 120, 120, 120, 120, 220],
  },
  {
    key: "review",
    zh: "审阅",
    en: "Review",
    row: 8,
    frames: 6,
    durations: [150, 150, 150, 150, 150, 280],
  },
  {
    key: "look",
    zh: "环视",
    en: "Look around",
    row: 9,
    frames: 16,
    durations: Array(16).fill(170),
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function SpritePet({
  petId,
  animation,
  frame,
  eager = false,
  label,
}: {
  petId: string;
  animation: AnimationKey;
  frame: number;
  eager?: boolean;
  label: string;
}) {
  const config = ANIMATIONS.find((item) => item.key === animation)!;
  const row = animation === "look" && frame >= 8 ? 10 : config.row;
  const column = animation === "look" ? frame % 8 : frame;

  return (
    <div className="sprite-window" role="img" aria-label={label}>
      <img
        src={`/pets/${petId}/spritesheet.webp`}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        style={{
          transform: `translate3d(-${column * 12.5}%, -${
            row * (100 / 11)
          }%, 0)`,
        }}
      />
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [selectedPetId, setSelectedPetId] = useState(PETS[0].id);
  const [animation, setAnimation] = useState<AnimationKey>("idle");
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motionOverride, setMotionOverride] = useState(false);
  const [installPlatform, setInstallPlatform] = useState<Platform>("windows");
  const [skillPlatform, setSkillPlatform] = useState<Platform>("windows");
  const [copied, setCopied] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  const selectedPet = useMemo(
    () => PETS.find((pet) => pet.id === selectedPetId) ?? PETS[0],
    [selectedPetId],
  );
  const selectedAnimation = ANIMATIONS.find((item) => item.key === animation)!;
  const isPlaying = !paused && (!reducedMotion || motionOverride);
  const tr = (zh: string, en: string) => (language === "zh" ? zh : en);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPet = params.get("pet");
    const urlLanguage = params.get("lang");
    const storedLanguage = window.localStorage.getItem("codex-pets-language");
    const storedPet = window.localStorage.getItem("codex-pets-selection");

    if (urlPet && PETS.some((pet) => pet.id === urlPet)) {
      setSelectedPetId(urlPet);
    } else if (storedPet && PETS.some((pet) => pet.id === storedPet)) {
      setSelectedPetId(storedPet);
    }

    if (urlLanguage === "en" || urlLanguage === "zh") {
      setLanguage(urlLanguage);
    } else if (storedLanguage === "en" || storedLanguage === "zh") {
      setLanguage(storedLanguage);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem("codex-pets-language", language);
    window.localStorage.setItem("codex-pets-selection", selectedPetId);

    const params = new URLSearchParams(window.location.search);
    params.set("pet", selectedPetId);
    params.set("lang", language);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}${window.location.hash}`,
    );
  }, [language, ready, selectedPetId]);

  useEffect(() => {
    setFrame(0);
    if (!isPlaying) return;

    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const delay = selectedAnimation.durations[current] ?? 160;
      timer = setTimeout(() => {
        current = (current + 1) % selectedAnimation.frames;
        setFrame(current);
        tick();
      }, delay);
    };

    tick();
    return () => clearTimeout(timer);
  }, [animation, isPlaying, selectedAnimation.durations, selectedAnimation.frames]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(null), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const petWindowsCommand = `$petId = "${selectedPet.id}"
$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE ".codex" }
$petsRoot = Join-Path $codexRoot "pets"

New-Item -ItemType Directory -Force -Path $petsRoot | Out-Null
Expand-Archive \
  -LiteralPath (Join-Path $env:USERPROFILE "Downloads\\$petId.zip") \
  -DestinationPath $petsRoot \
  -Force`;

  const petUnixCommand = `pet_id="${selectedPet.id}"
codex_root="\${CODEX_HOME:-$HOME/.codex}"
pets_root="$codex_root/pets"

mkdir -p "$pets_root"
unzip -o "$HOME/Downloads/$pet_id.zip" -d "$pets_root"`;

  const skillWindowsCommand = `$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE ".codex" }
$skillsRoot = Join-Path $codexRoot "skills"

New-Item -ItemType Directory -Force -Path $skillsRoot | Out-Null
Expand-Archive \
  -LiteralPath (Join-Path $env:USERPROFILE "Downloads\\hatch-pet.zip") \
  -DestinationPath $skillsRoot \
  -Force`;

  const skillUnixCommand = `codex_root="\${CODEX_HOME:-$HOME/.codex}"
skills_root="$codex_root/skills"

mkdir -p "$skills_root"
unzip -o "$HOME/Downloads/hatch-pet.zip" -d "$skills_root"`;

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(key);
  }

  function selectPet(petId: string) {
    setSelectedPetId(petId);
    setAnimation("idle");
    setFrame(0);
  }

  function togglePlayback() {
    if (reducedMotion) {
      setMotionOverride((current) => !current);
    } else {
      setPaused((current) => !current);
    }
  }

  const activePetCommand =
    installPlatform === "windows" ? petWindowsCommand : petUnixCommand;
  const activeSkillCommand =
    skillPlatform === "windows" ? skillWindowsCommand : skillUnixCommand;
  const activePetName = tr(selectedPet.zhName, selectedPet.enName);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        {tr("跳到主要内容", "Skip to main content")}
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Codex Pets home">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <span>CODEX PETS</span>
        </a>

        <nav className="desktop-nav" aria-label={tr("主要导航", "Primary navigation")}>
          <a href="#pets">{tr("宠物", "Pets")}</a>
          <a href="#preview">{tr("预览", "Preview")}</a>
          <a href="#install">{tr("安装", "Install")}</a>
          <a href="#skill">Skill</a>
        </nav>

        <div className="header-actions">
          <span className="no-login-pill">{tr("无需登录", "NO LOGIN")}</span>
          <div className="language-switch" aria-label={tr("语言", "Language")}>
            <button
              type="button"
              className={language === "zh" ? "active" : ""}
              aria-pressed={language === "zh"}
              onClick={() => setLanguage("zh")}
            >
              中文
            </button>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero-section" id="top" aria-labelledby="hero-title">
          <article className="bento-card hero-copy-card">
            <div className="eyebrow-row">
              <span className="eyebrow">DESKTOP COMPANIONS / 2026</span>
              <span className="spark" aria-hidden="true">
                ✦
              </span>
            </div>
            <h1 id="hero-title">
              {language === "zh" ? (
                <>
                  给 CODEX 的桌面
                  <br />
                  <span>养一只会回应工作的宠物。</span>
                </>
              ) : (
                <>
                  GIVE YOUR CODEX DESKTOP
                  <br />
                  <span>A COMPANION THAT REACTS.</span>
                </>
              )}
            </h1>
            <p className="hero-lede">
              {tr(
                "从星铠团团到三只黄金守护鸭，预览并安装 4 款原创 Codex v2 宠物。无需账号，直接浏览和下载。",
                "Meet Star-Armor Tuantuan and three golden guardian ducks. Preview and install four original Codex v2 pets—no account required.",
              )}
            </p>
            <div className="button-row">
              <a className="brutal-button primary" href="#pets">
                {tr("认识团团", "Meet Tuantuan")} <span aria-hidden="true">↓</span>
              </a>
              <a className="brutal-button secondary" href="#install">
                {tr("查看安装方法", "How to install")} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="independent-note">
              <span aria-hidden="true">●</span>{" "}
              {tr(
                "面向 Codex Desktop 自定义宠物格式的独立项目",
                "An independent project for the Codex Desktop custom-pet format",
              )}
            </p>
          </article>

          <article
            className="bento-card hero-pet-card"
            style={{ "--pet-accent": selectedPet.accent } as CSSProperties}
          >
            <div className="pet-stage-topline">
              <span className="pet-index">{selectedPet.badge}</span>
              <span className="live-pill">
                <span aria-hidden="true" /> {tr("真实图集", "REAL ATLAS")}
              </span>
            </div>
            <div className="hero-sprite-wrap">
              <div className="orbit orbit-one" aria-hidden="true" />
              <div className="orbit orbit-two" aria-hidden="true" />
              <SpritePet
                petId={selectedPet.id}
                animation={animation}
                frame={frame}
                eager
                label={tr(
                  `${selectedPet.zhName}正在${selectedAnimation.zh}的动画预览`,
                  `${selectedPet.enName} animation preview: ${selectedAnimation.en}`,
                )}
              />
            </div>
            <div className="hero-pet-caption">
              <div>
                <span>{tr("当前桌面搭子", "CURRENT COMPANION")}</span>
                <strong>{activePetName}</strong>
              </div>
              <button
                type="button"
                className="round-control"
                onClick={togglePlayback}
                aria-label={
                  isPlaying ? tr("暂停动画", "Pause animation") : tr("播放动画", "Play animation")
                }
              >
                {isPlaying ? "Ⅱ" : "▶"}
              </button>
            </div>
          </article>

          <div className="hero-metrics" aria-label={tr("宠物规格", "Pet specifications")}>
            <article className="bento-card metric-card metric-blue">
              <strong>4</strong>
              <span>{tr("款现有宠物", "AVAILABLE PETS")}</span>
            </article>
            <article className="bento-card metric-card metric-yellow">
              <strong>11</strong>
              <span>{tr("行动画图集", "ATLAS ROWS")}</span>
            </article>
            <article className="bento-card metric-card metric-coral">
              <strong>16</strong>
              <span>{tr("个注视方向", "LOOK DIRECTIONS")}</span>
            </article>
            <article className="bento-card metric-card metric-cream">
              <strong>2</strong>
              <span>{tr("个安装文件", "FILES TO INSTALL")}</span>
            </article>
          </div>
        </section>

        <section className="section-block" id="pets" aria-labelledby="pets-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">01 / THE ROSTER</span>
              <h2 id="pets-title">{tr("先选一位桌面搭子", "PICK YOUR DESK COMPANION")}</h2>
            </div>
            <p>
              {tr(
                "4 款模板均采用真实 Codex v2 manifest 与双文件安装结构。选择任意卡片，页面预览和安装命令会同步更新。",
                "All four templates use a real Codex v2 manifest and two-file install structure. Pick a card to update the preview and install command.",
              )}
            </p>
          </div>

          <div className="pet-grid">
            {PETS.map((pet, index) => {
              const isSelected = pet.id === selectedPet.id;
              return (
                <article
                  className={`bento-card pet-card ${isSelected ? "selected" : ""}`}
                  key={pet.id}
                  style={
                    {
                      "--pet-accent": pet.accent,
                      "--pet-soft-accent": pet.softAccent,
                    } as CSSProperties
                  }
                >
                  <div className="pet-card-number">0{index + 1}</div>
                  <div className="pet-card-sprite">
                    <SpritePet
                      petId={pet.id}
                      animation="idle"
                      frame={0}
                      label={tr(`${pet.zhName}静态预览`, `${pet.enName} still preview`)}
                    />
                  </div>
                  <div className="pet-card-content">
                    <span className="pet-id">{pet.id}</span>
                    <h3>{tr(pet.zhName, pet.enName)}</h3>
                    <p>{tr(pet.zhDescription, pet.enDescription)}</p>
                    <div className="pet-card-actions">
                      <button
                        type="button"
                        className="mini-button dark"
                        aria-pressed={isSelected}
                        onClick={() => selectPet(pet.id)}
                      >
                        {isSelected ? tr("预览中", "PREVIEWING") : tr("现场预览", "PREVIEW")}
                      </button>
                      <a
                        className="mini-button light"
                        href={`/downloads/${pet.id}.zip`}
                        download
                      >
                        {tr("下载", "DOWNLOAD")} ↓
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="preview-section" id="preview" aria-labelledby="preview-title">
          <article className="bento-card preview-copy-card">
            <span className="section-kicker">02 / LIVE PREVIEW</span>
            <h2 id="preview-title">{tr("它不只是待着。", "MORE THAN AN IDLE MASCOT.")}</h2>
            <p>
              {tr(
                "切换状态，看看宠物如何待机、挥手、等待、工作和审阅。每一帧都直接来自可下载的 spritesheet。",
                "Switch states to see your pet idle, wave, wait, work, and review. Every frame comes from the downloadable spritesheet.",
              )}
            </p>
            <div className="state-controls" aria-label={tr("动画状态", "Animation states")}>
              {ANIMATIONS.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  className={animation === item.key ? "active" : ""}
                  aria-pressed={animation === item.key}
                  onClick={() => setAnimation(item.key)}
                >
                  {tr(item.zh, item.en)}
                </button>
              ))}
            </div>
            <p className="preview-disclaimer">
              {tr(
                "实际播放节奏可能随 Codex Desktop 版本变化。",
                "Playback timing may vary by Codex Desktop version.",
              )}
            </p>
          </article>

          <article className="bento-card preview-stage-card">
            <div className="preview-stage-grid" aria-hidden="true" />
            <div className="preview-labels">
              <span>{activePetName}</span>
              <span>{tr(selectedAnimation.zh, selectedAnimation.en)}</span>
            </div>
            <div className="preview-sprite-wrap">
              <SpritePet
                petId={selectedPet.id}
                animation={animation}
                frame={frame}
                eager
                label={tr(
                  `${selectedPet.zhName}正在${selectedAnimation.zh}`,
                  `${selectedPet.enName}: ${selectedAnimation.en}`,
                )}
              />
            </div>
            <div className="timeline" aria-hidden="true">
              <span style={{ width: `${((frame + 1) / selectedAnimation.frames) * 100}%` }} />
            </div>
            <div className="preview-footer">
              <code>
                ROW {animation === "look" && frame >= 8 ? 10 : selectedAnimation.row} · FRAME{" "}
                {animation === "look" ? frame % 8 : frame}
              </code>
              <button type="button" onClick={togglePlayback}>
                {isPlaying ? tr("暂停", "PAUSE") : tr("播放", "PLAY")}
              </button>
            </div>
          </article>

          <article className="bento-card story-card story-blue">
            <span>01</span>
            <h3>{tr("工作时，陪着你", "PRESENT WHILE YOU WORK")}</h3>
            <p>
              {tr(
                "安静待机，也会用细微动作保持存在感。",
                "Quiet at idle, with just enough motion to feel present.",
              )}
            </p>
          </article>
          <article className="bento-card story-card story-yellow">
            <span>02</span>
            <h3>{tr("需要你时，等一等", "WAITS WHEN CODEX NEEDS YOU")}</h3>
            <p>
              {tr(
                "等待批准或输入时，宠物会切换为期待状态。",
                "When Codex needs input or approval, it can shift into an expectant state.",
              )}
            </p>
          </article>
          <article className="bento-card story-card story-coral">
            <span>03</span>
            <h3>{tr("完成前，再看一眼", "REVIEWS BEFORE IT RESTS")}</h3>
            <p>
              {tr(
                "工作与审阅拥有不同动画语义，不是重复待机。",
                "Working and reviewing have distinct animation meanings—not recycled idle frames.",
              )}
            </p>
          </article>
        </section>

        <section className="install-section" id="install" aria-labelledby="install-title">
          <div className="section-heading install-heading">
            <div>
              <span className="section-kicker">03 / INSTALL</span>
              <h2 id="install-title">{tr("三步住进 Codex", "IN CODEX IN THREE STEPS")}</h2>
            </div>
            <a
              className="brutal-button primary"
              href={`/downloads/${selectedPet.id}.zip`}
              download
            >
              {tr(`下载 ${selectedPet.zhName}`, `Download ${selectedPet.enName}`)} ↓
            </a>
          </div>

          <div className="install-grid">
            <div className="install-steps">
              {[
                ["01", tr("选择并下载", "Choose & download"), tr("下载当前宠物 ZIP 包。", "Download the current pet ZIP.")],
                [
                  "02",
                  tr("解压到 pets 目录", "Extract into pets"),
                  tr("保持宠物 ID 作为根目录。", "Keep the pet ID as the root folder."),
                ],
                [
                  "03",
                  tr("重启并选择宠物", "Reopen & select"),
                  tr("完整退出 Codex Desktop 后重新打开。", "Fully quit Codex Desktop, then reopen it."),
                ],
              ].map(([number, title, description]) => (
                <article className="bento-card install-step" key={number}>
                  <strong>{number}</strong>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}

              <article className="bento-card file-contract-card">
                <span className="section-kicker">FILE CONTRACT</span>
                <pre>
                  <code>{`${selectedPet.id}/\n├─ pet.json\n└─ spritesheet.webp`}</code>
                </pre>
                <p>
                  {tr(
                    "最终路径必须是 .codex/pets/<pet-id>/pet.json，不要多套一层目录。",
                    "The final path must be .codex/pets/<pet-id>/pet.json—avoid an extra nested folder.",
                  )}
                </p>
              </article>
            </div>

            <article className="bento-card command-card">
              <div className="command-card-header">
                <div className="platform-switch" aria-label={tr("安装平台", "Install platform")}>
                  <button
                    type="button"
                    className={installPlatform === "windows" ? "active" : ""}
                    aria-pressed={installPlatform === "windows"}
                    onClick={() => setInstallPlatform("windows")}
                  >
                    WINDOWS
                  </button>
                  <button
                    type="button"
                    className={installPlatform === "unix" ? "active" : ""}
                    aria-pressed={installPlatform === "unix"}
                    onClick={() => setInstallPlatform("unix")}
                  >
                    macOS / LINUX
                  </button>
                </div>
                <button
                  type="button"
                  className="copy-button"
                  onClick={() => copyText(activePetCommand, "pet-command")}
                >
                  {copied === "pet-command" ? tr("已复制", "COPIED") : tr("复制命令", "COPY")}
                </button>
              </div>
              <pre className="terminal">
                <code>{activePetCommand}</code>
              </pre>
              <div className="install-notes">
                <p>
                  <span aria-hidden="true">!</span>
                  {tr(
                    "同 ID 安装会替换现有文件；如果做过自定义修改，请先备份。",
                    "Installing the same ID replaces existing files; back up custom edits first.",
                  )}
                </p>
                <p>
                  <span aria-hidden="true">↻</span>
                  {tr(
                    "安装后完整退出并重新打开 Codex Desktop。",
                    "Fully quit and reopen Codex Desktop after installing.",
                  )}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="skill-section" id="skill" aria-labelledby="skill-title">
          <article className="bento-card skill-copy-card">
            <div className="skill-symbol" aria-hidden="true">
              ✦
            </div>
            <span className="section-kicker">04 / HATCH PET SKILL</span>
            <h2 id="skill-title">
              {tr("不只下载，也能孵一只属于你的。", "DON'T JUST DOWNLOAD ONE—HATCH YOUR OWN.")}
            </h2>
            <p>
              {tr(
                "Hatch Pet 是一套带生成、结构校验、动画 QA 与 v2 打包流程的制作 Skill。它可以从文字或角色参考图创建、修复并打包 Codex 宠物。",
                "Hatch Pet is a production skill with generation, structural validation, animation QA, and v2 packaging. Create or repair a Codex pet from text or character references.",
              )}
            </p>
            <div className="button-row">
              <a className="brutal-button dark" href="/downloads/hatch-pet.zip" download>
                {tr("下载 Skill", "Download Skill")} ↓
              </a>
              <a
                className="brutal-button secondary"
                href="https://github.com/FrankLeLe/AI-Pet-Agents"
                target="_blank"
                rel="noreferrer"
              >
                {tr("查看源码", "View source")} ↗
              </a>
            </div>
            <p className="skill-caveat">
              {tr(
                "生成效果取决于参考图、角色复杂度与 QA 修复过程；这不是“任意图片一键必成”的承诺。",
                "Results depend on the references, character complexity, and QA repair process—this is not a one-click guarantee for every image.",
              )}
            </p>
          </article>

          <article className="bento-card skill-command-card">
            <div className="command-card-header">
              <div className="platform-switch" aria-label={tr("Skill 安装平台", "Skill install platform")}>
                <button
                  type="button"
                  className={skillPlatform === "windows" ? "active" : ""}
                  aria-pressed={skillPlatform === "windows"}
                  onClick={() => setSkillPlatform("windows")}
                >
                  WINDOWS
                </button>
                <button
                  type="button"
                  className={skillPlatform === "unix" ? "active" : ""}
                  aria-pressed={skillPlatform === "unix"}
                  onClick={() => setSkillPlatform("unix")}
                >
                  macOS / LINUX
                </button>
              </div>
              <button
                type="button"
                className="copy-button"
                onClick={() => copyText(activeSkillCommand, "skill-command")}
              >
                {copied === "skill-command" ? tr("已复制", "COPIED") : tr("复制", "COPY")}
              </button>
            </div>
            <pre className="terminal skill-terminal">
              <code>{activeSkillCommand}</code>
            </pre>
            <div className="prompt-example">
              <span>{tr("重启 Codex 后试试", "TRY AFTER RESTARTING CODEX")}</span>
              <p>
                {tr(
                  "使用 $hatch-pet，根据这张角色参考图创建一个 Codex v2 宠物。名字叫「云朵」，风格为软胶贴纸。",
                  "Use $hatch-pet to turn this character reference into a Codex v2 pet named Cloudy in a soft vinyl sticker style.",
                )}
              </p>
              <button
                type="button"
                onClick={() =>
                  copyText(
                    tr(
                      "使用 $hatch-pet，根据这张角色参考图创建一个 Codex v2 宠物。名字叫「云朵」，风格为软胶贴纸。",
                      "Use $hatch-pet to turn this character reference into a Codex v2 pet named Cloudy in a soft vinyl sticker style.",
                    ),
                    "prompt",
                  )
                }
              >
                {copied === "prompt" ? tr("已复制", "COPIED") : tr("复制提示词", "COPY PROMPT")}
              </button>
            </div>
          </article>
        </section>

        <section className="tech-section" aria-labelledby="tech-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">05 / TRANSPARENCY</span>
              <h2 id="tech-title">{tr("很可爱，也很具体。", "CUTE, WITH A CONCRETE FILE CONTRACT.")}</h2>
            </div>
            <p>
              {tr(
                "网站展示的是实际可安装文件，不是占位概念图。",
                "This site presents real installable files—not placeholder concept art.",
              )}
            </p>
          </div>

          <div className="tech-grid">
            <article className="bento-card manifest-card">
              <div className="code-dots" aria-hidden="true">
                <span /> <span /> <span />
              </div>
              <pre>
                <code>{`{
  "id": "${selectedPet.id}",
  "displayName": "${selectedPet.zhName}",
  "spriteVersionNumber": 2,
  "spritesheetPath": "spritesheet.webp"
}`}</code>
              </pre>
              <a href={`/pets/${selectedPet.id}/pet.json`} target="_blank" rel="noreferrer">
                {tr("查看真实 manifest", "View real manifest")} ↗
              </a>
            </article>

            <article className="bento-card spec-card">
              <span className="section-kicker">ATLAS</span>
              <strong>1536 × 2288</strong>
              <div className="spec-list">
                <span>8 × 11 GRID</span>
                <span>192 × 208 CELL</span>
                <span>9 STATES</span>
                <span>16 DIRECTIONS</span>
              </div>
            </article>

            <a
              className="bento-card repo-card"
              href="https://github.com/FrankLeLe/AI-Pet-Agents"
              target="_blank"
              rel="noreferrer"
            >
              <span>GITHUB ↗</span>
              <strong>{tr("代码与宠物数据公开管理", "CODE & PET DATA, MANAGED IN PUBLIC")}</strong>
              <small>FrankLeLe / AI-Pet-Agents</small>
            </a>

            <article className="bento-card cloud-card">
              <span>CLOUDFLARE</span>
              <strong>{tr("边缘部署，无需登录即可访问", "EDGE-DEPLOYED, NO LOGIN TO VISIT")}</strong>
              <small>pet.nanabananalanfu.com</small>
            </article>
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="faq-intro">
            <span className="section-kicker">06 / FAQ</span>
            <h2 id="faq-title">{tr("常见问题，不藏在盔甲里。", "QUESTIONS, OUT IN THE OPEN.")}</h2>
          </div>
          <div className="faq-list">
            {[
              [
                tr("为什么安装后没看到？", "Why doesn't my pet appear?"),
                tr(
                  "核对目录是否精确为 .codex/pets/<id>/pet.json，确认 pet.json 与 spritesheet.webp 同目录，并完整重启 Codex Desktop。",
                  "Confirm the exact path is .codex/pets/<id>/pet.json, keep pet.json beside spritesheet.webp, and fully restart Codex Desktop.",
                ),
              ],
              [
                tr("macOS 和 Linux 可以安装吗？", "Can I install on macOS or Linux?"),
                tr(
                  "使用 ${CODEX_HOME:-$HOME/.codex}/pets/<id>。实际可用性仍取决于对应 Codex Desktop 版本。",
                  "Use ${CODEX_HOME:-$HOME/.codex}/pets/<id>. Availability still depends on your Codex Desktop version.",
                ),
              ],
              [
                tr("这是 OpenAI 官方宠物库吗？", "Is this an official OpenAI pet library?"),
                tr(
                  "不是。这是围绕 Codex Desktop 自定义宠物格式创建的独立项目。",
                  "No. This is an independent project built around the Codex Desktop custom-pet format.",
                ),
              ],
              [
                tr("这些素材可以商用吗？", "Can I use the artwork commercially?"),
                tr(
                  "请以 GitHub 仓库的 LICENSE 与各项素材声明为准；不要在没有授权的情况下重新分发或商用。",
                  "Follow the repository LICENSE and any asset-specific notices; do not redistribute or commercialize without permission.",
                ),
              ],
            ].map(([question, answer], index) => (
              <details className="bento-card faq-item" key={question} open={index === 0}>
                <summary>
                  <span>{question}</span>
                  <strong aria-hidden="true">＋</strong>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bento-card final-cta">
          <div>
            <span className="section-kicker">READY WHEN YOU ARE</span>
            <h2>{tr("给桌面搭个伴。", "GIVE YOUR DESKTOP A COMPANION.")}</h2>
          </div>
          <div className="button-row">
            <a className="brutal-button dark" href="#pets">
              {tr("浏览全部宠物", "Browse all pets")} ↑
            </a>
            <a className="brutal-button primary" href="/downloads/hatch-pet.zip" download>
              {tr("获取 Hatch Pet Skill", "Get Hatch Pet Skill")} ↓
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>CODEX PETS</strong>
          <span>© 2026 INDEPENDENT PROJECT</span>
        </div>
        <p>
          {tr(
            "无需账号即可浏览和下载。Codex 与 OpenAI 是其各自权利人的标识，本项目不代表官方背书。",
            "Browse and download without an account. Codex and OpenAI are marks of their respective owners; this project is not an official endorsement.",
          )}
        </p>
        <a href="https://github.com/FrankLeLe/AI-Pet-Agents" target="_blank" rel="noreferrer">
          GITHUB ↗
        </a>
      </footer>

      <a className="mobile-install-cta" href={`/downloads/${selectedPet.id}.zip`} download>
        {tr(`下载 ${selectedPet.zhName}`, `Download ${selectedPet.enName}`)} ↓
      </a>

      <div className="sr-only" aria-live="polite">
        {copied ? tr("内容已复制到剪贴板", "Copied to clipboard") : ""}
      </div>
    </div>
  );
}
