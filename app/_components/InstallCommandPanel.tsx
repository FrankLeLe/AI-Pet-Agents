"use client";

import { useEffect, useMemo, useState } from "react";

import type { Language } from "@/lib/pets";

import styles from "./site-chrome.module.css";

type Platform = "windows" | "unix";

type InstallCommandPanelProps = {
  language: Language;
  mode: "pet" | "skill";
  petId?: string;
};

function getCommands(mode: "pet" | "skill", petId?: string) {
  if (mode === "skill") {
    return {
      windows: `$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE ".codex" }
$skillsRoot = Join-Path $codexRoot "skills"

New-Item -ItemType Directory -Force -Path $skillsRoot | Out-Null
Expand-Archive -LiteralPath (Join-Path $env:USERPROFILE "Downloads\\hatch-pet.zip") -DestinationPath $skillsRoot -Force`,
      unix: `codex_root="\${CODEX_HOME:-$HOME/.codex}"
skills_root="$codex_root/skills"

mkdir -p "$skills_root"
unzip -o "$HOME/Downloads/hatch-pet.zip" -d "$skills_root"`,
    };
  }

  return {
    windows: `$petId = "${petId ?? "pet-id"}"
$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE ".codex" }
$petsRoot = Join-Path $codexRoot "pets"

New-Item -ItemType Directory -Force -Path $petsRoot | Out-Null
Expand-Archive -LiteralPath (Join-Path $env:USERPROFILE "Downloads\\$petId.zip") -DestinationPath $petsRoot -Force`,
    unix: `pet_id="${petId ?? "pet-id"}"
codex_root="\${CODEX_HOME:-$HOME/.codex}"
pets_root="$codex_root/pets"

mkdir -p "$pets_root"
unzip -o "$HOME/Downloads/$pet_id.zip" -d "$pets_root"`,
  };
}

export function InstallCommandPanel({ language, mode, petId }: InstallCommandPanelProps) {
  const [platform, setPlatform] = useState<Platform>("windows");
  const [copied, setCopied] = useState(false);
  const commands = useMemo(() => getCommands(mode, petId), [mode, petId]);
  const command = commands[platform];

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = command;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
  }

  return (
    <div className={styles.commandPanel}>
      <div className={styles.commandToolbar}>
        <div className={styles.platformSwitch} aria-label={language === "zh" ? "选择系统" : "Choose platform"}>
          <button
            type="button"
            className={platform === "windows" ? styles.platformActive : undefined}
            aria-pressed={platform === "windows"}
            onClick={() => setPlatform("windows")}
          >
            WINDOWS
          </button>
          <button
            type="button"
            className={platform === "unix" ? styles.platformActive : undefined}
            aria-pressed={platform === "unix"}
            onClick={() => setPlatform("unix")}
          >
            macOS / LINUX
          </button>
        </div>
        <button className={styles.copyButton} type="button" onClick={copyCommand}>
          {copied ? (language === "zh" ? "已复制" : "COPIED") : language === "zh" ? "复制命令" : "COPY"}
        </button>
      </div>
      <pre className={styles.commandCode} tabIndex={0}>
        <code>{command}</code>
      </pre>
      <p className={styles.commandNote}>
        {language === "zh"
          ? "执行前先确认 ZIP 已下载到系统的 Downloads 文件夹。安装后完整退出并重新打开 Codex Desktop。"
          : "Before running, confirm the ZIP is in your Downloads folder. Fully quit and reopen Codex Desktop after installation."}
      </p>
      <span className={styles.srOnly} aria-live="polite">
        {copied ? (language === "zh" ? "命令已复制到剪贴板" : "Command copied to clipboard") : ""}
      </span>
    </div>
  );
}
