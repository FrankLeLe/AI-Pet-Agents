import Link from "next/link";

import { InstallCommandPanel } from "../_components/InstallCommandPanel";
import { normalizeLanguage, PageShell, t, withLanguage } from "../_components/SiteChrome";
import styles from "../_components/site-chrome.module.css";

type HatchPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function HatchPage({ searchParams }: HatchPageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);

  return (
    <PageShell language={language} currentPath="/hatch">
      <main className={styles.mainContent} id="main-content">
        <section className={styles.hatchHero}>
          <div className={styles.hatchHeroCopy}>
            <p className={styles.eyebrow}>HATCH PET / CODEX SKILL</p>
            <h1>{t(language, "给一张角色图，做成会动的 Codex 宠物。", "TURN A CHARACTER IMAGE INTO A MOVING CODEX PET.")}</h1>
            <p>
              {t(
                language,
                "Hatch Pet Skill 会引导 Codex 理解角色、制作动作、检查结果并打包。你只需要提供参考图和清楚的角色设定。",
                "Hatch Pet Skill guides Codex through character analysis, motion creation, checks, and packaging. You provide a reference image and a clear character brief.",
              )}
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="/downloads/hatch-pet.zip" download>
                {t(language, "下载 Hatch Pet Skill", "Download Hatch Pet Skill")}
              </a>
              <Link className={styles.secondaryButton} href={withLanguage("/help", language)}>
                {t(language, "先了解格式", "Learn the format")}
              </Link>
            </div>
          </div>
          <div className={styles.hatchPromise}>
            <span>01</span>
            <strong>{t(language, "一张清楚的参考图", "ONE CLEAR REFERENCE")}</strong>
            <span>＋</span>
            <strong>{t(language, "一句有性格的描述", "ONE SPECIFIC PERSONALITY")}</strong>
            <span>＝</span>
            <strong>{t(language, "一只属于你的桌面搭子", "YOUR OWN DESK COMPANION")}</strong>
          </div>
        </section>

        <section className={styles.hatchSteps} aria-labelledby="hatch-flow-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>FROM IDEA TO PET</p>
              <h2 id="hatch-flow-title">{t(language, "你只需要做三件事", "THREE THINGS FROM YOU")}</h2>
            </div>
            <p>
              {t(
                language,
                "轮廓清楚的参考图和具体的动作设定，会直接影响最终效果。",
                "A clear silhouette and specific motion notes directly improve the final result.",
              )}
            </p>
          </div>
          <div className={styles.processGrid}>
            <article>
              <span>01</span>
              <h3>{t(language, "准备参考", "Prepare a reference")}</h3>
              <p>{t(language, "优先使用正面、轮廓清楚、没有复杂背景的角色图。", "Use a front-facing character with a clear silhouette and a simple background.")}</p>
            </article>
            <article>
              <span>02</span>
              <h3>{t(language, "说出性格", "Describe the personality")}</h3>
              <p>{t(language, "说明角色的动作节奏、姿态和最重要的识别特征。", "Describe the motion rhythm, posture, and most important identifying features.")}</p>
            </article>
            <article>
              <span>03</span>
              <h3>{t(language, "确认效果", "Review the result")}</h3>
              <p>{t(language, "检查动作、透明边缘和角色轮廓，再安装最终 ZIP。", "Check the motion, transparent edges, and silhouette before installing the final ZIP.")}</p>
            </article>
          </div>
        </section>

        <section className={styles.hatchInstall} aria-labelledby="hatch-install-title">
          <div className={styles.hatchInstallCopy}>
            <p className={styles.eyebrow}>INSTALL THE SKILL</p>
            <h2 id="hatch-install-title">{t(language, "先把孵化能力装进 Codex", "FIRST, ADD HATCHING TO CODEX")}</h2>
            <p>
              {t(
                language,
                "下载 Skill ZIP 后选择系统、复制命令。完成后重启 Codex，再把参考图和提示词交给它。",
                "Download the Skill ZIP, choose your system, and copy the command. Restart Codex, then provide your reference and prompt.",
              )}
            </p>
            <blockquote>
              {t(
                language,
                "使用 $hatch-pet，根据这张角色参考图创建一个 Codex 宠物。名字叫「云朵」，待机时轻轻摇尾巴，工作时向右小跑，风格为软胶贴纸。",
                "Use $hatch-pet to turn this character reference into a Codex pet named Cloudy. Its tail sways while idle and it trots right while working, in a soft vinyl sticker style.",
              )}
            </blockquote>
          </div>
          <InstallCommandPanel language={language} mode="skill" />
        </section>

        <aside className={styles.helpStrip}>
          <div>
            <strong>{t(language, "只是想先选一只现成的？", "Prefer a ready-made companion?")}</strong>
            <p>{t(language, "从宠物图鉴挑选现成角色，先试玩动作，再选择安装方式。", "Choose a ready-made character from the pet index, try its actions, then pick an install route.")}</p>
          </div>
          <Link className={styles.darkButton} href={withLanguage("/pets", language)}>
            {t(language, "浏览现有宠物", "Browse ready-made pets")}
          </Link>
        </aside>
      </main>
    </PageShell>
  );
}
