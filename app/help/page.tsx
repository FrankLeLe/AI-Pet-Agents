import { FileText } from "lucide-react";
import Link from "next/link";

import { SPRITE_FORMAT } from "@/lib/pets";

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
        "先确认最终路径是 .codex/pets/<pet-id>/pet.json，pet.json 和 spritesheet.webp 必须在同一目录。然后完整退出 Codex Desktop，而不是只关闭窗口，再重新打开。",
        "Confirm the final path is .codex/pets/<pet-id>/pet.json and keep pet.json beside spritesheet.webp. Then fully quit Codex Desktop—not just its window—and reopen it.",
      ),
    },
    {
      question: t(language, "同一个宠物可以重新安装吗？", "Can I reinstall the same pet?"),
      answer: t(
        language,
        "可以。先把现有同名文件夹改名或备份，再重新安装。本站提供的安装指令遇到同名目录会先停止，不会静默覆盖。",
        "Yes. Rename or back up the existing folder first. The install request provided here stops at a name conflict and never overwrites silently.",
      ),
    },
    {
      question: t(language, "macOS 和 Linux 的路径在哪里？", "Where is the path on macOS and Linux?"),
      answer: t(
        language,
        "默认路径是 ~/.codex/pets。若你设置了 CODEX_HOME，则使用 CODEX_HOME/pets。",
        "The default path is ~/.codex/pets. If CODEX_HOME is set, use CODEX_HOME/pets instead.",
      ),
    },
    {
      question: t(language, "为什么会出现两层同名文件夹？", "Why do I have two folders with the same name?"),
      answer: t(
        language,
        "ZIP 里面已经包含完整的宠物文件夹。请把 ZIP 内那一整层文件夹放入 pets，不要先解压到另一个同名目录。最终应直接看到 pets/<pet-id>/pet.json。",
        "The ZIP already contains the complete pet folder. Move that whole folder into pets instead of extracting it into another folder with the same name. The final path should be pets/<pet-id>/pet.json.",
      ),
    },
    {
      question: t(language, "这是 OpenAI 官方宠物库吗？", "Is this an official OpenAI pet library?"),
      answer: t(
        language,
        "不是。这是围绕 Codex Desktop 自定义宠物格式制作的独立项目，不代表官方认可或背书。",
        "No. This is an independent project built around the Codex Desktop custom-pet format and is not an official endorsement.",
      ),
    },
    {
      question: t(language, "素材可以重新分发或商用吗？", "Can I redistribute or commercialize the artwork?"),
      answer: t(
        language,
        "网站代码与宠物素材采用不同授权。重新使用前请查看本站的素材授权说明。",
        "The site code and pet artwork use different terms. Review the asset license published on this site before reuse.",
      ),
    },
  ];

  return (
    <PageShell language={language} currentPath="/help">
      <main className={styles.mainContent} id="main-content">
        <section className={`${styles.pageIntro} ${styles.pageIntroYellow}`}>
          <div>
            <p className={styles.eyebrow}>HELP</p>
            <h1 data-copy-role="page-headline">
              {t(language, "宠物没出现？", "PET MISSING?")}
            </h1>
          </div>
          <p>
            {t(
              language,
              "文件位置、目录层级和重启方式，最容易藏住问题。",
              "File location, folder depth, and restart behavior are the most common places to look.",
            )}
          </p>
        </section>

        <section className={styles.quickCheck} aria-labelledby="quick-check-title">
          <div>
            <p className={styles.eyebrow}>CHECK THESE FIRST</p>
            <h2 id="quick-check-title" data-copy-role="card-headline">
              {t(language, "先检查三处", "CHECK 3")}
            </h2>
          </div>
          <ol>
            <li>
              <strong>1</strong>
              <span>{t(language, "ZIP 已经解压，不是把压缩包直接放进 pets。", "The ZIP is extracted, not placed unopened in pets.")}</span>
            </li>
            <li>
              <strong>2</strong>
              <span>{t(language, "pet.json 与 spritesheet.webp 在同一层。", "pet.json sits beside spritesheet.webp.")}</span>
            </li>
            <li>
              <strong>3</strong>
              <span>{t(language, "完整退出 Codex 后重新打开。", "Codex was fully quit before reopening.")}</span>
            </li>
          </ol>
          <Link className={styles.primaryButton} href={withLanguage("/install", language)}>
            {t(language, "重新查看安装步骤", "Review installation")}
          </Link>
        </section>

        <section className={styles.helpLayout} aria-labelledby="faq-title">
          <div className={styles.helpAside}>
            <p className={styles.eyebrow}>FAQ</p>
            <h2 id="faq-title" data-copy-role="card-headline">
              {t(language, "常见问题", "COMMON QUESTIONS")}
            </h2>
            <p>{t(language, "安装、路径和素材授权都可以在这里查到。", "Find answers about installation, paths, and artwork licenses.")}</p>
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

        <details className={styles.advancedFormat}>
          <summary>{t(language, "宠物文件说明（高级）", "Pet file details (advanced)")}</summary>
        <section className={styles.formatSection} aria-labelledby="format-title">
          <div className={styles.formatCopy}>
            <p className={styles.eyebrow}>ADVANCED / PET FILES</p>
            <h2 id="format-title" data-copy-role="card-headline">
              {t(language, "文件结构", "PET FILES")}
            </h2>
            <p>
              {t(
                language,
                "每只宠物由 manifest 与实际图集组成。网站预览直接读取同一张 spritesheet，不是另做的概念动画。",
                "Every pet consists of a manifest and the real atlas. Site previews read the same spritesheet—not a separate concept animation.",
              )}
            </p>
            <code>{`<pet-id>/\n├─ pet.json\n└─ spritesheet.webp`}</code>
          </div>
          <dl className={styles.specGrid}>
            <div>
              <dt>{t(language, "图集尺寸", "Atlas")}</dt>
              <dd>{SPRITE_FORMAT.atlasWidth} × {SPRITE_FORMAT.atlasHeight}</dd>
            </div>
            <div>
              <dt>{t(language, "网格", "Grid")}</dt>
              <dd>{SPRITE_FORMAT.columns} × {SPRITE_FORMAT.rows}</dd>
            </div>
            <div>
              <dt>{t(language, "单格尺寸", "Cell")}</dt>
              <dd>{SPRITE_FORMAT.cellWidth} × {SPRITE_FORMAT.cellHeight}</dd>
            </div>
            <div>
              <dt>{t(language, "格式版本", "Version")}</dt>
              <dd>v{SPRITE_FORMAT.spriteVersionNumber}</dd>
            </div>
          </dl>
        </section>
        </details>

        <aside className={styles.repoStrip}>
          <div>
            <p className={styles.eyebrow}>SOURCE & LICENSES</p>
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
