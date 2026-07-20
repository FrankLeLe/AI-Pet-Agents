import { ExternalLink } from "lucide-react";
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
        "可以，但同 ID 文件会被替换。如果你修改过 pet.json 或图集，请先复制一份备份。",
        "Yes, but files with the same ID are replaced. Back up pet.json or the spritesheet first if you edited them.",
      ),
    },
    {
      question: t(language, "macOS 和 Linux 的路径在哪里？", "Where is the path on macOS and Linux?"),
      answer: t(
        language,
        "默认使用 ${CODEX_HOME:-$HOME/.codex}/pets/<pet-id>。实际支持仍取决于你使用的 Codex Desktop 版本。",
        "The default is ${CODEX_HOME:-$HOME/.codex}/pets/<pet-id>. Actual availability still depends on your Codex Desktop version.",
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
        "网站代码与宠物素材采用不同授权。重新使用前请查看 GitHub 仓库中的 LICENSE 与 ASSET-LICENSE.md。",
        "The site code and pet artwork use different terms. Review LICENSE and ASSET-LICENSE.md in the GitHub repository before reuse.",
      ),
    },
  ];

  return (
    <PageShell language={language} currentPath="/help">
      <main className={styles.mainContent} id="main-content">
        <section className={`${styles.pageIntro} ${styles.pageIntroYellow}`}>
          <div>
            <p className={styles.eyebrow}>HELP / ONE-MINUTE CHECKLIST</p>
            <h1>{t(language, "先别重装，通常只是差一层目录。", "DON'T REINSTALL YET. IT'S USUALLY ONE FOLDER DEEP.")}</h1>
          </div>
          <p>
            {t(
              language,
              "从文件位置、重启方式到格式说明，答案都放在这里。先做最短的检查，再决定下一步。",
              "File location, restart steps, and format details live here. Run the shortest checks first, then decide what to do next.",
            )}
          </p>
        </section>

        <section className={styles.quickCheck} aria-labelledby="quick-check-title">
          <div>
            <p className={styles.eyebrow}>CHECK THESE FIRST</p>
            <h2 id="quick-check-title">{t(language, "一分钟排查", "THE ONE-MINUTE CHECK")}</h2>
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
            <h2 id="faq-title">{t(language, "问题不藏在盔甲里", "QUESTIONS, OUT IN THE OPEN")}</h2>
            <p>{t(language, "点开问题就能看到答案，全部无需登录。", "Open any question for a direct answer. No login required.")}</p>
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

        <section className={styles.formatSection} aria-labelledby="format-title">
          <div className={styles.formatCopy}>
            <p className={styles.eyebrow}>V2 FILE CONTRACT</p>
            <h2 id="format-title">{t(language, "两个文件，结构要准确", "TWO FILES. ONE PRECISE STRUCTURE.")}</h2>
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

        <aside className={styles.repoStrip}>
          <div>
            <p className={styles.eyebrow}>SOURCE & LICENSES</p>
            <h2>{t(language, "代码、宠物数据与授权说明都在 GitHub。", "CODE, PET DATA, AND LICENSE NOTES LIVE ON GITHUB.")}</h2>
          </div>
          <a
            className={styles.darkButton}
            href="https://github.com/FrankLeLe/AI-Pet-Agents"
            target="_blank"
            rel="noreferrer"
          >
            {t(language, "打开 GitHub", "Open GitHub")}
            <ExternalLink aria-hidden="true" size={17} strokeWidth={3} />
          </a>
        </aside>
      </main>
    </PageShell>
  );
}
