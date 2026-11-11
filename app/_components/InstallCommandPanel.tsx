"use client";

import { useEffect, useMemo, useState } from "react";

import type { Language } from "@/lib/pets";

import styles from "./install-command-panel.module.css";

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
$target = Join-Path $skillsRoot "hatch-pet"
$archive = Join-Path $env:USERPROFILE "Downloads\\hatch-pet.zip"

if (Test-Path -LiteralPath $target) { throw "hatch-pet already exists. Stop and review it before replacing anything." }
New-Item -ItemType Directory -Force -Path $skillsRoot | Out-Null
Expand-Archive -LiteralPath $archive -DestinationPath $skillsRoot`,
      unix: `codex_root="\${CODEX_HOME:-$HOME/.codex}"
skills_root="$codex_root/skills"
target="$skills_root/hatch-pet"
archive="$HOME/Downloads/hatch-pet.zip"

[ -e "$target" ] && { echo "hatch-pet already exists. Stop and review it before replacing anything."; exit 1; }
mkdir -p "$skills_root"
unzip "$archive" -d "$skills_root"`,
    };
  }

  return {
    windows: `$petId = "${petId ?? "pet-id"}"
$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE ".codex" }
$petsRoot = Join-Path $codexRoot "pets"
$target = Join-Path $petsRoot $petId
$archive = Join-Path $env:USERPROFILE "Downloads\\$petId.zip"

if (Test-Path -LiteralPath $target) { throw "$petId already exists. Stop and review it before replacing anything." }
New-Item -ItemType Directory -Force -Path $petsRoot | Out-Null
Expand-Archive -LiteralPath $archive -DestinationPath $petsRoot`,
    unix: `pet_id="${petId ?? "pet-id"}"
codex_root="\${CODEX_HOME:-$HOME/.codex}"
pets_root="$codex_root/pets"
target="$pets_root/$pet_id"
archive="$HOME/Downloads/$pet_id.zip"

[ -e "$target" ] && { echo "$pet_id already exists. Stop and review it before replacing anything."; exit 1; }
mkdir -p "$pets_root"
unzip "$archive" -d "$pets_root"`,
  };
}

export function InstallCommandPanel({ language, mode, petId }: InstallCommandPanelProps) {
  const [platform, setPlatform] = useState<Platform>("windows");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const commands = useMemo(() => getCommands(mode, petId), [mode, petId]);
  const command = commands[platform];

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyCommand() {
    let didCopy = false;

    try {
      await navigator.clipboard.writeText(command);
      didCopy = true;
    } catch {
      const textarea = document.createElement("textarea");
      try {
        textarea.value = command;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        didCopy = document.execCommand("copy");
      } catch {
        didCopy = false;
      } finally {
        textarea.remove();
      }
    }

    if (!didCopy) {
      setCopied(false);
      setCopyFailed(true);
      return;
    }

    setCopyFailed(false);
    setCopied(true);
  }

  return (
    <div className={styles.commandPanel}>
      <div className={styles.commandToolbar}>
        <div className={styles.platformSwitch} aria-label={language === "zh" ? "选择电脑系统" : "Choose your operating system"}>
          <button
            type="button"
            className={platform === "windows" ? styles.platformActive : undefined}
            aria-pressed={platform === "windows"}
            onClick={() => setPlatform("windows")}
          >
            Windows
          </button>
          <button
            type="button"
            className={platform === "unix" ? styles.platformActive : undefined}
            aria-pressed={platform === "unix"}
            onClick={() => setPlatform("unix")}
          >
            macOS / Linux
          </button>
        </div>
        <button
          className={styles.copyButton}
          type="button"
          onClick={copyCommand}
          data-copy-state={copied ? "success" : copyFailed ? "error" : "idle"}
        >
          {copied
            ? language === "zh"
              ? "已复制"
              : "Copied"
            : copyFailed
              ? language === "zh"
                ? "复制失败，请重试"
                : "Couldn’t copy · Retry"
              : language === "zh"
                ? "复制命令"
                : "Copy command"}
        </button>
      </div>
      <pre className={styles.commandCode} tabIndex={0}>
        <code>{command}</code>
      </pre>
      <p className={styles.commandNote}>
        {language === "zh"
          ? "先将下载的文件放进“下载”（Downloads）文件夹。运行命令后，完整退出并重新打开 Codex Desktop。"
          : "Put the downloaded file in your Downloads folder first. After running the command, fully quit and reopen Codex Desktop."}
      </p>
      {copyFailed ? (
        <p className={styles.copyError} role="alert" aria-live="assertive">
          {language === "zh"
            ? "没能自动复制。请在上方代码框中手动选择并复制。"
            : "Couldn’t copy automatically. Select and copy the command from the code box above."}
        </p>
      ) : null}
      <span className={styles.srOnly} aria-live="polite">
        {copyFailed
          ? language === "zh"
            ? "命令复制失败"
            : "Command copy failed"
          : copied
            ? language === "zh"
              ? "命令已复制到剪贴板"
              : "Command copied to clipboard"
            : ""}
      </span>
    </div>
  );
}
