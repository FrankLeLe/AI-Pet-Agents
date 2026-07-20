import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ANIMATIONS } from "@/lib/pet-animation";
import type { AnimationKey } from "@/lib/pet-animation";
import { getPetById, PETS } from "@/lib/pets";

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
  const name = pet.displayName[language];
  const description = `${pet.tagline[language]} ${t(language, pet.editorial.matchZh, pet.editorial.matchEn)}`;

  return {
    title: t(language, `${name}｜Codex Pets 角色专栏`, `${name} | Codex Pets character story`),
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
  const name = pet.displayName[language];
  const editorial = pet.editorial;
  const relatedPets = PETS.filter((item) => item.id !== pet.id)
    .sort((left, right) => {
      const rightScore = right.needs.filter((need) => pet.needs.includes(need)).length;
      const leftScore = left.needs.filter((need) => pet.needs.includes(need)).length;
      return rightScore - leftScore;
    })
    .slice(0, 3);
  const accentStyle: PetAccentStyle = {
    "--pet-accent": pet.accent,
    "--pet-soft": pet.softAccent,
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description: pet.tagline[language],
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

        <nav className={styles.breadcrumbs} aria-label={t(language, "面包屑导航", "Breadcrumb")}>
          <Link href={withLanguage("/pets", language)}>{t(language, "全部宠物", "All pets")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>

        <section className={styles.petDetailHero} style={accentStyle}>
          <div className={styles.petDetailCopy}>
            <p className={styles.eyebrow}>{pet.badge} / ASTER DOCK ARCHIVE</p>
            <h1>{name}</h1>
            <p className={styles.petRole}>
              {t(language, editorial.zodiacZh, editorial.zodiacEn)} · {t(language, editorial.roleZh, editorial.roleEn)}
            </p>
            <p className={styles.petTagline}>{t(language, editorial.promiseZh, editorial.promiseEn)}</p>
            <p className={styles.petDescription}>{t(language, editorial.comfortZh, editorial.comfortEn)}</p>
            <ul className={styles.tagList} aria-label={t(language, "性格标签", "Personality tags")}>
              {pet.personalityTags.map((tag) => (
                <li key={tag.en}>{tag[language]}</li>
              ))}
            </ul>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href={withLanguage(`/install/${pet.id}`, language)}>
                {t(language, "免费带它回 Codex", "Bring it to Codex for free")}
              </Link>
              <a className={styles.secondaryButton} href={pet.downloadPath} download>
                {t(language, "直接下载 ZIP", "Download ZIP")}
              </a>
            </div>
            <p className={styles.microcopy}>
              {t(language, "无需账号 · 免费下载 · v2 格式 · 本地安装", "No account · Free download · v2 format · Local install")}
            </p>
          </div>
          <div className={styles.petPortrait}>
            <span>{t(language, "你的桌面搭子", "YOUR DESK COMPANION")}</span>
            <PetPreview
              petId={pet.id}
              eager
              label={t(language, `${name}静态预览`, `${name} preview`)}
              className={styles.detailSprite}
            />
            <strong>{pet.id}</strong>
          </div>
        </section>

        <section className={styles.storyFeature} aria-labelledby="story-heading" style={accentStyle}>
          <article className={styles.storyNarrative}>
            <p className={styles.eyebrow}>ASTER DOCK / CHARACTER STORY</p>
            <h2 id="story-heading">
              {t(language, editorial.storyTitleZh, editorial.storyTitleEn)}
            </h2>
            <p>{t(language, editorial.storyZh, editorial.storyEn)}</p>
          </article>
          <aside className={styles.storyDossier} aria-label={t(language, "角色档案", "Character dossier")}>
            <div>
              <span>{t(language, "守护身份", "ROLE")}</span>
              <strong>{t(language, editorial.roleZh, editorial.roleEn)}</strong>
            </div>
            <div>
              <span>{t(language, "它想告诉你", "A NOTE FOR YOU")}</span>
              <strong>{t(language, editorial.comfortZh, editorial.comfortEn)}</strong>
            </div>
            <div>
              <span>{t(language, "适合这样的你", "A GOOD MATCH IF")}</span>
              <strong>{t(language, editorial.matchZh, editorial.matchEn)}</strong>
            </div>
          </aside>
        </section>

        <PetPlayground
          language={language}
          petId={pet.id}
          petName={name}
          initialAnimation={initialAnimation}
        />

        <section className={styles.emotionGrid} aria-label={t(language, "三个陪伴时刻", "Three companion moments")}>
          {editorial.moments.map((moment, index) => (
            <article key={moment.titleEn}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{t(language, moment.titleZh, moment.titleEn)}</h2>
              <p>{t(language, moment.bodyZh, moment.bodyEn)}</p>
            </article>
          ))}
        </section>

        <section className={styles.contentSection} aria-labelledby="more-pets-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>SAME NEED, DIFFERENT COMPANY</p>
              <h2 id="more-pets-heading">{t(language, "也看看懂你此刻的它们", "MEET ANOTHER KIND OF SUPPORT")}</h2>
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
