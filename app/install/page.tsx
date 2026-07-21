import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PETS } from "@/lib/pets";
import { GUIDE_PET_ID, GUIDE_PROFILE, getMemberProfile, getProductName } from "@/lib/series";

import { PetPreview } from "../_components/PetPreview";
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
            <h1>{t(language, "选好角色，再选安装方式。", "PICK A CHARACTER, THEN AN INSTALL ROUTE.")}</h1>
          </div>
          <p>
            {t(
              language,
              "每个角色都提供两条路径：下载 ZIP 自己安装，或复制一段安全请求让 Codex 协助安装。",
              "Every character offers two routes: download the ZIP yourself, or copy a safe request for Codex to install it.",
            )}
          </p>
        </section>

        <section className={styles.stepsSection} aria-labelledby="install-steps-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>HOW IT WORKS</p>
              <h2 id="install-steps-title">{t(language, "安装流程", "INSTALL FLOW")}</h2>
            </div>
          </div>
          <ol className={styles.stepGrid}>
            <li>
              <strong>01</strong>
              <div>
                <h3>{t(language, "选择宠物", "Choose a pet")}</h3>
                <p>{t(language, "先从图鉴中进入角色安装页。", "Open a character install page from the index.")}</p>
              </div>
            </li>
            <li>
              <strong>02</strong>
              <div>
                <h3>{t(language, "选择方式", "Choose a route")}</h3>
                <p>{t(language, "下载 ZIP，或复制给 Codex。", "Download the ZIP, or copy a request for Codex.")}</p>
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
              <p className={styles.eyebrow}>CHOOSE A CHARACTER</p>
              <h2 id="choose-install-pet">{t(language, "从角色开始", "START WITH A CHARACTER")}</h2>
            </div>
            <p>
              {t(
                language,
                "安装页会带入对应下载包、校验值和目标目录。",
                "Each install page includes the matching package, checksum, and target folder.",
              )}
            </p>
          </div>
          <div className={styles.installPetGrid}>
            {PETS.map((pet) => {
              const profile = getMemberProfile(pet.id);
              const isGuide = pet.id === GUIDE_PET_ID;
              const name = getProductName(pet, language);
              const label = isGuide ? GUIDE_PROFILE.role[language] : profile?.role[language] ?? pet.badge;

              return (
              <Link
                className={styles.installPetCard}
                href={withLanguage(`/install/${pet.id}`, language)}
                prefetch={false}
                style={{ "--pet-accent": pet.accent, "--pet-soft": pet.softAccent } as React.CSSProperties}
                key={pet.id}
              >
                <PetPreview
                  petId={pet.id}
                  label={t(
                    language,
                    `${name}静态预览`,
                    `${name} preview`,
                  )}
                  className={styles.installPetSprite}
                />
                <span>
                  <small>{label}</small>
                  <strong>{name}</strong>
                  <em>
                    {t(language, "打开安装页", "Open install guide")}
                    <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
                  </em>
                </span>
              </Link>
              );
            })}
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
