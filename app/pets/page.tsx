import { ArrowRight, Compass, Download } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { PetPreview } from "../_components/PetPreview";
import { normalizeLanguage, PageShell, t, withLanguage } from "../_components/SiteChrome";
import { getPetById } from "@/lib/pets";
import {
  GUIDE_PET_ID,
  GUIDE_PROFILE,
  getSeriesPets,
  PET_SERIES,
} from "@/lib/series";

import styles from "./pets.module.css";

type PetsPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

type MemberStyle = CSSProperties & {
  "--member-soft": string;
};

export default async function PetsPage({ searchParams }: PetsPageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);
  const guide = getPetById(GUIDE_PET_ID);

  return (
    <PageShell language={language} currentPath="/pets">
      <main className={styles.main} id="main-content">
        <section className={styles.intro}>
          <div>
            <span>CODEX PET INDEX</span>
            <h1>{t(language, "宠物图鉴", "PET INDEX")}</h1>
          </div>
          <p>
            {t(
              language,
              "先选系列，再看角色。每个系列有自己的世界观、角色职责与安装入口。",
              "Choose a series, then a character. Every series has its own world, roles, and install route.",
            )}
          </p>
        </section>

        {guide ? (
          <section className={styles.guideCard} aria-labelledby="guide-card-heading">
            <div className={styles.guideVisual}>
              <PetPreview
                petId={guide.id}
                eager
                className={styles.guideImage}
                label={t(language, "星铠团团静态预览", "Star-Armor Tuantuan preview")}
              />
            </div>
            <div className={styles.guideCopy}>
              <span>{GUIDE_PROFILE.role[language]}</span>
              <h2 id="guide-card-heading">{GUIDE_PROFILE.title[language]}</h2>
              <strong>{GUIDE_PROFILE.name[language]}</strong>
              <p>{GUIDE_PROFILE.description[language]}</p>
              <div>
                <Link href={withLanguage(`/pets/${guide.id}`, language)}>
                  <Compass aria-hidden="true" size={18} strokeWidth={3} />
                  {t(language, "认识团团", "Meet Tuantuan")}
                </Link>
                <Link href={withLanguage(`/install/${guide.id}`, language)}>
                  <Download aria-hidden="true" size={17} strokeWidth={3} />
                  {t(language, "安装团团", "Install Tuantuan")}
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className={styles.seriesSection} aria-labelledby="series-heading">
          <header className={styles.sectionHeading}>
            <span>COLLECTIONS</span>
            <h2 id="series-heading">{t(language, "从一个世界开始", "Start with a world")}</h2>
          </header>

          <div className={styles.seriesList}>
            {PET_SERIES.map((series) => {
              const members = getSeriesPets(series);
              return (
                <article className={styles.seriesCard} key={series.id}>
                  <header className={styles.seriesCardHeader}>
                    <div>
                      <span>{series.status[language]}</span>
                      <p>{series.subtitle[language]}</p>
                      <h3>{series.name[language]}</h3>
                      <strong>{series.description[language]}</strong>
                    </div>
                    <Link href={withLanguage(`/series/${series.id}`, language)}>
                      {t(language, "打开系列", "Open series")}
                      <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
                    </Link>
                  </header>

                  <div className={styles.memberGrid}>
                    {members.map(({ pet, profile }) => (
                      <Link
                        className={styles.memberCard}
                        href={withLanguage(`/pets/${pet.id}`, language)}
                        style={{ "--member-soft": pet.softAccent } as MemberStyle}
                        key={pet.id}
                      >
                        <PetPreview
                          petId={pet.id}
                          className={styles.memberImage}
                          label={t(language, `${profile.name.zh}静态预览`, `${profile.name.en} preview`)}
                        />
                        <span>
                          <small>{profile.role[language]}</small>
                          <strong>{profile.name[language]}</strong>
                          <em>{profile.specialty[language]}</em>
                        </span>
                      </Link>
                    ))}
                  </div>

                  <Link className={styles.storyEntry} href={withLanguage(`/series/${series.id}#story`, language)}>
                    <span>{series.storyChapter[language]}</span>
                    <strong>{series.storyTitle[language]}</strong>
                    <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
