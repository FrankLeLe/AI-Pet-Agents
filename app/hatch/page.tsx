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
            <h1>{t(language, "把喜欢的角色，孵成会陪你工作的宠物。", "TURN A CHARACTER YOU LOVE INTO A WORKING COMPANION.")}</h1>
            <p>
              {t(
                language,
                "Hatch Pet 会带 Codex 走完整套流程：理解角色、生成图集、检查动作、修复问题，再打包成 v2 宠物。你负责描述想要的感觉。",
                "Hatch Pet guides Codex through the whole process: understand the character, make the atlas, inspect motion, repair issues, and package a v2 pet. You describe the feeling you want.",
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
                "这不是“随便丢张图就一定成功”。参考越清楚，性格越具体，最后的宠物越像你心里的那一只。",
                "This is not a one-click promise for any image. Clearer references and a more specific personality make the result feel more like yours.",
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
              <p>{t(language, "别只说“可爱”。告诉它安静、勇敢、黏人，还是有点嘴硬。", "Go beyond “cute.” Say whether it is quiet, brave, clingy, or secretly soft-hearted.")}</p>
            </article>
            <article>
              <span>03</span>
              <h3>{t(language, "让 QA 跑完", "Let QA finish")}</h3>
              <p>{t(language, "等待动作、透明边缘和打包检查完成，再安装最终 ZIP。", "Wait for motion, transparency, and packaging checks before installing the final ZIP.")}</p>
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
                "使用 $hatch-pet，根据这张角色参考图创建一个 Codex v2 宠物。名字叫「云朵」，性格安静但很黏人，风格为软胶贴纸。",
                "Use $hatch-pet to turn this character reference into a Codex v2 pet named Cloudy. Quiet but affectionate, in a soft vinyl sticker style.",
              )}
            </blockquote>
          </div>
          <InstallCommandPanel language={language} mode="skill" />
        </section>

        <aside className={styles.helpStrip}>
          <div>
            <strong>{t(language, "只是想先选一只现成的？", "Prefer a ready-made companion?")}</strong>
            <p>{t(language, "四只宠物已经完成动画 QA，可以直接预览和安装。", "Four pets have already passed animation QA and are ready to preview and install.")}</p>
          </div>
          <Link className={styles.darkButton} href={withLanguage("/pets", language)}>
            {t(language, "浏览现有宠物", "Browse ready-made pets")}
          </Link>
        </aside>
      </main>
    </PageShell>
  );
}
