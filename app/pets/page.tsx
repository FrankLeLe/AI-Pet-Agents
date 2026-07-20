import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PET_NEEDS, PETS } from "@/lib/pets";
import type { PetNeed } from "@/lib/pets";

import { PetCard } from "../_components/PetCard";
import { PetPreview } from "../_components/PetPreview";
import { normalizeLanguage, PageShell, t, withLanguage } from "../_components/SiteChrome";
import styles from "../_components/site-chrome.module.css";

type PetsPageProps = {
  searchParams: Promise<{
    lang?: string | string[];
    need?: string | string[];
  }>;
};

const NEED_FILTERS: readonly {
  key: "all" | PetNeed;
  zh: string;
  en: string;
}[] = [
  { key: "all", zh: "全部 13 只", en: "All 13" },
  { key: "start", zh: "需要开始", en: "Get started" },
  { key: "steady", zh: "稳稳推进", en: "Stay steady" },
  { key: "solve", zh: "解开难题", en: "Solve a knot" },
  { key: "create", zh: "寻找灵感", en: "Find a spark" },
  { key: "comfort", zh: "想被接住", en: "Feel supported" },
];

function normalizeNeed(value: string | string[] | undefined): "all" | PetNeed {
  const candidate = Array.isArray(value) ? value[0] : value;
  return PET_NEEDS.includes(candidate as PetNeed) ? (candidate as PetNeed) : "all";
}

export default async function PetsPage({ searchParams }: PetsPageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);
  const selectedNeed = normalizeNeed(query.need);
  const visiblePets =
    selectedNeed === "all"
      ? PETS
      : PETS.filter((pet) => pet.needs.includes(selectedNeed));
  const featuredPet = visiblePets[0] ?? PETS[0];

  return (
    <PageShell language={language} currentPath="/pets">
      <main className={styles.mainContent} id="main-content">
        <section className={styles.pageHero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>THE ASTER DOCK ROSTER / 13</p>
            <h1>{t(language, "今天需要哪一种陪伴？", "WHAT KIND OF COMPANY DO YOU NEED TODAY?")}</h1>
            <p className={styles.heroLead}>
              {t(
                language,
                "十二只星域守护鸭与青铜见习守护猫团团，分别照看开始、坚持、调试、创作与那些想被接住的时刻。先选感受，再遇见角色。",
                "Twelve zodiac guardian ducks and one bronze apprentice cat look after beginnings, persistence, debugging, creating, and the moments when you need a softer landing.",
              )}
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#all-pets">
                {t(language, "按今天的状态挑选", "Choose by today's mood")}
              </a>
              <Link className={styles.secondaryButton} href={withLanguage("/install", language)}>
                {t(language, "查看 3 分钟安装", "See the 3-minute install")}
              </Link>
            </div>
            <ul className={styles.proofList}>
              <li>{t(language, "13 只原创角色", "13 original characters")}</li>
              <li>{t(language, "真实 v2 图集", "Real v2 sprites")}</li>
              <li>{t(language, "无需登录", "No login")}</li>
            </ul>
          </div>
          <div
            className={styles.heroVisual}
            style={{ "--pet-accent": featuredPet.accent } as React.CSSProperties}
          >
            <span className={styles.heroSticker}>
              {t(language, `推荐：${featuredPet.displayName.zh}`, `MEET ${featuredPet.displayName.en}`)}
            </span>
            <PetPreview
              petId={featuredPet.id}
              eager
              label={t(
                language,
                `${featuredPet.displayName.zh}静态预览`,
                `${featuredPet.displayName.en} preview`,
              )}
              className={styles.heroSprite}
            />
            <p>{featuredPet.editorial.promiseZh}</p>
          </div>
        </section>

        <section className={styles.contentSection} id="all-pets" aria-labelledby="pets-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>PICK BY WHAT YOU NEED</p>
              <h2 id="pets-heading">
                {t(language, "13 份性格，13 种回应", "13 CHARACTERS. 13 WAYS TO RESPOND.")}
              </h2>
            </div>
            <p>
              {t(
                language,
                "目录只加载轻量静态预览。进入角色专栏后，才会载入完整动画、原创故事与专属安装向导。",
                "The roster loads lightweight previews. Full animation, original lore, and the dedicated install guide appear only inside a character column.",
              )}
            </p>
          </div>

          <nav className={styles.filterBar} aria-label={t(language, "按需要筛选宠物", "Filter pets by need")}>
            {NEED_FILTERS.map((filter) => {
              const active = selectedNeed === filter.key;
              const path = filter.key === "all" ? "/pets#all-pets" : `/pets?need=${filter.key}#all-pets`;

              return (
                <Link
                  className={active ? styles.filterActive : undefined}
                  href={withLanguage(path, language)}
                  prefetch={false}
                  aria-current={active ? "page" : undefined}
                  key={filter.key}
                >
                  {t(language, filter.zh, filter.en)}
                </Link>
              );
            })}
          </nav>

          <p className={styles.resultCount} aria-live="polite">
            {t(
              language,
              `为你找到 ${visiblePets.length} 只桌面搭子`,
              `${visiblePets.length} desktop companions found`,
            )}
          </p>

          <div className={styles.petGrid}>
            {visiblePets.map((pet) => (
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
            {t(language, "安装 Hatch Pet Skill", "Install Hatch Pet Skill")}
            <ArrowRight aria-hidden="true" size={19} strokeWidth={3} />
          </Link>
        </section>
      </main>
    </PageShell>
  );
}
