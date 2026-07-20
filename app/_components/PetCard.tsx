import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import type { Language, Pet } from "@/lib/pets";

import { PetPreview } from "./PetPreview";
import { t, withLanguage } from "./SiteChrome";
import styles from "./site-chrome.module.css";

type PetCardProps = {
  pet: Pet;
  language: Language;
  compact?: boolean;
};

type PetCardStyle = CSSProperties & {
  "--pet-accent": string;
  "--pet-soft": string;
};

export function PetCard({ pet, language, compact = false }: PetCardProps) {
  const name = pet.displayName[language];
  const style: PetCardStyle = {
    "--pet-accent": pet.accent,
    "--pet-soft": pet.softAccent,
  };

  return (
    <article className={`${styles.petCard} ${compact ? styles.petCardCompact : ""}`} style={style}>
      <Link
        className={styles.petCardVisual}
        href={withLanguage(`/pets/${pet.id}`, language)}
        prefetch={false}
        aria-label={t(language, `查看 ${name}`, `View ${name}`)}
      >
        <span className={styles.petBadge}>{pet.badge}</span>
        <PetPreview
          petId={pet.id}
          label={t(language, `${name}静态预览`, `${name} preview`)}
          className={styles.petCardSprite}
        />
      </Link>
      <div className={styles.petCardBody}>
        <p className={styles.monoLabel}>{pet.id}</p>
        <h2>{name}</h2>
        <p>{pet.tagline[language]}</p>
        <div className={styles.cardActions}>
          <Link className={styles.textLink} href={withLanguage(`/pets/${pet.id}`, language)} prefetch={false}>
            {t(language, "认识它", "Meet this pet")}
            <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
          </Link>
          <Link className={styles.smallButton} href={withLanguage(`/install/${pet.id}`, language)} prefetch={false}>
            {t(language, "安装", "Install")}
          </Link>
        </div>
      </div>
    </article>
  );
}
