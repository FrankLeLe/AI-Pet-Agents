import {
  PET_EDITORIAL_CONTENT,
  type PetEditorialContent,
} from "./pet-content";
import { SPRITE_FORMAT } from "./pet-animation";

export {
  ANIMATIONS,
  ANIMATION_KEYS,
  SPRITE_FORMAT,
  type AnimationDefinition,
  type AnimationKey,
} from "./pet-animation";

export const LANGUAGES = ["zh", "en"] as const;

export type Language = (typeof LANGUAGES)[number];

export type LocalizedText = Readonly<Record<Language, string>>;

export const PET_NEEDS = ["start", "steady", "solve", "create", "comfort"] as const;

export type PetNeed = (typeof PET_NEEDS)[number];

export type Pet = {
  readonly id: string;
  readonly status: "published";
  readonly category: "bronze-cat" | "zodiac-duck";
  readonly zodiacOrder: number | null;
  readonly needs: readonly PetNeed[];
  readonly displayName: LocalizedText;
  readonly tagline: LocalizedText;
  readonly description: LocalizedText;
  readonly personalityTags: readonly LocalizedText[];
  readonly editorial: PetEditorialContent;
  readonly badge: string;
  readonly accent: string;
  readonly softAccent: string;
  readonly spriteVersionNumber: typeof SPRITE_FORMAT.spriteVersionNumber;
  readonly spritesheetPath: string;
  readonly previewPath: string;
  readonly manifestPath: string;
  readonly downloadPath: string;
  readonly detailPath: string;
};

const PET_DEFINITIONS = [
  {
    id: "star-armor-tuantuan",
    category: "bronze-cat",
    zodiacOrder: null,
    needs: ["comfort", "start"],
    displayName: { zh: "星铠团团", en: "Star-Armor Tuantuan" },
    badge: "BRONZE 00",
    accent: "#4b68ff",
    softAccent: "#dfe5ff",
  },
  {
    id: "aries-ramcrest-duck",
    category: "zodiac-duck",
    zodiacOrder: 1,
    needs: ["start"],
    displayName: { zh: "白羊金翎鸭", en: "Aries Ramcrest Duck" },
    badge: "ARIES 01",
    accent: "#ff6b58",
    softAccent: "#ffd8d2",
  },
  {
    id: "taurus-bullguard-duck",
    category: "zodiac-duck",
    zodiacOrder: 2,
    needs: ["steady"],
    displayName: { zh: "金牛鎏甲鸭", en: "Taurus Bullguard Duck" },
    badge: "TAURUS 02",
    accent: "#3db98d",
    softAccent: "#c9f5e5",
  },
  {
    id: "gemini-twincrest-duck",
    category: "zodiac-duck",
    zodiacOrder: 3,
    needs: ["solve", "create"],
    displayName: { zh: "双子镜辉鸭", en: "Gemini Twincrest Duck" },
    badge: "GEMINI 03",
    accent: "#ffce43",
    softAccent: "#fff0ad",
  },
  {
    id: "cancer-shellguard-duck",
    category: "zodiac-duck",
    zodiacOrder: 4,
    needs: ["comfort"],
    displayName: { zh: "巨蟹甲壳鸭", en: "Cancer Shellguard Duck" },
    badge: "CANCER 04",
    accent: "#ff9c84",
    softAccent: "#ffe0d7",
  },
  {
    id: "leo-manehelm-duck",
    category: "zodiac-duck",
    zodiacOrder: 5,
    needs: ["create", "start"],
    displayName: { zh: "狮子鬃焰鸭", en: "Leo Manehelm Duck" },
    badge: "LEO 05",
    accent: "#ff9f2f",
    softAccent: "#ffe3b8",
  },
  {
    id: "virgo-lotuscrest-duck",
    category: "zodiac-duck",
    zodiacOrder: 6,
    needs: ["solve", "steady"],
    displayName: { zh: "处女莲冠鸭", en: "Virgo Lotuscrest Duck" },
    badge: "VIRGO 06",
    accent: "#6ecba8",
    softAccent: "#d7f4e8",
  },
  {
    id: "libra-balanceguard-duck",
    category: "zodiac-duck",
    zodiacOrder: 7,
    needs: ["solve", "steady"],
    displayName: { zh: "天秤衡光鸭", en: "Libra Balanceguard Duck" },
    badge: "LIBRA 07",
    accent: "#a68cff",
    softAccent: "#e7e0ff",
  },
  {
    id: "scorpio-stingtalon-duck",
    category: "zodiac-duck",
    zodiacOrder: 8,
    needs: ["solve"],
    displayName: { zh: "天蝎针尾鸭", en: "Scorpio Stingtalon Duck" },
    badge: "SCORPIO 08",
    accent: "#c75272",
    softAccent: "#f3d4dc",
  },
  {
    id: "sagittarius-arrowwing-duck",
    category: "zodiac-duck",
    zodiacOrder: 9,
    needs: ["create", "start"],
    displayName: { zh: "人马箭翼鸭", en: "Sagittarius Arrowwing Duck" },
    badge: "SAGITTARIUS 09",
    accent: "#4da7dc",
    softAccent: "#d4ecf8",
  },
  {
    id: "capricorn-goathorn-duck",
    category: "zodiac-duck",
    zodiacOrder: 10,
    needs: ["steady"],
    displayName: { zh: "摩羯岩角鸭", en: "Capricorn Goathorn Duck" },
    badge: "CAPRICORN 10",
    accent: "#b88754",
    softAccent: "#ecdbc7",
  },
  {
    id: "aquarius-vesselwing-duck",
    category: "zodiac-duck",
    zodiacOrder: 11,
    needs: ["create", "solve"],
    displayName: { zh: "宝瓶澜甲鸭", en: "Aquarius Vesselwing Duck" },
    badge: "AQUARIUS 11",
    accent: "#39b8c8",
    softAccent: "#cff2f4",
  },
  {
    id: "pisces-fintail-duck",
    category: "zodiac-duck",
    zodiacOrder: 12,
    needs: ["create", "comfort"],
    displayName: { zh: "双鱼鳍辉鸭", en: "Pisces Fintail Duck" },
    badge: "PISCES 12",
    accent: "#d36bc0",
    softAccent: "#f4d8ee",
  },
] as const satisfies readonly {
  id: string;
  category: Pet["category"];
  zodiacOrder: number | null;
  needs: readonly PetNeed[];
  displayName: LocalizedText;
  badge: string;
  accent: string;
  softAccent: string;
}[];

export type PetId = (typeof PET_DEFINITIONS)[number]["id"];

export const PETS = PET_DEFINITIONS.map((definition) => {
  const editorial = PET_EDITORIAL_CONTENT[definition.id];

  return {
    ...definition,
    status: "published" as const,
    tagline: { zh: editorial.promiseZh, en: editorial.promiseEn },
    description: { zh: editorial.comfortZh, en: editorial.comfortEn },
    personalityTags: editorial.traitsZh.map((zh, index) => ({
      zh,
      en: editorial.traitsEn[index] ?? editorial.traitsEn[0],
    })),
    editorial,
    spriteVersionNumber: SPRITE_FORMAT.spriteVersionNumber,
    spritesheetPath: `/pets/${definition.id}/spritesheet.webp`,
    previewPath: `/pets/${definition.id}/preview.webp`,
    manifestPath: `/pets/${definition.id}/pet.json`,
    downloadPath: `/downloads/${definition.id}.zip`,
    detailPath: `/api/v1/pets/${definition.id}.json`,
  };
}) satisfies readonly Pet[];

export const DEFAULT_PET_ID: PetId = "star-armor-tuantuan";

export function getPetById(id: string): Pet | undefined {
  return PETS.find((pet) => pet.id === id);
}

export function isPetId(id: string): id is PetId {
  return PETS.some((pet) => pet.id === id);
}
