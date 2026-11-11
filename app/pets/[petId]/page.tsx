import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ANIMATIONS } from "@/lib/pet-animation";
import type { AnimationKey } from "@/lib/pet-animation";
import { getPetById, PETS } from "@/lib/pets";
import {
  GUIDE_PET_ID,
  GUIDE_PROFILE,
  getMemberProfile,
  getProductName,
  getSeriesForPet,
} from "@/lib/series";

import { PetCard } from "../../_components/PetCard";
import { PetPlayground } from "../../_components/PetPlayground";
import { PetPreview } from "../../_components/PetPreview";
import { normalizeLanguage, PageShell, t, withLanguage } from "../../_components/SiteChrome";
import styles from "../../_components/site-chrome.module.css";

type PetDetailPageProps = {
  params: Promise<{ petId: string }>;
  searchParams: Promise<{ lang?: string | string[]; state?: string | string[] }>;
};

type PetAccentStyle = CSSProperties & {
  "--pet-accent": string;
  "--pet-soft": string;
};

export function generateStaticParams() {
  return PETS.map((pet) => ({ petId: pet.id }));
}

export async function generateMetadata({ params, searchParams }: PetDetailPageProps): Promise<Metadata> {
  const [{ petId }, query] = await Promise.all([params, searchParams]);
  const pet = getPetById(petId);
  if (!pet) return {};

  const language = normalizeLanguage(query.lang);
  const profile = getMemberProfile(pet.id);
  const isGuide = pet.id === GUIDE_PET_ID;
  const name = getProductName(pet, language);
  const description = isGuide
    ? GUIDE_PROFILE.description[language]
    : profile?.specialty[language] ?? pet.tagline[language];

  return {
    title: t(language, `${name}｜Codex Pets 角色页`, `${name} | Codex Pets character`),
    description,
    alternates: {
      canonical: withLanguage(`/pets/${pet.id}`, language),
      languages: {
        "zh-CN": withLanguage(`/pets/${pet.id}`, "zh"),
        en: withLanguage(`/pets/${pet.id}`, "en"),
      },
    },
    openGraph: {
      title: `${name}｜Codex Pets`,
      description,
      url: withLanguage(`/pets/${pet.id}`, language),
    },
  };
}

export default async function PetDetailPage({ params, searchParams }: PetDetailPageProps) {
  const [{ petId }, query] = await Promise.all([params, searchParams]);
  const pet = getPetById(petId);
  if (!pet) notFound();

  const language = normalizeLanguage(query.lang);
  const requestedState = Array.isArray(query.state) ? query.state[0] : query.state;
  const initialAnimation = ANIMATIONS.some((item) => item.key === requestedState)
    ? (requestedState as AnimationKey)
    : "idle";
  const profile = getMemberProfile(pet.id);
  const series = getSeriesForPet(pet.id);
  const isGuide = pet.id === GUIDE_PET_ID;
  const name = getProductName(pet, language);
  const role = isGuide
    ? GUIDE_PROFILE.title[language]
    : profile?.role[language] ?? pet.editorial.roleZh;
  const identity = isGuide
    ? GUIDE_PROFILE.role[language]
    : profile?.zodiac[language] ?? pet.displayName[language];
  const specialty = isGuide
    ? GUIDE_PROFILE.description[language]
    : profile?.specialty[language] ?? pet.tagline[language];
  const storyTitle = isGuide
    ? GUIDE_PROFILE.storyTitle[language]
    : profile?.name[language] ?? pet.editorial.storyTitleZh;
  const story = isGuide
    ? GUIDE_PROFILE.story[language]
    : profile?.vignette[language] ?? pet.description[language];
  const relatedPets = series
    ? series.members
        .filter((member) => member.petId !== pet.id)
        .slice(0, 3)
        .flatMap((member) => {
          const related = getPetById(member.petId);
          return related ? [related] : [];
        })
    : PETS.filter((item) => item.id !== pet.id && item.category === "zodiac-duck").slice(0, 3);
  const accentStyle: PetAccentStyle = {
    "--pet-accent": pet.accent,
    "--pet-soft": pet.softAccent,
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description: specialty,
    applicationCategory: "DesktopEnhancementApplication",
    operatingSystem: "Windows, macOS, Linux",
    url: `https://aipetsagent.com${withLanguage(`/pets/${pet.id}`, language)}`,
    image: `https://aipetsagent.com${pet.previewPath}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <PageShell language={language} currentPath={`/pets/${pet.id}`}>
      <main className={styles.mainContent} id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
        />

        <nav className={styles.breadcrumbs} aria-label={t(language, "当前位置", "You are here")}>
          <Link href={withLanguage("/pets", language)}>{t(language, "宠物图鉴", "Pet index")}</Link>
          {series ? (
            <>
              <span aria-hidden="true">/</span>
              <Link href={withLanguage(`/series/${series.id}`, language)}>{series.name[language]}</Link>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>

        <section className={styles.petDetailHero} style={accentStyle}>
          <div className={styles.petDetailCopy}>
            <p className={styles.eyebrow}>{identity}</p>
            <h1>{name}</h1>
            <p className={styles.petRole}>{role}</p>
            <p className={styles.petTagline}>{specialty}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#playground">
                {t(language, "先玩一下", "Try it now")}
              </a>
              <Link
                className={styles.secondaryButton}
                href={`${withLanguage(`/install/${pet.id}`, language)}#codex-install`}
              >
                {t(language, "带回 Codex", "Bring to Codex")}
              </Link>
            </div>
          </div>
          <div className={styles.petPortrait}>
            <span>{role}</span>
            <PetPreview
              petId={pet.id}
              eager
              label={t(language, `${name}形象`, `${name} preview`)}
              className={styles.detailSprite}
            />
            <strong>{identity}</strong>
          </div>
        </section>

        <section className={styles.storyFeature} aria-labelledby="story-heading" style={accentStyle}>
          <article className={styles.storyNarrative}>
            <p className={styles.eyebrow}>{t(language, "它的小故事", "A little story")}</p>
            <h2 id="story-heading">{storyTitle}</h2>
            <p>{story}</p>
          </article>
          <aside className={styles.storyDossier} aria-label={t(language, "角色档案", "Character profile")}>
            <div>
              <span>{t(language, "它是谁", "Meet your companion")}</span>
              <strong>{role}</strong>
            </div>
            <div>
              <span>{t(language, "擅长", "SPECIALTY")}</span>
              <strong>{specialty}</strong>
            </div>
            {series ? (
              <div>
                <span>{t(language, "所属系列", "SERIES")}</span>
                <strong>{series.name[language]}</strong>
              </div>
            ) : null}
          </aside>
        </section>

        <div id="playground">
          <PetPlayground
            language={language}
            petId={pet.id}
            petName={name}
            initialAnimation={initialAnimation}
          />
        </div>

        <section className={styles.contentSection} aria-labelledby="more-pets-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>
                {series ? t(language, "它的朋友们", "Meet its friends") : t(language, "还有这些伙伴", "More to meet")}
              </p>
              <h2 id="more-pets-heading" data-copy-role="card-headline">
                {series
                  ? t(language, "同系列伙伴", "MORE COMPANIONS")
                  : t(language, "继续探索", "KEEP EXPLORING")}
              </h2>
            </div>
          </div>
          <div className={styles.petGridThree}>
            {relatedPets.map((relatedPet) => (
              <PetCard compact pet={relatedPet} language={language} key={relatedPet.id} />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
