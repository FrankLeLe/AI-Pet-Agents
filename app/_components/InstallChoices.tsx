"use client";

import { Check, Copy, Download, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";

import type { Language } from "@/lib/pets";

import styles from "./install-choices.module.css";

type InstallChoicesProps = {
  language: Language;
  petId: string;
  petName: string;
  downloadPath: string;
  codexPrompt: string;
  sha256: string;
  sizeLabel: string;
  sourceCommit: string;
  sourceUrl: string;
};

type CopyTarget = "windows" | "unix" | "prompt" | null;

const WINDOWS_PETS_PATH = "%USERPROFILE%\\.codex\\pets";
const UNIX_PETS_PATH = "~/.codex/pets";

async function writeClipboard(value: string) {
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

export function InstallChoices({
  language,
  petId,
  petName,
  downloadPath,
  codexPrompt,
  sha256,
  sizeLabel,
  sourceCommit,
  sourceUrl,
}: InstallChoicesProps) {
  const [copied, setCopied] = useState<CopyTarget>(null);
  const [copyFailed, setCopyFailed] = useState<CopyTarget>(null);

  useEffect(() => {
    if (!copied || copied === "prompt") return;
    const timer = setTimeout(() => setCopied(null), 2400);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy(target: Exclude<CopyTarget, null>, value: string) {
    const didCopy = await writeClipboard(value);
    if (didCopy) {
      setCopyFailed(null);
      setCopied(target);
      return;
    }

    setCopied(null);
    setCopyFailed(target);
  }

  const promptCopied = copied === "prompt";
  const copyFailedLabel = language === "zh" ? "没能自动复制" : "Couldn’t copy automatically";
  const copiedLabel = language === "zh" ? "已复制" : "Copied";

  return (
    <section className={styles.choices} aria-labelledby="install-choice-heading">
      <article
        className={styles.codexCard}
        id="codex-install"
        data-install-method="codex"
        data-priority="primary"
      >
        <div className={styles.cardCopy}>
          <span>CODEX DESKTOP</span>
          <h2 id="install-choice-heading" data-copy-role="card-headline">
            {language === "zh" ? "用 Codex 安装" : "CODEX INSTALL"}
          </h2>
          <p>
            {language === "zh"
              ? "复制这段话，回到 Codex 粘贴并发送。"
              : "Copy this request, then paste and send it in Codex."}
          </p>
        </div>

        <button
          className={`${styles.copyPromptButton} ${promptCopied ? styles.copyPromptButtonDone : ""}`}
          type="button"
          onClick={() => copy("prompt", codexPrompt)}
          data-copy-state={promptCopied ? "success" : copyFailed === "prompt" ? "error" : "idle"}
        >
          {promptCopied ? (
            <Check aria-hidden="true" size={22} strokeWidth={3} />
          ) : (
            <Copy aria-hidden="true" size={22} strokeWidth={3} />
          )}
          {promptCopied
            ? copiedLabel
            : language === "zh"
              ? "复制给 Codex"
              : "Copy for Codex"}
        </button>

        {promptCopied ? (
          <div className={styles.handoff} role="status" aria-live="polite">
            <Check aria-hidden="true" size={22} strokeWidth={3} />
            <div>
              <strong>{language === "zh" ? "现在回到 Codex" : "Now return to Codex"}</strong>
              <span>
                {language === "zh"
                  ? `粘贴并发送。安装结束后重新打开 Codex，就能找到「${petName}」。`
                  : `Paste and send. Reopen Codex when it finishes to find ${petName}.`}
              </span>
            </div>
          </div>
        ) : null}

        {copyFailed === "prompt" ? (
          <div className={styles.copyError} role="alert" aria-live="assertive">
            <strong>{copyFailedLabel}</strong>
            <span>
              {language === "zh"
                ? "请在下方打开安装指令并手动复制。"
                : "Open the install request below and copy it manually."}
            </span>
          </div>
        ) : null}

        <details className={styles.promptPreview} open={copyFailed === "prompt"}>
          <summary>{language === "zh" ? "查看安装指令与来源" : "View request and source"}</summary>
          <div className={styles.sourceMeta}>
            <a href={sourceUrl} target="_blank" rel="noreferrer">
              Cloudflare CDN · {sourceCommit.slice(0, 8)}
            </a>
            <code>SHA-256 · {sha256}</code>
          </div>
          <textarea
            aria-label={language === "zh" ? "完整安装指令" : "Full install request"}
            readOnly
            value={codexPrompt}
            onFocus={(event) => event.currentTarget.select()}
          />
        </details>
      </article>

      <details
        className={styles.manualInstall}
        data-install-method="zip"
        data-priority="secondary"
      >
        <summary>{language === "zh" ? "手动安装 ZIP" : "Install the ZIP manually"}</summary>
        <div className={styles.manualBody}>
          <div className={styles.manualHeading}>
            <div>
              <strong>{petName}</strong>
              <span>ZIP · {sizeLabel}</span>
            </div>
            <a className={styles.downloadButton} href={downloadPath} download>
              <Download aria-hidden="true" size={19} strokeWidth={3} />
              {language === "zh" ? "下载 ZIP" : "Download ZIP"}
            </a>
          </div>

          <ol className={styles.steps}>
            <li>
              {language === "zh"
                ? `解压后，把完整的「${petId}」文件夹放进 Codex 的 pets 目录。`
                : `Unzip it, then move the complete “${petId}” folder into Codex’s pets folder.`}
            </li>
            <li>
              {language === "zh"
                ? "完整退出 Codex Desktop，再重新打开。"
                : "Fully quit Codex Desktop, then reopen it."}
            </li>
          </ol>

          <div className={styles.pathButtons}>
            <button type="button" onClick={() => copy("windows", WINDOWS_PETS_PATH)}>
              {copied === "windows" ? (
                <Check aria-hidden="true" size={17} />
              ) : (
                <FolderOpen aria-hidden="true" size={17} />
              )}
              {copied === "windows"
                ? copiedLabel
                : language === "zh"
                  ? "复制 Windows 路径"
                  : "Copy Windows path"}
            </button>
            <button type="button" onClick={() => copy("unix", UNIX_PETS_PATH)}>
              {copied === "unix" ? (
                <Check aria-hidden="true" size={17} />
              ) : (
                <FolderOpen aria-hidden="true" size={17} />
              )}
              {copied === "unix"
                ? copiedLabel
                : language === "zh"
                  ? "复制 macOS / Linux 路径"
                  : "Copy macOS / Linux path"}
            </button>
          </div>

          {copyFailed === "windows" || copyFailed === "unix" ? (
            <p className={styles.pathError} role="alert">
              {copyFailedLabel}: <code>{copyFailed === "windows" ? WINDOWS_PETS_PATH : UNIX_PETS_PATH}</code>
            </p>
          ) : null}
        </div>
      </details>

      <span className={styles.srOnly} aria-live="polite">
        {copyFailed
          ? copyFailedLabel
          : promptCopied
            ? language === "zh"
              ? "安装指令已复制"
              : "Install request copied"
            : copied
              ? copiedLabel
              : ""}
      </span>
    </section>
  );
}
