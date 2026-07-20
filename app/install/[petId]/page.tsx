import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { getPetById, PETS } from "@/lib/pets";

import { InstallCommandPanel } from "../../_components/InstallCommandPanel";
import { SpritePet } from "../../_components/SpritePet";
import { normalizeLanguage, PageShell, t, withLanguage } from "../../_components/SiteChrome";
import styles from "../../_components/site-chrome.module.css";

type PetInstallPageProps = {
  params: Promise<{ petId: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

type PetAccentStyle = CSSProperties & {
  "--pet-accent": string;
  "--pet-soft": string;
};

export function generateStaticParams() {
  return PETS.map((pet) => ({ petId: pet.id }));
}

export default async function PetInstallPage({ params, searchParams }: PetInstallPageProps) {
  const [{ petId }, query] = await Promise.all([params, searchParams]);
  const pet = getPetById(petId);
  if (!pet) notFound();

  const language = normalizeLanguage(query.lang);
  const name = pet.displayName[language];
  const accentStyle: PetAccentStyle = {
    "--pet-accent": pet.accent,
    "--pet-soft": pet.softAccent,
  };

  return (
    <PageShell language={language} currentPath={`/install/${pet.id}`}>
      <main className={styles.mainContent} id="main-content">
        <nav className={styles.breadcrumbs} aria-label={t(language, "面包屑导航", "Breadcrumb")}>
          <Link href={withLanguage("/install", language)}>{t(language, "安装", "Install")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>

        <section className={styles.installHero} style={accentStyle}>
          <div className={styles.installHeroPet}>
            <SpritePet
              petId={pet.id}
              animation="waving"
              eager
              label={t(language, `${name}正在挥手`, `${name} waving`)}
              className={styles.installHeroSprite}
            />
          </div>
          <div className={styles.installHeroCopy}>
            <p className={styles.eyebrow}>{pet.badge} / INSTALL</p>
            <h1>{t(language, `把 ${name} 带回 Codex`, `BRING ${name.toUpperCase()} TO CODEX`)}</h1>
            <p>{pet.tagline[language]}</p>
            <a className={styles.primaryButton} href={pet.downloadPath} download>
              {t(language, "第 1 步：下载宠物 ZIP", "STEP 1: DOWNLOAD PET ZIP")}
            </a>
          </div>
        </section>

        <section className={styles.installWorkspace} aria-labelledby="command-title">
          <div className={styles.installInstructions}>
            <p className={styles.eyebrow}>STEP 02 / 03</p>
            <h2 id="command-title">{t(language, "选择系统，复制并运行", "CHOOSE YOUR SYSTEM, COPY, AND RUN")}</h2>
            <p>
              {t(
                language,
                "命令会创建 Codex 宠物目录，并把刚下载的 ZIP 解压进去。它不会上传文件，也不会更改其他项目。",
                "The command creates your Codex pets folder and extracts the ZIP you just downloaded. It does not upload files or change other projects.",
              )}
            </p>
            <div className={styles.fileContract}>
              <span>{t(language, "完成后的目录", "FINAL FOLDER")}</span>
              <code>{`.codex/pets/${pet.id}/\n├─ pet.json\n└─ spritesheet.webp`}</code>
            </div>
            <div className={styles.inlineLinks}>
              <Link href={withLanguage(`/pets/${pet.id}`, language)}>
                {t(language, "返回角色详情", "Back to pet details")}
                <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
              </Link>
              <a href={pet.manifestPath} target="_blank" rel="noreferrer">
                {t(language, "查看 manifest", "View manifest")}
                <ExternalLink aria-hidden="true" size={16} strokeWidth={3} />
              </a>
            </div>
          </div>
          <InstallCommandPanel language={language} mode="pet" petId={pet.id} />
        </section>

        <section className={styles.finishCard}>
          <span>03</span>
          <div>
            <p className={styles.eyebrow}>ONE LAST THING</p>
            <h2>{t(language, "完整退出，再重新打开 Codex。", "FULLY QUIT, THEN REOPEN CODEX.")}</h2>
            <p>
              {t(
                language,
                "不是只关掉窗口。重新启动后，在宠物选择中找到它；如果仍未出现，帮助页有一分钟排查清单。",
                "Do more than close the window. After reopening, find it in the pet picker. If it is still missing, the help page has a one-minute checklist.",
              )}
            </p>
          </div>
          <Link className={styles.secondaryButton} href={withLanguage("/help", language)}>
            {t(language, "需要帮助", "Get help")}
          </Link>
        </section>
      </main>
    </PageShell>
  );
}
