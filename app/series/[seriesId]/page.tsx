import type { Metadata } from "next";
import { ArrowRight, BookOpenText, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { normalizeLanguage, PageShell, t, withLanguage } from "@/app/_components/SiteChrome";
import { PetPreview } from "@/app/_components/PetPreview";
import { PET_SERIES, getSeriesById, getSeriesPets } from "@/lib/series";

import styles from "./series.module.css";

type SeriesPageProps = {
  params: Promise<{ seriesId: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

type MemberStyle = CSSProperties & {
  "--member-accent": string;
  "--member-soft": string;
};

export function generateStaticParams() {
  return PET_SERIES.map((series) => ({ seriesId: series.id }));
}

export async function generateMetadata({ params, searchParams }: SeriesPageProps): Promise<Metadata> {
  const [{ seriesId }, query] = await Promise.all([params, searchParams]);
  const series = getSeriesById(seriesId);
  if (!series) return {};

  const language = normalizeLanguage(query.lang);
  const title = `${series.name[language]}｜Codex Pets`;
  const description = `${series.subtitle[language]}。${series.description[language]}`;

  return {
    title,
    description,
    alternates: {
      canonical: withLanguage(`/series/${series.id}`, language),
      languages: {
        "zh-CN": withLanguage(`/series/${series.id}`, "zh"),
        en: withLanguage(`/series/${series.id}`, "en"),
      },
    },
  };
}

export default async function SeriesPage({ params, searchParams }: SeriesPageProps) {
  const [{ seriesId }, query] = await Promise.all([params, searchParams]);
  const series = getSeriesById(seriesId);
  if (!series) notFound();

  const language = normalizeLanguage(query.lang);
  const members = getSeriesPets(series);

  return (
    <PageShell language={language} currentPath={`/series/${series.id}`}>
      <main className={styles.main} id="main-content">
        <nav className={styles.breadcrumbs} aria-label={t(language, "面包屑导航", "Breadcrumb")}>
          <Link href={withLanguage("/pets", language)}>{t(language, "宠物图鉴", "Pet index")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{series.name[language]}</span>
        </nav>

        <section className={styles.hero} aria-labelledby="series-heading">
          <div className={styles.heroCopy}>
            <span className={styles.status}>{series.status[language]}</span>
            <p>{series.subtitle[language]}</p>
            <h1 id="series-heading">{series.name[language]}</h1>
            <strong>{series.description[language]}</strong>
            <div className={styles.heroActions}>
              <a href="#characters">
                {t(language, "查看角色", "Meet the characters")}
                <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
              </a>
              <a href="#story">{t(language, "读系列故事", "Read the series story")}</a>
            </div>
          </div>
          <div className={styles.heroPets} aria-label={t(language, "系列角色", "Series characters")}>
            {members.slice(0, 4).map(({ pet, profile }, index) => (
              <Link
                href={withLanguage(`/pets/${pet.id}`, language)}
                style={{ "--member-order": index } as CSSProperties}
                key={pet.id}
              >
                <PetPreview
                  petId={pet.id}
                  eager
                  className={styles.heroPet}
                  label={t(language, `${profile.name.zh}静态预览`, `${profile.name.en} preview`)}
                />
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.characters} id="characters" aria-labelledby="characters-heading">
          <header className={styles.sectionHeading}>
            <div>
              <span>CHARACTER INDEX</span>
              <h2 id="characters-heading">{t(language, "每位角色，各守一段星轨", "A distinct guardian for every stretch of the route")}</h2>
            </div>
            <p>{t(language, "点进角色页，可以现场试动作，再决定是否安装。", "Open a character page to try its actions before installing.")}</p>
          </header>

          <p className={styles.scrollHint}>
            {t(language, "横向滑动查看更多角色", "Swipe sideways to see more characters")}
          </p>

          <div className={styles.characterGrid}>
            {members.map(({ pet, profile }) => (
              <article
                className={styles.characterCard}
                style={{
                  "--member-accent": pet.accent,
                  "--member-soft": pet.softAccent,
                } as MemberStyle}
                key={pet.id}
              >
                <div className={styles.characterVisual}>
                  <PetPreview
                    petId={pet.id}
                    className={styles.characterImage}
                    label={t(language, `${profile.name.zh}静态预览`, `${profile.name.en} preview`)}
                  />
                  <span>{profile.role[language]}</span>
                </div>
                <div className={styles.characterBody}>
                  <p>{profile.zodiac[language]}</p>
                  <h3>{profile.name[language]}</h3>
                  <strong>{profile.specialty[language]}</strong>
                  <p>{profile.vignette[language]}</p>
                  <div>
                    <Link href={withLanguage(`/pets/${pet.id}`, language)}>
                      {t(language, "查看角色", "View character")}
                      <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
                    </Link>
                    <Link href={withLanguage(`/install/${pet.id}`, language)}>
                      <Download aria-hidden="true" size={16} strokeWidth={3} />
                      {t(language, "安装", "Install")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.story} id="story" aria-labelledby="story-heading">
          <div className={styles.storyMarker}>
            <BookOpenText aria-hidden="true" size={30} strokeWidth={3} />
            <span>STORY</span>
          </div>
          <div>
            <p>{series.storyChapter[language]}</p>
            <h2 id="story-heading">{series.storyTitle[language]}</h2>
            <blockquote>{series.story[language]}</blockquote>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
