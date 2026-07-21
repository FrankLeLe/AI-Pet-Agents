import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { InstallChoices } from "../../_components/InstallChoices";
import { InstallCommandPanel } from "../../_components/InstallCommandPanel";
import { PetPreview } from "../../_components/PetPreview";
import { normalizeLanguage, PageShell, t, withLanguage } from "../../_components/SiteChrome";
import {
  buildCodexInstallPrompt,
  getPetRelease,
  PET_RELEASE_COMMIT,
  PET_RELEASE_REPOSITORY,
} from "@/lib/pet-releases";
import { getPetById, PETS } from "@/lib/pets";
import {
  GUIDE_PET_ID,
  GUIDE_PROFILE,
  getMemberProfile,
  getProductName,
} from "@/lib/series";

import styles from "./install.module.css";

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
  const release = getPetRelease(petId);
  if (!pet || !release) notFound();

  const language = normalizeLanguage(query.lang);
  const profile = getMemberProfile(pet.id);
  const isGuide = pet.id === GUIDE_PET_ID;
  const name = getProductName(pet, language);
  const role = isGuide
    ? GUIDE_PROFILE.title[language]
    : profile?.role[language] ?? pet.displayName[language];
  const description = isGuide
    ? GUIDE_PROFILE.description[language]
    : profile?.specialty[language] ?? pet.tagline[language];
  const accentStyle: PetAccentStyle = {
    "--pet-accent": pet.accent,
    "--pet-soft": pet.softAccent,
  };
  const codexPrompt = buildCodexInstallPrompt(pet.id, name, language);
  const sizeLabel = `${(release.sizeBytes / 1_048_576).toFixed(1)} MB`;

  return (
    <PageShell language={language} currentPath={`/install/${pet.id}`}>
      <main className={styles.main} id="main-content">
        <nav className={styles.breadcrumbs} aria-label={t(language, "面包屑导航", "Breadcrumb")}>
          <Link href={withLanguage("/pets", language)}>{t(language, "宠物图鉴", "Pet index")}</Link>
          <span aria-hidden="true">/</span>
          <Link href={withLanguage("/install", language)}>{t(language, "安装中心", "Install center")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{t(language, `安装 ${name}`, `Install ${name}`)}</span>
        </nav>

        <section className={styles.hero} style={accentStyle}>
          <div className={styles.heroVisual}>
            <PetPreview
              petId={pet.id}
              eager
              label={t(language, `${name}静态预览`, `${name} preview`)}
              className={styles.heroPet}
            />
          </div>
          <div className={styles.heroCopy}>
            <span>{role}</span>
            <h1>
              <span>{t(language, "安装", "INSTALL")}</span>
              {name}
            </h1>
            <p>{description}</p>
            <div className={styles.heroActions}>
              <a href={pet.downloadPath} download>
                <Download aria-hidden="true" size={19} strokeWidth={3} />
                {t(language, "下载 ZIP", "Download ZIP")}
              </a>
              <a href="#codex-install">
                {t(language, "让 Codex 安装", "Let Codex install")}
                <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
              </a>
            </div>
          </div>
        </section>

        <div className={styles.installRoutes} id="install-routes">
          <InstallChoices
            language={language}
            petId={pet.id}
            petName={name}
            downloadPath={pet.downloadPath}
            codexPrompt={codexPrompt}
            sha256={release.sha256}
            sizeLabel={sizeLabel}
          />
        </div>

        <details className={styles.advancedInstall}>
          <summary>{t(language, "命令行安装（高级）", "Command-line install (advanced)")}</summary>
          <div className={styles.advancedIntro}>
            <p>
              {t(
                language,
                "命令会在目标目录已存在时停止，不会静默覆盖。运行前确认 ZIP 在 Downloads 文件夹。",
                "The command stops if the target folder already exists and never overwrites silently. Confirm the ZIP is in Downloads before running it.",
              )}
            </p>
          </div>
          <InstallCommandPanel language={language} mode="pet" petId={pet.id} />
        </details>

        <aside className={styles.trustStrip}>
          <div>
            <strong>{t(language, "安装包可以核对", "The package is verifiable")}</strong>
            <p>
              {t(
                language,
                `来源固定在 GitHub 提交 ${PET_RELEASE_COMMIT.slice(0, 8)}，页面同时提供完整 SHA-256。`,
                `The source is pinned to GitHub commit ${PET_RELEASE_COMMIT.slice(0, 8)}, with a full SHA-256 supplied on this page.`,
              )}
            </p>
          </div>
          <a href={`${PET_RELEASE_REPOSITORY}/tree/${PET_RELEASE_COMMIT}`} target="_blank" rel="noreferrer">
            {t(language, "查看固定版本", "View pinned source")}
          </a>
          <Link href={withLanguage("/help", language)}>
            {t(language, "宠物没有出现？", "Pet not showing?")}
          </Link>
          <Link href={withLanguage(`/pets/${pet.id}`, language)}>
            {t(language, "返回角色页", "Back to character")}
          </Link>
        </aside>
      </main>
    </PageShell>
  );
}
