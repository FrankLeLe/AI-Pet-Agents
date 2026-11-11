import { FileText } from "lucide-react";
import Link from "next/link";

import { normalizeLanguage, PageShell, t, withLanguage } from "../_components/SiteChrome";
import styles from "../_components/site-chrome.module.css";

type HelpPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function HelpPage({ searchParams }: HelpPageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);

  const faqs = [
    {
      question: t(language, "安装后为什么没有看到宠物？", "Why does my pet not appear after installation?"),
      answer: t(
        language,
        "等 Codex 提示安装完成后，完整退出应用并重新打开。只关闭窗口可能还没有退出。如果宠物仍未出现，把遇到的情况发给 Codex，请它帮你检查安装。",
        "Wait until Codex confirms installation is complete, then fully quit and reopen the app. Closing the window may leave it running. If your pet is still missing, tell Codex what happened and ask it to check the installation.",
      ),
    },
    {
      question: t(language, "同一个宠物可以重新安装吗？", "Can I reinstall the same pet?"),
      answer: t(
        language,
        "可以。请先备份已有的宠物。使用本站的安装请求时，Codex 遇到同名宠物会先请你确认，再继续处理。",
        "Yes. Back up your existing pet first. With the install request provided here, Codex will ask before replacing a pet with the same name.",
      ),
    },
    {
      question: t(language, "手动安装时，宠物文件放在哪里？", "Where do I put the files for a manual installation?"),
      answer: t(
        language,
        "先解压下载的文件，再把里面完整的宠物文件夹放入用户目录下的 .codex/pets。macOS 和 Linux 可打开 ~/.codex/pets；Windows 可打开 %USERPROFILE%\\.codex\\pets。若你设置了 CODEX_HOME，则使用 CODEX_HOME/pets。",
        "Extract the download, then move the complete pet folder into .codex/pets in your user folder. On macOS and Linux, open ~/.codex/pets; on Windows, open %USERPROFILE%\\.codex\\pets. If you have set CODEX_HOME, use CODEX_HOME/pets instead.",
      ),
    },
    {
      question: t(language, "手动解压后，怎样确认文件放对了？", "How can I check the files after extracting them?"),
      answer: t(
        language,
        "打开 pets 里的宠物文件夹，应直接看到 pet.json 和 spritesheet.webp。它们要放在一起。如果里面还有一层同名文件夹，请把内层文件夹移出来，避免多套一层。",
        "Open your pet's folder inside pets. You should see pet.json and spritesheet.webp together. If there is another folder with the same name inside, move the inner folder out so there is only one level.",
      ),
    },
    {
      question: t(language, "这是 OpenAI 官方宠物库吗？", "Is this an official OpenAI pet library?"),
      answer: t(
        language,
        "不是。这是为 Codex 制作宠物的独立站点，与 OpenAI 没有官方关联。",
        "No. This is an independent site making pets for Codex and is not officially affiliated with OpenAI.",
      ),
    },
    {
      question: t(language, "素材可以重新分发或商用吗？", "Can I redistribute or commercialize the artwork?"),
      answer: t(
        language,
        "宠物图像与动画有独立的使用条款。重新使用前，请查看本站的素材授权说明。",
        "The pet images and animations have their own usage terms. Read the asset license published on this site before reusing them.",
      ),
    },
  ];

  return (
    <PageShell language={language} currentPath="/help">
      <main className={styles.mainContent} id="main-content">
        <section className={`${styles.pageIntro} ${styles.pageIntroYellow}`}>
          <div>
            <p className={styles.eyebrow}>{t(language, "使用帮助", "HELP")}</p>
            <h1 data-copy-role="page-headline">
              {t(language, "宠物没出现？", "PET MISSING?")}
            </h1>
          </div>
          <p>
            {t(
              language,
              "先确认安装已完成，再重新打开 Codex。更多办法在下面。",
              "Check that installation has finished, then reopen Codex. Find more help below.",
            )}
          </p>
        </section>

        <section className={styles.quickCheck} aria-labelledby="quick-check-title">
          <div>
            <p className={styles.eyebrow}>{t(language, "从这里开始", "START HERE")}</p>
            <h2 id="quick-check-title" data-copy-role="card-headline">
              {t(language, "先试这三步", "TRY THESE STEPS")}
            </h2>
          </div>
          <ol>
            <li>
              <strong>1</strong>
              <span>{t(language, "确认安装请求已粘贴到 Codex 并发送。", "Check that you pasted and sent the install request in Codex.")}</span>
            </li>
            <li>
              <strong>2</strong>
              <span>{t(language, "等 Codex 告诉你安装完成。", "Wait for Codex to confirm the installation is complete.")}</span>
            </li>
            <li>
              <strong>3</strong>
              <span>{t(language, "完整退出 Codex，再重新打开。", "Fully quit Codex, then reopen it.")}</span>
            </li>
          </ol>
          <Link className={styles.primaryButton} href={withLanguage("/install", language)}>
            {t(language, "重新查看安装步骤", "Review installation")}
          </Link>
        </section>

        <section className={styles.helpLayout} aria-labelledby="faq-title">
          <div className={styles.helpAside}>
            <p className={styles.eyebrow}>{t(language, "你可能想问", "FAQ")}</p>
            <h2 id="faq-title" data-copy-role="card-headline">
              {t(language, "常见问题", "COMMON QUESTIONS")}
            </h2>
            <p>{t(language, "安装遇到问题，或想了解素材的使用方式，可以在这里找到答案。", "Find help with installation and learn how you can use the artwork.")}</p>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item, index) => (
              <details open={index === 0} key={item.question}>
                <summary>
                  <span>{item.question}</span>
                  <strong aria-hidden="true">＋</strong>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <aside className={styles.repoStrip}>
          <div>
            <p className={styles.eyebrow}>{t(language, "使用须知", "ARTWORK USE")}</p>
            <h2 data-copy-role="card-headline">
              {t(language, "素材授权", "ASSET LICENSE")}
            </h2>
          </div>
          <a
            className={styles.darkButton}
            href="/licenses/ASSET-LICENSE.txt"
            target="_blank"
            rel="noreferrer"
          >
            {t(language, "查看授权说明", "View asset license")}
            <FileText aria-hidden="true" size={17} strokeWidth={3} />
          </a>
        </aside>
      </main>
    </PageShell>
  );
}
