import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { InstallChoices } from "../../_components/InstallChoices";
import { InstallCommandPanel } from "../../_components/InstallCommandPanel";
import { PetPreview } from "../../_components/PetPreview";
import { normalizeLanguage, PageShell, t, withLanguage } from "../../_components/SiteChrome";
import {
  buildCodexInstallPrompt,
  getPetPackageUrl,
  getPetRelease,
  PET_RELEASE_COMMIT,
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
              <span>{t(language, "带回 CODEX", "ADD TO CODEX")}</span>
              {name}
            </h1>
            <p>{description}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#codex-install">
                <span>{t(language, "复制给 Codex", "Copy for Codex")}</span>
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
            sourceCommit={PET_RELEASE_COMMIT}
            sourceUrl={getPetPackageUrl(pet.id)}
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
            <strong>{t(language, "没看到它？", "Can’t find it?")}</strong>
            <p>
              {t(
                language,
                "完整退出并重新打开 Codex Desktop，再检查宠物选择器。",
                "Fully quit and reopen Codex Desktop, then check the pet selector.",
              )}
            </p>
          </div>
          <Link href={withLanguage("/help", language)}>
            {t(language, "查看排查方法", "Troubleshoot")}
          </Link>
          <Link href={withLanguage(`/pets/${pet.id}`, language)}>
            {t(language, "返回角色页", "Back to character")}
          </Link>
        </aside>
      </main>
    </PageShell>
  );
}
