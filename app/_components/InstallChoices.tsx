"use client";

import { Check, Copy, Download, FolderOpen, ShieldCheck } from "lucide-react";
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
};

type CopyTarget = "windows" | "unix" | "prompt" | null;

const WINDOWS_PETS_PATH = "%USERPROFILE%\\.codex\\pets";
const UNIX_PETS_PATH = "~/.codex/pets";

async function writeClipboard(value: string) {
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
}

export function InstallChoices({
  language,
  petId,
  petName,
  downloadPath,
  codexPrompt,
  sha256,
  sizeLabel,
}: InstallChoicesProps) {
  const [copied, setCopied] = useState<CopyTarget>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(null), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy(target: Exclude<CopyTarget, null>, value: string) {
    await writeClipboard(value);
    setCopied(target);
  }

  const copiedLabel = language === "zh" ? "已复制" : "Copied";

  return (
    <section className={styles.choices} aria-labelledby="install-choice-heading">
      <header className={styles.heading}>
        <span>CHOOSE A ROUTE</span>
        <h2 id="install-choice-heading">
          {language === "zh" ? "选一种安装方式" : "CHOOSE AN INSTALL ROUTE"}
        </h2>
        <p>
          {language === "zh"
            ? "两种方式安装的是同一个宠物包。"
            : "Both routes install the same pet package."}
        </p>
      </header>

      <div className={styles.choiceGrid}>
        <article className={styles.manualCard}>
          <div className={styles.choiceTitle}>
            <span>01</span>
            <div>
              <small>{language === "zh" ? "手动安装" : "Manual install"}</small>
              <h3>{language === "zh" ? "下载 ZIP，自己安装" : "Download the ZIP yourself"}</h3>
            </div>
          </div>

          <a className={styles.downloadButton} href={downloadPath} download>
            <Download aria-hidden="true" size={20} strokeWidth={3} />
            {language === "zh" ? `下载「${petName}」` : `Download ${petName}`}
          </a>
          <p className={styles.packageMeta}>
            ZIP · {sizeLabel} · SHA-256 {sha256.slice(0, 10)}…
          </p>

          <ol className={styles.steps}>
            <li>
              <strong>1</strong>
              <span>
                {language === "zh"
                  ? "打开下载的 ZIP。"
                  : "Open the downloaded ZIP."}
              </span>
            </li>
            <li>
              <strong>2</strong>
              <span>
                {language === "zh"
                  ? `把 ZIP 里面完整的「${petId}」文件夹放进 Codex 的 pets 目录。`
                  : `Move the complete “${petId}” folder from inside the ZIP into Codex's pets folder.`}
              </span>
            </li>
            <li>
              <strong>3</strong>
              <span>
                {language === "zh"
                  ? "完整退出 Codex Desktop，再重新打开。"
                  : "Fully quit Codex Desktop, then reopen it."}
              </span>
            </li>
          </ol>

          <div className={styles.pathButtons}>
            <button type="button" onClick={() => copy("windows", WINDOWS_PETS_PATH)}>
              {copied === "windows" ? <Check aria-hidden="true" size={17} /> : <FolderOpen aria-hidden="true" size={17} />}
              {copied === "windows" ? copiedLabel : language === "zh" ? "复制 Windows 路径" : "Copy Windows path"}
            </button>
            <button type="button" onClick={() => copy("unix", UNIX_PETS_PATH)}>
              {copied === "unix" ? <Check aria-hidden="true" size={17} /> : <FolderOpen aria-hidden="true" size={17} />}
              {copied === "unix" ? copiedLabel : language === "zh" ? "复制 macOS / Linux 路径" : "Copy macOS / Linux path"}
            </button>
          </div>

          <p className={styles.pathCheck}>
            {language === "zh" ? "最终应看到：" : "Final location: "}
            <code>{`pets/${petId}/pet.json`}</code>
          </p>
        </article>

        <article className={styles.codexCard} id="codex-install">
          <div className={styles.choiceTitle}>
            <span>02</span>
            <div>
              <small>{language === "zh" ? "Codex 协助安装" : "Codex-assisted install"}</small>
              <h3>{language === "zh" ? "让 Codex 帮我安装" : "Ask Codex to install it"}</h3>
            </div>
          </div>

          <p className={styles.codexIntro}>
            {language === "zh"
              ? "复制一段带固定来源、文件校验和写入边界的安装请求，发给 Codex。"
              : "Copy an install request with an immutable source, checksum, and strict write boundary, then send it to Codex."}
          </p>

          <button className={styles.copyPromptButton} type="button" onClick={() => copy("prompt", codexPrompt)}>
            {copied === "prompt" ? <Check aria-hidden="true" size={21} strokeWidth={3} /> : <Copy aria-hidden="true" size={21} strokeWidth={3} />}
            {copied === "prompt" ? copiedLabel : language === "zh" ? "复制给 Codex" : "Copy for Codex"}
          </button>

          <ul className={styles.safetyList}>
            <li>
              <ShieldCheck aria-hidden="true" size={19} strokeWidth={3} />
              {language === "zh" ? "固定 GitHub 版本与 SHA-256" : "Pinned GitHub version and SHA-256"}
            </li>
            <li>
              <ShieldCheck aria-hidden="true" size={19} strokeWidth={3} />
              {language === "zh" ? "只允许写入目标宠物目录" : "Writes only to the target pet folder"}
            </li>
            <li>
              <ShieldCheck aria-hidden="true" size={19} strokeWidth={3} />
              {language === "zh" ? "发现同名目录时先停下询问" : "Stops before replacing an existing folder"}
            </li>
          </ul>

          <details className={styles.promptPreview}>
            <summary>{language === "zh" ? "查看将复制的内容" : "Preview the copied request"}</summary>
            <pre>{codexPrompt}</pre>
          </details>
        </article>
      </div>

      <span className={styles.srOnly} aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </section>
  );
}
