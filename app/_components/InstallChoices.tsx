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
  sizeLabel: string;
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
  sizeLabel,
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
            {language === "zh" ? "用 Codex 安装" : "INSTALL WITH CODEX"}
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
                  ? `粘贴并发送，按 Codex 的提示完成安装。然后重新打开 Codex，在宠物列表中选择「${petName}」。`
                  : `Paste and send, then follow Codex’s instructions to finish installing. Reopen Codex and choose ${petName} from the pet list.`}
              </span>
            </div>
          </div>
        ) : null}

        {copyFailed === "prompt" ? (
          <div className={styles.copyError} role="alert" aria-live="assertive">
            <strong>{copyFailedLabel}</strong>
            <span>
              {language === "zh"
                ? "展开下方的内容，选中后手动复制。"
                : "Expand the request below, then select and copy it."}
            </span>
          </div>
        ) : null}

        <details className={styles.promptPreview} open={copyFailed === "prompt"}>
          <summary>{language === "zh" ? "查看要发送的内容" : "Review the request"}</summary>
          <textarea
            aria-label={language === "zh" ? "发给 Codex 的安装请求" : "Installation request for Codex"}
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
        <summary>{language === "zh" ? "手动安装" : "Install manually"}</summary>
        <div className={styles.manualBody}>
          <div className={styles.manualHeading}>
            <div>
              <strong>{petName}</strong>
              <span>{sizeLabel}</span>
            </div>
            <a className={styles.downloadButton} href={downloadPath} download>
              <Download aria-hidden="true" size={19} strokeWidth={3} />
              {language === "zh" ? "下载宠物文件" : "Download pet files"}
            </a>
          </div>

          <ol className={styles.steps}>
            <li>
              {language === "zh"
                ? `解压下载的文件，把「${petId}」文件夹完整放到下方的安装位置。`
                : `Extract the download, then move the complete “${petId}” folder to the installation location below.`}
            </li>
            <li>
              {language === "zh"
                ? "完整退出 Codex Desktop，再重新打开。"
                : "Fully quit Codex Desktop, then reopen it."}
            </li>
            <li>
              {language === "zh"
                ? `打开宠物列表，选择「${petName}」。`
                : `Open the pet list and choose ${petName}.`}
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
                  ? "复制 Windows 安装位置"
                  : "Copy Windows folder"}
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
                  ? "复制 macOS / Linux 安装位置"
                  : "Copy macOS / Linux folder"}
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
