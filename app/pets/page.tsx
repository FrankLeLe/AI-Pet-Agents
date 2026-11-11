import { ArrowRight, Compass, Download } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { PetPreview } from "../_components/PetPreview";
import { normalizeLanguage, PageShell, t, withLanguage } from "../_components/SiteChrome";
import { getPetById } from "@/lib/pets";
import {
  GUIDE_PET_ID,
  GUIDE_PROFILE,
  getEditorialSeries,
  getSeriesPets,
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
  const series = getEditorialSeries();

  return (
    <PageShell language={language} currentPath="/pets">
      <main className={styles.main} id="main-content">
        <section className={styles.intro}>
          <div>
            <span>{t(language, "认识会动的小伙伴", "Meet your desktop companions")}</span>
            <h1>{t(language, "宠物图鉴", "PET INDEX")}</h1>
          </div>
          <p>
            {t(
              language,
              "每个系列都有自己的世界、角色和彼此相连的故事。",
              "Every collection has its own world, characters, and connected stories.",
            )}
          </p>
        </section>

        <section className={styles.seriesSection} aria-labelledby="series-heading">
          <header className={styles.sectionHeading}>
            <span>{t(language, "伙伴们的世界", "Their little worlds")}</span>
            <h2 id="series-heading">{t(language, "先看新来的伙伴", "MEET THE NEW ARRIVALS")}</h2>
          </header>

          <div className={styles.seriesList}>
            {series.map((collection) => {
              const members = getSeriesPets(collection);
              return (
                <article className={styles.seriesCard} key={collection.id}>
                  <header className={styles.seriesCardHeader}>
                    <div>
                      <span>{collection.status[language]}</span>
                      <p>{collection.subtitle[language]}</p>
                      <h3>{collection.name[language]}</h3>
                      <strong>{collection.description[language]}</strong>
                    </div>
                    <Link href={withLanguage(`/series/${collection.id}`, language)}>
                      {collection.id === "desk-corner-friends"
                        ? t(language, "认识桌角小居民", "Meet the corner friends")
                        : collection.id === "cat-companion-club"
                          ? t(language, "挑一只猫", "Meet the cats")
                          : collection.id === "desktop-work-crew"
                            ? t(language, "认识工作小队", "Meet the work crew")
                            : t(language, "挑一位守护鸭", "Meet the guardians")}
                      <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
                    </Link>
                  </header>

                  <p className={styles.memberScrollHint}>
                    {t(language, "横向滑动查看更多角色", "Swipe sideways to see more characters")}
                  </p>

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
                          label={t(language, `${profile.name.zh}形象`, `${profile.name.en} preview`)}
                        />
                        <span>
                          <small>{profile.role[language]}</small>
                          <strong>{profile.name[language]}</strong>
                          <em>{profile.specialty[language]}</em>
                        </span>
                      </Link>
                    ))}
                  </div>

                  <Link className={styles.storyEntry} href={withLanguage(`/series/${collection.id}#story`, language)}>
                    <span>{collection.storyChapter[language]}</span>
                    <strong>{collection.storyTitle[language]}</strong>
                    <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {guide ? (
          <section className={styles.guideCard} aria-labelledby="guide-card-heading">
            <div className={styles.guideVisual}>
              <PetPreview
                petId={guide.id}
                eager
                className={styles.guideImage}
                label={t(language, "星铠团团形象", "Star-Armor Tuantuan preview")}
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
      </main>
    </PageShell>
  );
}
