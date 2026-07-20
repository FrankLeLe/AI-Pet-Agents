import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PETS } from "@/lib/pets";

import { SpritePet } from "../_components/SpritePet";
import { normalizeLanguage, PageShell, t, withLanguage } from "../_components/SiteChrome";
import styles from "../_components/site-chrome.module.css";

type InstallIndexPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function InstallIndexPage({ searchParams }: InstallIndexPageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);

  return (
    <PageShell language={language} currentPath="/install">
      <main className={styles.mainContent} id="main-content">
        <section className={`${styles.pageIntro} ${styles.pageIntroBlue}`}>
          <div>
            <p className={styles.eyebrow}>INSTALL / NO ACCOUNT REQUIRED</p>
            <h1>{t(language, "三步，让桌面有个伴。", "THREE STEPS TO A LESS LONELY DESKTOP.")}</h1>
          </div>
          <p>
            {t(
              language,
              "先选宠物，再按你的系统复制命令。文件只会进入本机的 Codex 宠物目录，不需要注册或上传资料。",
              "Choose a pet, then copy the command for your system. Files stay in your local Codex pets folder—no signup or upload required.",
            )}
          </p>
        </section>

        <section className={styles.stepsSection} aria-labelledby="install-steps-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>HOW IT WORKS</p>
              <h2 id="install-steps-title">{t(language, "过程很短，也很透明", "SHORT, LOCAL, AND EASY TO CHECK")}</h2>
            </div>
          </div>
          <ol className={styles.stepGrid}>
            <li>
              <strong>01</strong>
              <div>
                <h3>{t(language, "选择宠物", "Choose a pet")}</h3>
                <p>{t(language, "进入专属安装页并下载 ZIP。", "Open its install page and download the ZIP.")}</p>
              </div>
            </li>
            <li>
              <strong>02</strong>
              <div>
                <h3>{t(language, "复制命令", "Copy the command")}</h3>
                <p>{t(language, "选择 Windows、macOS 或 Linux。", "Choose Windows, macOS, or Linux.")}</p>
              </div>
            </li>
            <li>
              <strong>03</strong>
              <div>
                <h3>{t(language, "重启 Codex", "Restart Codex")}</h3>
                <p>{t(language, "完整退出，再重新打开并选择宠物。", "Fully quit, reopen, and choose your pet.")}</p>
              </div>
            </li>
          </ol>
        </section>

        <section className={styles.contentSection} aria-labelledby="choose-install-pet">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>CHOOSE YOUR DOWNLOAD</p>
              <h2 id="choose-install-pet">{t(language, "选好搭子，开始安装", "PICK YOUR COMPANION TO BEGIN")}</h2>
            </div>
            <p>
              {t(
                language,
                "每个安装页都已经带入正确的宠物 ID，复制命令前不用手动修改。",
                "Each install page already includes the correct pet ID, so there is nothing to edit before copying.",
              )}
            </p>
          </div>
          <div className={styles.installPetGrid}>
            {PETS.map((pet) => (
              <Link
                className={styles.installPetCard}
                href={withLanguage(`/install/${pet.id}`, language)}
                style={{ "--pet-accent": pet.accent, "--pet-soft": pet.softAccent } as React.CSSProperties}
                key={pet.id}
              >
                <SpritePet
                  petId={pet.id}
                  animation="idle"
                  label={t(
                    language,
                    `${pet.displayName.zh}待机动画`,
                    `${pet.displayName.en} idle animation`,
                  )}
                  className={styles.installPetSprite}
                />
                <span>
                  <small>{pet.badge}</small>
                  <strong>{pet.displayName[language]}</strong>
                  <em>
                    {t(language, "打开安装页", "Open install guide")}
                    <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
                  </em>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className={styles.helpStrip}>
          <div>
            <strong>{t(language, "已经下载，但没出现？", "Downloaded it, but nothing appeared?")}</strong>
            <p>{t(language, "先别重装。检查目录层级和重启方式，通常一分钟能解决。", "Before reinstalling, check the folder depth and restart steps. It usually takes a minute.")}</p>
          </div>
          <Link className={styles.darkButton} href={withLanguage("/help", language)}>
            {t(language, "查看排查方法", "Troubleshoot")}
          </Link>
        </aside>
      </main>
    </PageShell>
  );
}
