import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ANIMATIONS, getPetById, PETS } from "@/lib/pets";
import type { AnimationKey } from "@/lib/pets";

import { PetCard } from "../../_components/PetCard";
import { PetPlayground } from "../../_components/PetPlayground";
import { SpritePet } from "../../_components/SpritePet";
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
  const relatedPets = PETS.filter((item) => item.id !== pet.id).slice(0, 3);
  const accentStyle: PetAccentStyle = {
    "--pet-accent": pet.accent,
    "--pet-soft": pet.softAccent,
  };

  return (
    <PageShell language={language} currentPath={`/pets/${pet.id}`}>
      <main className={styles.mainContent} id="main-content">
        <nav className={styles.breadcrumbs} aria-label={t(language, "面包屑导航", "Breadcrumb")}>
          <Link href={withLanguage("/pets", language)}>{t(language, "全部宠物", "All pets")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>

        <section className={styles.petDetailHero} style={accentStyle}>
          <div className={styles.petDetailCopy}>
            <p className={styles.eyebrow}>{pet.badge}</p>
            <h1>{name}</h1>
            <p className={styles.petTagline}>{pet.tagline[language]}</p>
            <p className={styles.petDescription}>{pet.description[language]}</p>
            <ul className={styles.tagList} aria-label={t(language, "性格标签", "Personality tags")}>
              {pet.personalityTags.map((tag) => (
                <li key={tag.en}>{tag[language]}</li>
              ))}
            </ul>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href={withLanguage(`/install/${pet.id}`, language)}>
                {t(language, "带它回 Codex", "Bring it to Codex")}
              </Link>
              <a className={styles.secondaryButton} href={pet.downloadPath} download>
                {t(language, "直接下载 ZIP", "Download ZIP")}
              </a>
            </div>
            <p className={styles.microcopy}>
              {t(language, "无需账号 · v2 格式 · 安装后重启 Codex", "No account · v2 format · Restart Codex after install")}
            </p>
          </div>
          <div className={styles.petPortrait}>
            <span>{t(language, "你的桌面搭子", "YOUR DESK COMPANION")}</span>
            <SpritePet
              petId={pet.id}
              animation="idle"
              eager
              label={t(language, `${name}待机动画`, `${name} idle animation`)}
              className={styles.detailSprite}
            />
            <strong>{pet.id}</strong>
          </div>
        </section>

        <PetPlayground
          language={language}
          petId={pet.id}
          petName={name}
          initialAnimation={initialAnimation}
        />

        <section className={styles.emotionGrid} aria-label={t(language, "陪伴时刻", "Companion moments")}>
          <article>
            <span>01</span>
            <h2>{t(language, "你专注时", "WHILE YOU FOCUS")}</h2>
            <p>{t(language, "它安静待在一旁，不抢走注意力。", "It stays quietly present without asking for attention.")}</p>
          </article>
          <article>
            <span>02</span>
            <h2>{t(language, "你卡住时", "WHEN YOU GET STUCK")}</h2>
            <p>{t(language, "失败不是红色警报，只是一起停一下。", "A setback is not an alarm. It is a moment to pause together.")}</p>
          </article>
          <article>
            <span>03</span>
            <h2>{t(language, "你完成时", "WHEN IT'S DONE")}</h2>
            <p>{t(language, "一个小动作，也能让完成更有仪式感。", "One small motion gives finishing a little ceremony.")}</p>
          </article>
        </section>

        <section className={styles.contentSection} aria-labelledby="more-pets-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>KEEP LOOKING</p>
              <h2 id="more-pets-heading">{t(language, "也看看它的朋友", "MEET THE REST OF THE CREW")}</h2>
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
