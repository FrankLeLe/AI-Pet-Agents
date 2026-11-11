import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getPetById } from "@/lib/pets";
import { GUIDE_PET_ID, GUIDE_PROFILE, getEditorialPetIds, getMemberProfile, getProductName } from "@/lib/series";

import { PetPreview } from "../_components/PetPreview";
import { normalizeLanguage, PageShell, t, withLanguage } from "../_components/SiteChrome";
import styles from "../_components/site-chrome.module.css";

type InstallIndexPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function InstallIndexPage({ searchParams }: InstallIndexPageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);
  const pets = getEditorialPetIds().flatMap((petId) => {
    const pet = getPetById(petId);
    return pet ? [pet] : [];
  });

  return (
    <PageShell language={language} currentPath="/install">
      <main className={styles.mainContent} id="main-content">
        <section className={`${styles.pageIntro} ${styles.pageIntroBlue}`}>
          <div>
            <p className={styles.eyebrow}>INSTALL</p>
            <h1 data-copy-role="page-headline">
              {t(language, "选一位伙伴", "CHOOSE A PET")}
            </h1>
          </div>
          <p>
            {t(
              language,
              "选中一位伙伴，把它带回 Codex Desktop。",
              "Choose a companion and bring it to Codex Desktop.",
            )}
          </p>
        </section>

        <section className={styles.contentSection} aria-labelledby="choose-install-pet">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>PETS</p>
              <h2 id="choose-install-pet" data-copy-role="card-headline">
                {t(language, "全部伙伴", "ALL PETS")}
              </h2>
            </div>
          </div>
          <div className={styles.installPetGrid}>
            {pets.map((pet) => {
              const profile = getMemberProfile(pet.id);
              const isGuide = pet.id === GUIDE_PET_ID;
              const name = getProductName(pet, language);
              const label = isGuide ? GUIDE_PROFILE.role[language] : profile?.role[language] ?? pet.badge;

              return (
              <Link
                className={styles.installPetCard}
                href={withLanguage(`/install/${pet.id}`, language)}
                prefetch={false}
                style={{ "--pet-accent": pet.accent, "--pet-soft": pet.softAccent } as React.CSSProperties}
                key={pet.id}
              >
                <PetPreview
                  petId={pet.id}
                  label={name}
                  className={styles.installPetSprite}
                />
                <span>
                  <small>{label}</small>
                  <strong>{name}</strong>
                  <em>
                    {t(language, "带回 Codex", "Bring to Codex")}
                    <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
                  </em>
                </span>
              </Link>
              );
            })}
          </div>
        </section>

        <aside className={styles.helpStrip}>
          <div>
            <strong>{t(language, "宠物没出现？", "Pet not showing?")}</strong>
            <p>{t(language, "先试着重新打开 Codex，或看看常见问题。", "Try reopening Codex, or check the common questions.")}</p>
          </div>
          <Link className={styles.darkButton} href={withLanguage("/help", language)}>
            {t(language, "获取帮助", "Get help")}
          </Link>
        </aside>
      </main>
    </PageShell>
  );
}
