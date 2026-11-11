import type { Metadata } from "next";
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
  getPetRelease,
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

export async function generateMetadata({ params, searchParams }: PetInstallPageProps): Promise<Metadata> {
  const [{ petId }, query] = await Promise.all([params, searchParams]);
  const pet = getPetById(petId);
  if (!pet || !getPetRelease(petId)) return {};

  const language = normalizeLanguage(query.lang);
  const name = getProductName(pet, language);
  const title = t(language, `安装 ${name}｜Codex Pets`, `Install ${name} | Codex Pets`);
  const description = t(
    language,
    `把「${name}」带回 Codex。复制请求，让 Codex 帮你安装，也可以下载宠物文件手动安装。`,
    `Bring ${name} into Codex. Copy a request for Codex to help you install, or download the pet files and install manually.`,
  );
  const path = `/install/${pet.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: withLanguage(path, language),
      languages: {
        "zh-CN": withLanguage(path, "zh"),
        en: withLanguage(path, "en"),
      },
    },
    openGraph: {
      title,
      description,
      url: withLanguage(path, language),
      locale: language === "en" ? "en_US" : "zh_CN",
      alternateLocale: [language === "en" ? "zh_CN" : "en_US"],
      images: [{ url: "/og-series.png", width: 1672, height: 941, alt: "Codex Pets desktop companions" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-series.png"],
    },
  };
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
        <nav className={styles.breadcrumbs} aria-label={t(language, "当前位置", "You are here")}>
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
              label={name}
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
            sizeLabel={sizeLabel}
          />
        </div>

        <details className={styles.advancedInstall}>
          <summary>{t(language, "命令行安装（高级）", "Command-line install (advanced)")}</summary>
          <div className={styles.advancedIntro}>
            <p>
              {t(
                language,
                "请先把下载的宠物文件放进“下载”（Downloads）文件夹。如果同名文件夹已经存在，命令会停止并保留现有文件。",
                "First, put the downloaded pet file in your Downloads folder. If a folder with the same name already exists, the command stops and keeps your existing files.",
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
                "完整退出并重新打开 Codex Desktop，再打开宠物列表看看。",
                "Fully quit and reopen Codex Desktop, then check the pet list.",
              )}
            </p>
          </div>
          <Link href={withLanguage("/help", language)}>
            {t(language, "获取帮助", "Get help")}
          </Link>
          <Link href={withLanguage(`/pets/${pet.id}`, language)}>
            {t(language, "返回角色页", "Back to character")}
          </Link>
        </aside>
      </main>
    </PageShell>
  );
}
