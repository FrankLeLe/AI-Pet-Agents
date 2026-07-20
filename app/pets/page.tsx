import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PETS } from "@/lib/pets";

import { PetCard } from "../_components/PetCard";
import { SpritePet } from "../_components/SpritePet";
import { normalizeLanguage, PageShell, t, withLanguage } from "../_components/SiteChrome";
import styles from "../_components/site-chrome.module.css";

type PetsPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function PetsPage({ searchParams }: PetsPageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);
  const featuredPet = PETS[0];

  return (
    <PageShell language={language} currentPath="/pets">
      <main className={styles.mainContent} id="main-content">
        <section className={styles.pageHero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>THE COMPANION ROSTER / 04</p>
            <h1>{t(language, "挑一只，陪你把今天做完。", "CHOOSE SOME COMPANY FOR THE WORK AHEAD.")}</h1>
            <p className={styles.heroLead}>
              {t(
                language,
                "不是换一张桌面壁纸，而是选一个会在等待、工作和完成时回应你的搭子。先看看性格，再听听直觉。",
                "This is more than a desktop skin. Choose a companion that reacts to waiting, working, and finishing. Read the personality, then trust your instinct.",
              )}
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#all-pets">
                {t(language, "开始挑选", "Meet the pets")}
              </a>
              <Link className={styles.secondaryButton} href={withLanguage("/install", language)}>
                {t(language, "先看安装方法", "See how installation works")}
              </Link>
            </div>
            <ul className={styles.proofList}>
              <li>{t(language, "无需登录", "No login")}</li>
              <li>{t(language, "真实 v2 图集", "Real v2 sprites")}</li>
              <li>{t(language, "下载后归你使用", "Yours after download")}</li>
            </ul>
          </div>
          <div className={styles.heroVisual} style={{ "--pet-accent": featuredPet.accent } as React.CSSProperties}>
            <span className={styles.heroSticker}>{t(language, "今天谁陪你？", "WHO'S WITH YOU TODAY?")}</span>
            <SpritePet
              petId={featuredPet.id}
              animation="waving"
              eager
              label={t(
                language,
                `${featuredPet.displayName.zh}正在挥手`,
                `${featuredPet.displayName.en} waving`,
              )}
              className={styles.heroSprite}
            />
            <p>{t(language, "点开角色，可以试玩全部动作。", "Open a pet to try every animation.")}</p>
          </div>
        </section>

        <section className={styles.contentSection} id="all-pets" aria-labelledby="pets-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>PICK BY PERSONALITY</p>
              <h2 id="pets-heading">{t(language, "四种性格，四种陪伴", "FOUR PERSONALITIES. FOUR WAYS TO STAY CLOSE.")}</h2>
            </div>
            <p>
              {t(
                language,
                "进入详情页试听它的工作、等待与失败动作。喜欢，就直接下载或进入安装向导。",
                "Open a detail page to preview working, waiting, and setback animations. When one feels right, download it or follow the install guide.",
              )}
            </p>
          </div>
          <div className={styles.petGrid}>
            {PETS.map((pet) => (
              <PetCard pet={pet} language={language} key={pet.id} />
            ))}
          </div>
        </section>

        <section className={styles.splitCallout}>
          <div>
            <p className={styles.eyebrow}>NOT QUITE YOURS?</p>
            <h2>{t(language, "没有一只完全像你？那就孵一只自己的。", "NONE FEEL QUITE LIKE YOU? HATCH YOUR OWN.")}</h2>
          </div>
          <Link className={styles.darkButton} href={withLanguage("/hatch", language)}>
            {t(language, "了解 Hatch Pet", "Explore Hatch Pet")}
            <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
          </Link>
        </section>
      </main>
    </PageShell>
  );
}
